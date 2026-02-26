import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Scheme {
  id: string;
  name_hi: string;
  name_en: string;
  description_hi: string | null;
  description_en: string | null;
  category: string;
  required_documents: string[] | null;
  target_group: string[] | null;
  apply_link: string | null;
  eligibility_criteria: any;
}

const CATEGORIES = [
  { value: "all", label_hi: "सभी", label_en: "All" },
  { value: "education", label_hi: "शिक्षा", label_en: "Education" },
  { value: "health", label_hi: "स्वास्थ्य", label_en: "Health" },
  { value: "agriculture", label_hi: "कृषि", label_en: "Agriculture" },
  { value: "general", label_hi: "सामान्य", label_en: "General" },
  { value: "housing", label_hi: "आवास", label_en: "Housing" },
  { value: "employment", label_hi: "रोजगार", label_en: "Employment" },
];

const SchemeExplainer = () => {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [schemesLoading, setSchemesLoading] = useState(true);

  // AI explainer
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState("");

  useEffect(() => {
    const fetchSchemes = async () => {
      setSchemesLoading(true);
      const { data } = await supabase.from("schemes").select("*").eq("is_active", true).order("category");
      if (data) setSchemes(data as any);
      setSchemesLoading(false);
    };
    fetchSchemes();
  }, []);

  const filtered = schemes.filter((s) => {
    const matchCat = category === "all" || s.category === category;
    const matchSearch = !searchQuery ||
      s.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name_hi.includes(searchQuery);
    return matchCat && matchSearch;
  });

  const handleAiExplain = async (schemeName: string) => {
    setAiQuery(schemeName);
    setAiLoading(true);
    setAiResult("");
    try {
      const resp = await supabase.functions.invoke("ai-chat", {
        body: { type: "explain", data: { scheme_name: schemeName }, lang },
      });
      if (resp.error) throw resp.error;
      setAiResult(resp.data?.result || t("कोई जवाब नहीं मिला", "No response"));
    } catch {
      toast({ title: t("कुछ गड़बड़ हुई", "Something went wrong"), variant: "destructive" });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    await handleAiExplain(aiQuery);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "education": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "health": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "agriculture": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl md:text-3xl font-bold font-hindi text-center mb-2">
        {t("योजना समझें", "Understand Government Schemes")}
      </h1>
      <p className="text-center text-muted-foreground font-hindi mb-6">
        {t("सरकारी योजनाओं को ब्राउज़ करें या AI से समझें", "Browse government schemes or ask AI to explain")}
      </p>

      {/* AI Explainer */}
      <Card className="max-w-3xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="font-hindi text-lg">{t("AI से योजना समझें", "Ask AI to Explain")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAiSubmit} className="flex gap-2 mb-4">
            <Input
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder={t("योजना का नाम लिखें...", "Enter scheme name...")}
              className="font-hindi"
            />
            <Button type="submit" disabled={aiLoading}>
              {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </Button>
          </form>
          {aiResult && (
            <div className="prose prose-sm max-w-none font-hindi whitespace-pre-wrap text-foreground bg-muted/50 p-4 rounded-lg">
              {aiResult}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("योजना खोजें...", "Search schemes...")}
            className="font-hindi"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {lang === "hi" ? c.label_hi : c.label_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Schemes List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {schemesLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-12 font-hindi">
            {t("कोई योजना नहीं मिली", "No schemes found")}
          </p>
        ) : (
          filtered.map((s) => (
            <Card key={s.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                      <h3 className="font-semibold font-hindi">
                        {lang === "hi" ? s.name_hi : s.name_en}
                      </h3>
                    </div>
                    <Badge className={`text-xs mb-2 ${getCategoryColor(s.category)}`}>
                      {s.category}
                    </Badge>
                    {(lang === "hi" ? s.description_hi : s.description_en) && (
                      <p className="text-sm text-muted-foreground font-hindi mt-1">
                        {lang === "hi" ? s.description_hi : s.description_en}
                      </p>
                    )}
                    {s.required_documents && s.required_documents.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {t("ज़रूरी दस्तावेज़:", "Documents:")}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {s.required_documents.map((d, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{d}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-hindi flex-shrink-0"
                    onClick={() => handleAiExplain(lang === "hi" ? s.name_hi : s.name_en)}
                  >
                    {t("समझें", "Explain")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SchemeExplainer;
