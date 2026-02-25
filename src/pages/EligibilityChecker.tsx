import { useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const STATES = [
  "Uttar Pradesh", "Maharashtra", "Bihar", "Madhya Pradesh", "Rajasthan",
  "Tamil Nadu", "Karnataka", "Gujarat", "Andhra Pradesh", "West Bengal",
  "Jharkhand", "Chhattisgarh", "Odisha", "Punjab", "Haryana",
  "Delhi", "Uttarakhand", "Himachal Pradesh", "Assam", "Kerala",
  "Telangana", "Jammu & Kashmir", "Goa", "Tripura", "Meghalaya",
  "Manipur", "Nagaland", "Mizoram", "Arunachal Pradesh", "Sikkim",
];

const EligibilityChecker = () => {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [form, setForm] = useState({
    name: "", age: "", gender: "", state: "", district: "",
    category: "", occupation: "", annual_income: "", has_disability: "no",
  });

  const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.gender || !form.state || !form.category || !form.occupation || !form.annual_income) {
      toast({ title: t("कृपया सभी ज़रूरी जानकारी भरें", "Please fill all required fields"), variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const resp = await supabase.functions.invoke("ai-chat", {
        body: {
          type: "eligibility",
          data: { ...form, age: parseInt(form.age), annual_income: parseInt(form.annual_income), has_disability: form.has_disability === "yes" },
          lang,
        },
      });
      if (resp.error) throw resp.error;
      setResult(resp.data?.result || t("कोई जवाब नहीं मिला", "No response received"));

      // Save to DB
      await supabase.from("eligibility_checks").insert({
        name: form.name, age: parseInt(form.age), gender: form.gender,
        state: form.state, district: form.district, category: form.category,
        occupation: form.occupation, annual_income: parseInt(form.annual_income),
        has_disability: form.has_disability === "yes", ai_response: resp.data?.result,
      });
    } catch (err: any) {
      console.error(err);
      toast({ title: t("कुछ गड़बड़ हुई, फिर कोशिश करें", "Something went wrong, please try again"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl md:text-3xl font-bold font-hindi text-center mb-2">
        {t("पात्रता जांचें", "Check Your Eligibility")}
      </h1>
      <p className="text-center text-muted-foreground font-hindi mb-6">
        {t("अपनी जानकारी भरें, AI बताएगा कौन-सी योजनाएं आपके लिए हैं", "Fill your details, AI will suggest relevant schemes")}
      </p>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-hindi">{t("जानकारी भरें", "Enter Details")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="font-hindi">{t("नाम", "Name")} *</Label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder={t("अपना नाम लिखें", "Enter your name")} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-hindi">{t("उम्र", "Age")} *</Label>
                  <Input type="number" value={form.age} onChange={(e) => update("age", e.target.value)} placeholder="25" />
                </div>
                <div>
                  <Label className="font-hindi">{t("लिंग", "Gender")} *</Label>
                  <Select value={form.gender} onValueChange={(v) => update("gender", v)}>
                    <SelectTrigger><SelectValue placeholder={t("चुनें", "Select")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t("पुरुष", "Male")}</SelectItem>
                      <SelectItem value="female">{t("महिला", "Female")}</SelectItem>
                      <SelectItem value="other">{t("अन्य", "Other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-hindi">{t("राज्य", "State")} *</Label>
                  <Select value={form.state} onValueChange={(v) => update("state", v)}>
                    <SelectTrigger><SelectValue placeholder={t("चुनें", "Select")} /></SelectTrigger>
                    <SelectContent>
                      {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-hindi">{t("जिला", "District")}</Label>
                  <Input value={form.district} onChange={(e) => update("district", e.target.value)} placeholder={t("जिले का नाम", "District name")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-hindi">{t("वर्ग", "Category")} *</Label>
                  <Select value={form.category} onValueChange={(v) => update("category", v)}>
                    <SelectTrigger><SelectValue placeholder={t("चुनें", "Select")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">{t("सामान्य", "General")}</SelectItem>
                      <SelectItem value="obc">{t("ओबीसी", "OBC")}</SelectItem>
                      <SelectItem value="sc">{t("एससी", "SC")}</SelectItem>
                      <SelectItem value="st">{t("एसटी", "ST")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="font-hindi">{t("व्यवसाय", "Occupation")} *</Label>
                  <Select value={form.occupation} onValueChange={(v) => update("occupation", v)}>
                    <SelectTrigger><SelectValue placeholder={t("चुनें", "Select")} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">{t("विद्यार्थी", "Student")}</SelectItem>
                      <SelectItem value="farmer">{t("किसान", "Farmer")}</SelectItem>
                      <SelectItem value="labour">{t("मजदूर", "Labour")}</SelectItem>
                      <SelectItem value="business">{t("व्यापार", "Business")}</SelectItem>
                      <SelectItem value="other">{t("अन्य", "Other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-hindi">{t("वार्षिक आय (₹)", "Annual Income (₹)")} *</Label>
                  <Input type="number" value={form.annual_income} onChange={(e) => update("annual_income", e.target.value)} placeholder="100000" />
                </div>
                <div>
                  <Label className="font-hindi">{t("विकलांगता", "Disability")} *</Label>
                  <Select value={form.has_disability} onValueChange={(v) => update("has_disability", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">{t("नहीं", "No")}</SelectItem>
                      <SelectItem value="yes">{t("हाँ", "Yes")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full font-hindi" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("पात्रता जांचें", "Check Eligibility")}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result */}
        <Card className={result ? "border-success/30" : ""}>
          <CardHeader>
            <CardTitle className="font-hindi">{t("AI का जवाब", "AI Response")}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 font-hindi text-muted-foreground">{t("AI सोच रहा है...", "AI is thinking...")}</span>
              </div>
            ) : result ? (
              <div className="prose prose-sm max-w-none font-hindi whitespace-pre-wrap text-foreground">
                {result}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-12 font-hindi">
                {t("अपनी जानकारी भरें और जवाब यहाँ दिखेगा", "Fill your details and response will appear here")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EligibilityChecker;
