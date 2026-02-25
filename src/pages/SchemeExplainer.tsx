import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SchemeExplainer = () => {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const resp = await supabase.functions.invoke("ai-chat", {
        body: { type: "explain", data: { scheme_name: query }, lang },
      });
      if (resp.error) throw resp.error;
      setResult(resp.data?.result || t("कोई जवाब नहीं मिला", "No response"));
    } catch (err) {
      console.error(err);
      toast({ title: t("कुछ गड़बड़ हुई", "Something went wrong"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const popularSchemes = [
    t("प्रधानमंत्री किसान सम्मान निधि", "PM Kisan Samman Nidhi"),
    t("आयुष्मान भारत", "Ayushman Bharat"),
    t("उज्ज्वला योजना", "Ujjwala Yojana"),
    t("प्रधानमंत्री आवास योजना", "PM Awas Yojana"),
  ];

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold font-hindi text-center mb-2">
        {t("योजना समझें", "Understand Any Scheme")}
      </h1>
      <p className="text-center text-muted-foreground font-hindi mb-6">
        {t("किसी भी सरकारी योजना का नाम लिखें, AI सरल भाषा में समझाएगा", "Type any government scheme name, AI will explain simply")}
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("योजना का नाम लिखें...", "Enter scheme name...")}
          className="font-hindi"
        />
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        {popularSchemes.map((s) => (
          <Button key={s} variant="outline" size="sm" className="font-hindi text-xs" onClick={() => setQuery(s)}>
            {s}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-hindi">{t("AI की जानकारी", "AI Explanation")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 font-hindi text-muted-foreground">{t("AI सोच रहा है...", "AI is thinking...")}</span>
            </div>
          ) : result ? (
            <div className="prose prose-sm max-w-none font-hindi whitespace-pre-wrap text-foreground">{result}</div>
          ) : (
            <p className="text-muted-foreground text-center py-12 font-hindi">
              {t("ऊपर किसी योजना का नाम लिखें", "Enter a scheme name above")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchemeExplainer;
