import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X, GitCompare, ExternalLink } from "lucide-react";

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
}

const SchemeCompare = () => {
  const { t, lang } = useLang();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("schemes").select("*").eq("is_active", true).order("category");
      if (data) setSchemes(data as any);
      setLoading(false);
    };
    fetch();
  }, []);

  const addScheme = (id: string) => {
    if (selected.length < 3 && !selected.includes(id)) setSelected([...selected, id]);
  };

  const removeScheme = (id: string) => setSelected(selected.filter((s) => s !== id));

  const compared = selected.map((id) => schemes.find((s) => s.id === id)!).filter(Boolean);
  const name = (s: Scheme) => (lang === "hi" ? s.name_hi : s.name_en);
  const desc = (s: Scheme) => (lang === "hi" ? s.description_hi : s.description_en) || "-";

  const rows: { label: string; render: (s: Scheme) => React.ReactNode }[] = [
    { label: t("श्रेणी", "Category"), render: (s) => <Badge variant="secondary">{s.category}</Badge> },
    { label: t("विवरण", "Description"), render: (s) => <p className="text-sm">{desc(s)}</p> },
    {
      label: t("दस्तावेज़", "Documents"),
      render: (s) =>
        s.required_documents?.length ? (
          <ul className="text-sm list-disc pl-4 space-y-1">{s.required_documents.map((d, i) => <li key={i}>{d}</li>)}</ul>
        ) : "-",
    },
    {
      label: t("लक्ष्य समूह", "Target Group"),
      render: (s) => s.target_group?.length ? (
        <div className="flex flex-wrap gap-1">{s.target_group.map((g, i) => <Badge key={i} variant="outline" className="text-xs">{g}</Badge>)}</div>
      ) : "-",
    },
    {
      label: t("आवेदन लिंक", "Apply Link"),
      render: (s) => s.apply_link ? (
        <a href={s.apply_link} target="_blank" rel="noopener noreferrer" className="text-primary text-sm flex items-center gap-1 hover:underline">
          {t("आवेदन करें", "Apply")} <ExternalLink className="h-3 w-3" />
        </a>
      ) : "-",
    },
  ];

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="container py-8">
      <h1 className="text-2xl md:text-3xl font-bold font-hindi text-center mb-2">
        {t("योजना तुलना करें", "Compare Schemes")}
      </h1>
      <p className="text-center text-muted-foreground font-hindi mb-6">
        {t("अधिकतम 3 योजनाओं की तुलना करें", "Compare up to 3 schemes side by side")}
      </p>

      {/* Selector */}
      <div className="max-w-md mx-auto mb-6">
        <Select onValueChange={addScheme} value="">
          <SelectTrigger>
            <SelectValue placeholder={t("योजना जोड़ें...", "Add a scheme...")} />
          </SelectTrigger>
          <SelectContent>
            {schemes.filter((s) => !selected.includes(s.id)).map((s) => (
              <SelectItem key={s.id} value={s.id}>{name(s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {compared.map((s) => (
              <Badge key={s.id} className="gap-1 pr-1">
                {name(s)}
                <button onClick={() => removeScheme(s.id)} className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {compared.length >= 2 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 text-sm font-medium text-muted-foreground w-32">{t("पहलू", "Aspect")}</th>
                {compared.map((s) => (
                  <th key={s.id} className="text-left p-3 text-sm font-bold font-hindi">{name(s)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3 text-sm font-medium text-muted-foreground font-hindi align-top">{row.label}</td>
                  {compared.map((s) => (
                    <td key={s.id} className="p-3 align-top font-hindi">{row.render(s)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {compared.length < 2 && selected.length > 0 && (
        <p className="text-center text-muted-foreground font-hindi py-8">
          {t("तुलना के लिए कम से कम 2 योजनाएं चुनें", "Select at least 2 schemes to compare")}
        </p>
      )}
    </div>
  );
};

export default SchemeCompare;
