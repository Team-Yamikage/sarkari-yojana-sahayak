import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Printer, FileCheck, Download } from "lucide-react";
import { downloadChecklistAsPdf } from "@/lib/generatePdf";

interface Scheme {
  id: string;
  name_hi: string;
  name_en: string;
  required_documents: string[] | null;
}

const DocumentChecklist = () => {
  const { t, lang } = useLang();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("schemes").select("id, name_hi, name_en, required_documents").eq("is_active", true);
      if (data) setSchemes(data as Scheme[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const selected = schemes.find((s) => s.id === selectedId);
  const docs = selected?.required_documents || [];
  const checkedCount = docs.filter((d) => checked[d]).length;
  const progress = docs.length > 0 ? Math.round((checkedCount / docs.length) * 100) : 0;

  const toggleDoc = (doc: string) => setChecked((prev) => ({ ...prev, [doc]: !prev[doc] }));

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setChecked({});
  };

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold font-hindi text-center mb-2">
        {t("दस्तावेज़ चेकलिस्ट", "Document Checklist")}
      </h1>
      <p className="text-center text-muted-foreground font-hindi mb-6">
        {t("योजना चुनें और अपने दस्तावेज़ तैयार करें", "Select a scheme and prepare your documents")}
      </p>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <Select value={selectedId} onValueChange={handleSelect}>
            <SelectTrigger className="mb-6">
              <SelectValue placeholder={t("योजना चुनें...", "Select a scheme...")} />
            </SelectTrigger>
            <SelectContent>
              {schemes.map((s) => (
                <SelectItem key={s.id} value={s.id}>{lang === "hi" ? s.name_hi : s.name_en}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selected && docs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="font-hindi text-lg flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  {lang === "hi" ? selected.name_hi : selected.name_en}
                </CardTitle>
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-hindi">{t("प्रगति", "Progress")}</span>
                    <span className="font-medium">{checkedCount}/{docs.length} ({progress}%)</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {docs.map((doc, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Checkbox checked={!!checked[doc]} onCheckedChange={() => toggleDoc(doc)} />
                    <span className={`text-sm font-hindi ${checked[doc] ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {doc}
                    </span>
                  </label>
                ))}
                <div className="flex gap-2 mt-4">
                  <Button onClick={() => window.print()} variant="outline" className="flex-1 gap-2 font-hindi">
                    <Printer className="h-4 w-4" />
                    {t("प्रिंट करें", "Print")}
                  </Button>
                  <Button
                    onClick={() => downloadChecklistAsPdf(
                      lang === "hi" ? selected!.name_hi : selected!.name_en,
                      docs,
                      checked
                    )}
                    variant="outline"
                    className="flex-1 gap-2 font-hindi"
                  >
                    <Download className="h-4 w-4" />
                    {t("PDF डाउनलोड", "Download PDF")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {selected && docs.length === 0 && (
            <p className="text-center text-muted-foreground py-8 font-hindi">
              {t("इस योजना के लिए दस्तावेज़ सूची उपलब्ध नहीं है", "No document list available for this scheme")}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default DocumentChecklist;
