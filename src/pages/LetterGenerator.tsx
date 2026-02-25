import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LetterGenerator = () => {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ reason: "", name: "", details: "" });

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const reasons = [
    { value: "scholarship", label: t("छात्रवृत्ति", "Scholarship") },
    { value: "pension", label: t("पेंशन", "Pension") },
    { value: "complaint", label: t("शिकायत", "Complaint") },
    { value: "job", label: t("नौकरी आवेदन", "Job Application") },
    { value: "certificate", label: t("प्रमाण पत्र", "Certificate Request") },
    { value: "other", label: t("अन्य", "Other") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.reason || !form.name) {
      toast({ title: t("कृपया सभी जानकारी भरें", "Please fill all fields"), variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const resp = await supabase.functions.invoke("ai-chat", {
        body: { type: "letter", data: form, lang },
      });
      if (resp.error) throw resp.error;
      setResult(resp.data?.result || "");
    } catch {
      toast({ title: t("कुछ गड़बड़ हुई", "Something went wrong"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast({ title: t("कॉपी हो गया!", "Copied!") });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold font-hindi text-center mb-2">
        {t("आवेदन पत्र बनाएं", "Generate Application Letter")}
      </h1>
      <p className="text-center text-muted-foreground font-hindi mb-6">
        {t("AI हिंदी में प्रोफेशनल पत्र बनाएगा", "AI will generate professional Hindi letter")}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-hindi">{t("जानकारी भरें", "Enter Details")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="font-hindi">{t("आवेदन का कारण", "Reason")} *</Label>
                <Select value={form.reason} onValueChange={(v) => update("reason", v)}>
                  <SelectTrigger><SelectValue placeholder={t("चुनें", "Select")} /></SelectTrigger>
                  <SelectContent>
                    {reasons.map((r) => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-hindi">{t("आपका नाम", "Your Name")} *</Label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder={t("नाम लिखें", "Enter name")} />
              </div>
              <div>
                <Label className="font-hindi">{t("अतिरिक्त विवरण", "Additional Details")}</Label>
                <Textarea
                  value={form.details}
                  onChange={(e) => update("details", e.target.value)}
                  placeholder={t("कोई अतिरिक्त जानकारी...", "Any additional info...")}
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full font-hindi" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("पत्र बनाएं", "Generate Letter")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-hindi">{t("आपका पत्र", "Your Letter")}</CardTitle>
            {result && (
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : result ? (
              <div className="prose prose-sm max-w-none font-hindi whitespace-pre-wrap text-foreground bg-muted/50 p-4 rounded-md">
                {result}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12 font-hindi">
                {t("पत्र यहाँ दिखेगा", "Letter will appear here")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LetterGenerator;
