import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, ClipboardList, CheckCircle2, FileSearch, Send, XCircle, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AppStatus = "applied" | "documents_submitted" | "under_review" | "approved" | "rejected";

interface Application {
  id: string;
  scheme_name: string;
  status: AppStatus;
  notes: string | null;
  applied_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<AppStatus, { label_hi: string; label_en: string; icon: any; color: string }> = {
  applied: { label_hi: "आवेदन किया", label_en: "Applied", icon: Send, color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  documents_submitted: { label_hi: "दस्तावेज़ जमा", label_en: "Docs Submitted", icon: ClipboardList, color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
  under_review: { label_hi: "समीक्षा में", label_en: "Under Review", icon: FileSearch, color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  approved: { label_hi: "स्वीकृत", label_en: "Approved", icon: CheckCircle2, color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  rejected: { label_hi: "अस्वीकृत", label_en: "Rejected", icon: XCircle, color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
};

const STAGES: AppStatus[] = ["applied", "documents_submitted", "under_review", "approved"];

const ApplicationTracker = () => {
  const { t, lang } = useLang();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newApp, setNewApp] = useState({ scheme_name: "", notes: "" });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchApps();
  }, [user]);

  const fetchApps = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("application_tracker" as any)
      .select("*")
      .eq("user_id", user.id)
      .order("applied_at", { ascending: false });
    if (data) setApps(data as any);
    setLoading(false);
  };

  const addApp = async () => {
    if (!user || !newApp.scheme_name.trim()) return;
    setAdding(true);
    const { error } = await supabase.from("application_tracker" as any).insert({
      user_id: user.id,
      scheme_name: newApp.scheme_name,
      notes: newApp.notes || null,
      status: "applied",
    } as any);
    setAdding(false);
    if (error) {
      toast({ title: t("त्रुटि", "Error"), variant: "destructive" });
    } else {
      toast({ title: t("आवेदन जोड़ा गया!", "Application added!") });
      setNewApp({ scheme_name: "", notes: "" });
      setDialogOpen(false);
      fetchApps();
    }
  };

  const updateStatus = async (id: string, status: AppStatus) => {
    await supabase.from("application_tracker" as any).update({ status } as any).eq("id", id);
    fetchApps();
  };

  const deleteApp = async (id: string) => {
    await supabase.from("application_tracker" as any).delete().eq("id", id);
    fetchApps();
  };

  const getStageIndex = (status: AppStatus) => STAGES.indexOf(status);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="container py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-hindi">{t("आवेदन ट्रैकर", "Application Tracker")}</h1>
          <p className="text-sm text-muted-foreground font-hindi">
            {t("अपने योजना आवेदनों की स्थिति ट्रैक करें", "Track your scheme application status")}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="font-hindi gap-1"><Plus className="h-4 w-4" />{t("नया", "New")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-hindi">{t("नया आवेदन जोड़ें", "Add New Application")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label className="font-hindi">{t("योजना का नाम", "Scheme Name")} *</Label>
                <Input
                  value={newApp.scheme_name}
                  onChange={(e) => setNewApp((p) => ({ ...p, scheme_name: e.target.value }))}
                  placeholder={t("जैसे: PM किसान सम्मान", "e.g. PM Kisan Samman")}
                />
              </div>
              <div>
                <Label className="font-hindi">{t("नोट्स", "Notes")}</Label>
                <Textarea
                  value={newApp.notes}
                  onChange={(e) => setNewApp((p) => ({ ...p, notes: e.target.value }))}
                  placeholder={t("कोई अतिरिक्त जानकारी...", "Any additional info...")}
                  rows={3}
                />
              </div>
              <Button onClick={addApp} disabled={adding || !newApp.scheme_name.trim()} className="w-full font-hindi">
                {adding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("जोड़ें", "Add")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {apps.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-hindi">
              {t("कोई आवेदन नहीं। ऊपर 'नया' बटन से जोड़ें।", "No applications yet. Click 'New' to add one.")}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => {
            const cfg = STATUS_CONFIG[app.status];
            const Icon = cfg.icon;
            const stageIdx = getStageIndex(app.status);

            return (
              <Card key={app.id}>
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold font-hindi">{app.scheme_name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {t("आवेदन तिथि:", "Applied:")} {new Date(app.applied_at).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${cfg.color} gap-1`}>
                        <Icon className="h-3 w-3" />
                        {lang === "hi" ? cfg.label_hi : cfg.label_en}
                      </Badge>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteApp(app.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="flex gap-1 mb-3">
                    {STAGES.map((stage, i) => (
                      <div
                        key={stage}
                        className={`h-2 flex-1 rounded-full transition-colors ${
                          i <= stageIdx && app.status !== "rejected"
                            ? "bg-primary"
                            : app.status === "rejected" ? "bg-destructive/30" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>

                  {app.notes && (
                    <p className="text-sm text-muted-foreground font-hindi mb-3 bg-muted/50 p-2 rounded">{app.notes}</p>
                  )}

                  <Select value={app.status} onValueChange={(v) => updateStatus(app.id, v as AppStatus)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                        <SelectItem key={key} value={key}>
                          {lang === "hi" ? val.label_hi : val.label_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
