import { useState, useEffect } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Heart, FileText, Briefcase, ExternalLink, Trash2 } from "lucide-react";

const SavedItems = () => {
  const { t, lang } = useLang();
  const { schemeIds, jobIds, toggle } = useBookmarks();
  const [schemes, setSchemes] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const promises: Promise<void>[] = [];

      if (schemeIds.length > 0) {
        promises.push(
          supabase.from("schemes").select("*").in("id", schemeIds).then(({ data }) => {
            if (data) setSchemes(data);
          })
        );
      } else setSchemes([]);

      if (jobIds.length > 0) {
        promises.push(
          supabase.from("govt_jobs").select("*").in("id", jobIds).then(({ data }) => {
            if (data) setJobs(data);
          })
        );
      } else setJobs([]);

      await Promise.all(promises);
      setLoading(false);
    };
    fetchData();
  }, [schemeIds, jobIds]);

  const empty = schemes.length === 0 && jobs.length === 0;

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-bold font-hindi text-center mb-2">
        <Heart className="inline h-6 w-6 text-destructive mr-2" />
        {t("सेव की गई योजनाएं व नौकरियां", "Saved Schemes & Jobs")}
      </h1>
      <p className="text-center text-muted-foreground font-hindi mb-6">
        {t("आपकी बुकमार्क की गई योजनाएं और नौकरियां", "Your bookmarked schemes and jobs")}
      </p>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : empty ? (
        <p className="text-center text-muted-foreground py-12 font-hindi">
          {t("कोई सेव की गई आइटम नहीं", "No saved items yet")}
        </p>
      ) : (
        <>
          {schemes.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold font-hindi mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t("योजनाएं", "Schemes")} ({schemes.length})
              </h2>
              <div className="space-y-3">
                {schemes.map((s) => (
                  <Card key={s.id}>
                    <CardContent className="pt-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold font-hindi">{lang === "hi" ? s.name_hi : s.name_en}</h3>
                        <Badge variant="secondary" className="text-xs mt-1">{s.category}</Badge>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => toggle("scheme", s.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          {jobs.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold font-hindi mb-3 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                {t("नौकरियां", "Jobs")} ({jobs.length})
              </h2>
              <div className="space-y-3">
                {jobs.map((j) => (
                  <Card key={j.id}>
                    <CardContent className="pt-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{j.post_name}</h3>
                        <p className="text-sm text-muted-foreground">{j.department}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => toggle("job", j.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedItems;
