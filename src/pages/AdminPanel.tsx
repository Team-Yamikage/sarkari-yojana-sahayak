import { useEffect, useState, useCallback } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Users, FileText, BarChart3, Lock, LogOut, Edit, Briefcase } from "lucide-react";

// --- Types ---
interface Scheme {
  id: string;
  name_hi: string;
  name_en: string;
  description_hi: string | null;
  description_en: string | null;
  category: string;
  is_active: boolean;
  eligibility_criteria: any;
  required_documents: string[] | null;
  target_group: string[] | null;
  apply_link: string | null;
}

interface EligibilityCheck {
  id: string;
  name: string;
  age: number;
  state: string;
  district: string;
  occupation: string;
  category: string;
  gender: string;
  annual_income: number;
  created_at: string;
}

interface GovtJob {
  id: string;
  post_name: string;
  department: string;
  total_vacancies: number;
  qualification: string;
  min_age: number;
  max_age: number;
  fee_general: number | null;
  fee_obc: number | null;
  fee_sc_st: number | null;
  registration_start: string;
  registration_end: string;
  selection_process: string | null;
  description: string | null;
  apply_link: string | null;
  state: string | null;
}

const SESSION_KEY = "admin_session_token";

// --- Sub-components ---
const AdminLogin = ({ onLogin }: { onLogin: (token: string) => void }) => {
  const { t } = useLang();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    try {
      const resp = await supabase.functions.invoke("admin-auth", {
        body: { action: "login", password },
      });
      if (resp.data?.success && resp.data?.token) {
        onLogin(resp.data.token);
        toast({ title: t("लॉगिन सफल", "Login successful") });
      } else {
        toast({ title: t("गलत पासवर्ड", "Invalid password"), variant: "destructive" });
      }
    } catch {
      toast({ title: t("कुछ गड़बड़ हुई", "Something went wrong"), variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Lock className="h-10 w-10 text-primary mx-auto mb-2" />
          <CardTitle className="font-hindi">{t("एडमिन लॉगिन", "Admin Login")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="font-hindi">{t("पासवर्ड", "Password")}</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("पासवर्ड डालें", "Enter password")} autoFocus />
            </div>
            <Button type="submit" className="w-full font-hindi" disabled={loading}>
              {loading ? t("जांच हो रही है...", "Verifying...") : t("लॉगिन करें", "Login")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Scheme Dialog Form ---
const SchemeForm = ({ scheme, onSave, onCancel }: {
  scheme: Scheme | null;
  onSave: (data: any, id?: string) => void;
  onCancel: () => void;
}) => {
  const { t } = useLang();
  const [form, setForm] = useState({
    name_hi: scheme?.name_hi || "",
    name_en: scheme?.name_en || "",
    description_hi: scheme?.description_hi || "",
    description_en: scheme?.description_en || "",
    category: scheme?.category || "general",
    apply_link: scheme?.apply_link || "",
    required_documents: scheme?.required_documents?.join(", ") || "",
    eligibility_criteria: scheme?.eligibility_criteria ? JSON.stringify(scheme.eligibility_criteria) : "",
    target_group: scheme?.target_group?.join(", ") || "",
  });

  const handleSave = () => {
    if (!form.name_hi || !form.name_en) return;
    const payload = {
      name_hi: form.name_hi,
      name_en: form.name_en,
      description_hi: form.description_hi || null,
      description_en: form.description_en || null,
      category: form.category,
      apply_link: form.apply_link || null,
      required_documents: form.required_documents ? form.required_documents.split(",").map(s => s.trim()).filter(Boolean) : [],
      target_group: form.target_group ? form.target_group.split(",").map(s => s.trim()).filter(Boolean) : [],
      eligibility_criteria: form.eligibility_criteria ? (() => { try { return JSON.parse(form.eligibility_criteria); } catch { return { description: form.eligibility_criteria }; } })() : {},
    };
    onSave(payload, scheme?.id);
  };

  const set = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div className="space-y-3">
      <div><Label>Name (Hindi)</Label><Input value={form.name_hi} onChange={e => set("name_hi", e.target.value)} /></div>
      <div><Label>Name (English)</Label><Input value={form.name_en} onChange={e => set("name_en", e.target.value)} /></div>
      <div><Label>Description (Hindi)</Label><Textarea value={form.description_hi} onChange={e => set("description_hi", e.target.value)} /></div>
      <div><Label>Description (English)</Label><Textarea value={form.description_en} onChange={e => set("description_en", e.target.value)} /></div>
      <div>
        <Label>Category</Label>
        <Select value={form.category} onValueChange={v => set("category", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {["education", "health", "agriculture", "general", "housing", "employment"].map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div><Label>Apply Link</Label><Input value={form.apply_link} onChange={e => set("apply_link", e.target.value)} /></div>
      <div><Label>Required Documents (comma-separated)</Label><Input value={form.required_documents} onChange={e => set("required_documents", e.target.value)} /></div>
      <div><Label>Target Group (comma-separated)</Label><Input value={form.target_group} onChange={e => set("target_group", e.target.value)} /></div>
      <div><Label>Eligibility Criteria (JSON or text)</Label><Textarea value={form.eligibility_criteria} onChange={e => set("eligibility_criteria", e.target.value)} /></div>
      <Button onClick={handleSave} className="w-full">
        {scheme ? t("अपडेट करें", "Update") : t("जोड़ें", "Add")}
      </Button>
    </div>
  );
};

// --- Job Dialog Form ---
const JobForm = ({ job, onSave }: {
  job: GovtJob | null;
  onSave: (data: any, id?: string) => void;
}) => {
  const { t } = useLang();
  const [form, setForm] = useState({
    post_name: job?.post_name || "",
    department: job?.department || "",
    total_vacancies: job?.total_vacancies || 1,
    qualification: job?.qualification || "Graduate",
    min_age: job?.min_age || 18,
    max_age: job?.max_age || 35,
    fee_general: job?.fee_general || 0,
    fee_obc: job?.fee_obc || 0,
    fee_sc_st: job?.fee_sc_st || 0,
    registration_start: job?.registration_start || new Date().toISOString().split("T")[0],
    registration_end: job?.registration_end || "",
    selection_process: job?.selection_process || "",
    description: job?.description || "",
    apply_link: job?.apply_link || "",
    state: job?.state || "All India",
  });

  const set = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));

  const handleSave = () => {
    if (!form.post_name || !form.department) return;
    onSave(form, job?.id);
  };

  return (
    <div className="space-y-3">
      <div><Label>Post Name</Label><Input value={form.post_name} onChange={e => set("post_name", e.target.value)} /></div>
      <div><Label>Department</Label><Input value={form.department} onChange={e => set("department", e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Total Vacancies</Label><Input type="number" value={form.total_vacancies} onChange={e => set("total_vacancies", +e.target.value)} /></div>
        <div>
          <Label>Qualification</Label>
          <Select value={form.qualification} onValueChange={v => set("qualification", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["10th", "12th", "ITI", "Diploma", "Graduate", "Postgraduate"].map(q => (
                <SelectItem key={q} value={q}>{q}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Min Age</Label><Input type="number" value={form.min_age} onChange={e => set("min_age", +e.target.value)} /></div>
        <div><Label>Max Age</Label><Input type="number" value={form.max_age} onChange={e => set("max_age", +e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div><Label>Fee (Gen)</Label><Input type="number" value={form.fee_general} onChange={e => set("fee_general", +e.target.value)} /></div>
        <div><Label>Fee (OBC)</Label><Input type="number" value={form.fee_obc} onChange={e => set("fee_obc", +e.target.value)} /></div>
        <div><Label>Fee (SC/ST)</Label><Input type="number" value={form.fee_sc_st} onChange={e => set("fee_sc_st", +e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Start Date</Label><Input type="date" value={form.registration_start} onChange={e => set("registration_start", e.target.value)} /></div>
        <div><Label>End Date</Label><Input type="date" value={form.registration_end} onChange={e => set("registration_end", e.target.value)} /></div>
      </div>
      <div><Label>Selection Process</Label><Input value={form.selection_process} onChange={e => set("selection_process", e.target.value)} /></div>
      <div><Label>Description</Label><Textarea value={form.description} onChange={e => set("description", e.target.value)} /></div>
      <div><Label>Apply Link</Label><Input value={form.apply_link} onChange={e => set("apply_link", e.target.value)} /></div>
      <div><Label>State</Label><Input value={form.state} onChange={e => set("state", e.target.value)} placeholder="All India" /></div>
      <Button onClick={handleSave} className="w-full">
        {job ? t("अपडेट करें", "Update") : t("जोड़ें", "Add")}
      </Button>
    </div>
  );
};

// --- Main Component ---
const AdminPanel = () => {
  const { t, lang } = useLang();
  const { toast } = useToast();

  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [checks, setChecks] = useState<EligibilityCheck[]>([]);
  const [jobs, setJobs] = useState<GovtJob[]>([]);
  const [schemeDialogOpen, setSchemeDialogOpen] = useState(false);
  const [jobDialogOpen, setJobDialogOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [editingJob, setEditingJob] = useState<GovtJob | null>(null);

  const getToken = () => sessionStorage.getItem(SESSION_KEY);

  const verifySession = useCallback(async () => {
    const token = getToken();
    if (!token) { setAuthLoading(false); return; }
    try {
      const resp = await supabase.functions.invoke("admin-auth", { body: { action: "verify", token } });
      if (resp.data?.valid) setAuthenticated(true);
      else sessionStorage.removeItem(SESSION_KEY);
    } catch { sessionStorage.removeItem(SESSION_KEY); }
    setAuthLoading(false);
  }, []);

  useEffect(() => { verifySession(); }, [verifySession]);

  const handleLoginSuccess = (token: string) => {
    sessionStorage.setItem(SESSION_KEY, token);
    setAuthenticated(true);
  };

  const handleLogout = async () => {
    const token = getToken();
    await supabase.functions.invoke("admin-auth", { body: { action: "logout", token } });
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  const fetchData = async () => {
    const [sRes, cRes, jRes] = await Promise.all([
      supabase.from("schemes").select("*").order("created_at", { ascending: false }),
      supabase.from("eligibility_checks").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("govt_jobs").select("*").order("created_at", { ascending: false }),
    ]);
    if (sRes.data) setSchemes(sRes.data as any);
    if (cRes.data) setChecks(cRes.data as any);
    if (jRes.data) setJobs(jRes.data as any);
  };

  useEffect(() => { if (authenticated) fetchData(); }, [authenticated]);

  // Scheme CRUD
  const saveScheme = async (payload: any, id?: string) => {
    if (id) {
      await supabase.from("schemes").update(payload).eq("id", id);
      toast({ title: t("योजना अपडेट की गई", "Scheme updated") });
    } else {
      await supabase.from("schemes").insert(payload);
      toast({ title: t("योजना जोड़ दी गई", "Scheme added") });
    }
    setSchemeDialogOpen(false);
    setEditingScheme(null);
    fetchData();
  };

  const deleteScheme = async (id: string) => {
    await supabase.from("schemes").delete().eq("id", id);
    toast({ title: t("योजना हटा दी गई", "Scheme deleted") });
    fetchData();
  };

  // Job CRUD
  const saveJob = async (payload: any, id?: string) => {
    if (id) {
      await supabase.from("govt_jobs").update(payload).eq("id", id);
      toast({ title: t("नौकरी अपडेट की गई", "Job updated") });
    } else {
      await supabase.from("govt_jobs").insert(payload);
      toast({ title: t("नौकरी जोड़ दी गई", "Job added") });
    }
    setJobDialogOpen(false);
    setEditingJob(null);
    fetchData();
  };

  const deleteJob = async (id: string) => {
    await supabase.from("govt_jobs").delete().eq("id", id);
    toast({ title: t("नौकरी हटा दी गई", "Job deleted") });
    fetchData();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authenticated) {
    return <AdminLogin onLogin={handleLoginSuccess} />;
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-hindi">{t("एडमिन पैनल", "Admin Panel")}</h1>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1">
          <LogOut className="h-4 w-4" /> {t("लॉगआउट", "Logout")}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4 text-center">
            <FileText className="h-6 w-6 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold">{schemes.length}</div>
            <p className="text-xs text-muted-foreground font-hindi">{t("योजनाएं", "Schemes")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Briefcase className="h-6 w-6 text-secondary mx-auto mb-1" />
            <div className="text-2xl font-bold">{jobs.length}</div>
            <p className="text-xs text-muted-foreground font-hindi">{t("नौकरियां", "Jobs")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold">{checks.length}</div>
            <p className="text-xs text-muted-foreground font-hindi">{t("पात्रता जांच", "Checks")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <BarChart3 className="h-6 w-6 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold">{new Set(checks.map(c => c.state)).size}</div>
            <p className="text-xs text-muted-foreground font-hindi">{t("राज्य", "States")}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schemes">
        <TabsList>
          <TabsTrigger value="schemes" className="font-hindi">{t("योजनाएं", "Schemes")}</TabsTrigger>
          <TabsTrigger value="jobs" className="font-hindi">{t("नौकरियां", "Jobs")}</TabsTrigger>
          <TabsTrigger value="submissions" className="font-hindi">{t("उपयोगकर्ता", "Users")}</TabsTrigger>
        </TabsList>

        {/* Schemes Tab */}
        <TabsContent value="schemes">
          <div className="flex justify-end mb-3">
            <Dialog open={schemeDialogOpen} onOpenChange={(open) => { setSchemeDialogOpen(open); if (!open) setEditingScheme(null); }}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" /> {t("नई योजना", "Add Scheme")}</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-hindi">
                    {editingScheme ? t("योजना संपादित करें", "Edit Scheme") : t("नई योजना जोड़ें", "Add New Scheme")}
                  </DialogTitle>
                </DialogHeader>
                <SchemeForm scheme={editingScheme} onSave={saveScheme} onCancel={() => setSchemeDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-hindi">{t("योजना", "Scheme")}</TableHead>
                  <TableHead className="font-hindi">{t("श्रेणी", "Category")}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schemes.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-hindi">{lang === "hi" ? s.name_hi : s.name_en}</TableCell>
                    <TableCell>{s.category}</TableCell>
                    <TableCell className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingScheme(s); setSchemeDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteScheme(s.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs">
          <div className="flex justify-end mb-3">
            <Dialog open={jobDialogOpen} onOpenChange={(open) => { setJobDialogOpen(open); if (!open) setEditingJob(null); }}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" /> {t("नई नौकरी", "Add Job")}</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-hindi">
                    {editingJob ? t("नौकरी संपादित करें", "Edit Job") : t("नई नौकरी जोड़ें", "Add New Job")}
                  </DialogTitle>
                </DialogHeader>
                <JobForm job={editingJob} onSave={saveJob} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("पद", "Post")}</TableHead>
                  <TableHead>{t("विभाग", "Department")}</TableHead>
                  <TableHead>{t("पद संख्या", "Vacancies")}</TableHead>
                  <TableHead>{t("अंतिम तिथि", "Last Date")}</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell className="font-medium">{j.post_name}</TableCell>
                    <TableCell className="text-sm">{j.department}</TableCell>
                    <TableCell>{j.total_vacancies}</TableCell>
                    <TableCell>{new Date(j.registration_end).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingJob(j); setJobDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteJob(j.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="submissions">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("नाम", "Name")}</TableHead>
                  <TableHead>{t("उम्र", "Age")}</TableHead>
                  <TableHead>{t("राज्य", "State")}</TableHead>
                  <TableHead>{t("जिला", "District")}</TableHead>
                  <TableHead>{t("व्यवसाय", "Occupation")}</TableHead>
                  <TableHead>{t("तारीख", "Date")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checks.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.age}</TableCell>
                    <TableCell>{c.state}</TableCell>
                    <TableCell>{c.district}</TableCell>
                    <TableCell>{c.occupation}</TableCell>
                    <TableCell>{new Date(c.created_at).toLocaleDateString("hi-IN")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
