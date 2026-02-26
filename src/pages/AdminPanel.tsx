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
import { Plus, Trash2, Users, FileText, BarChart3, Lock, LogOut, Edit } from "lucide-react";

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

const SESSION_KEY = "admin_session_token";

const AdminPanel = () => {
  const { t, lang } = useLang();
  const { toast } = useToast();

  // Auth state
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Data state
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [checks, setChecks] = useState<EligibilityCheck[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const [newScheme, setNewScheme] = useState({
    name_hi: "", name_en: "", description_hi: "", description_en: "",
    category: "general", apply_link: "", required_documents: "",
    eligibility_criteria: "", target_group: "",
  });

  const getToken = () => sessionStorage.getItem(SESSION_KEY);

  const verifySession = useCallback(async () => {
    const token = getToken();
    if (!token) { setAuthLoading(false); return; }
    try {
      const resp = await supabase.functions.invoke("admin-auth", {
        body: { action: "verify", token },
      });
      if (resp.data?.valid) {
        setAuthenticated(true);
      } else {
        sessionStorage.removeItem(SESSION_KEY);
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => { verifySession(); }, [verifySession]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoginLoading(true);
    try {
      const resp = await supabase.functions.invoke("admin-auth", {
        body: { action: "login", password },
      });
      if (resp.data?.success && resp.data?.token) {
        sessionStorage.setItem(SESSION_KEY, resp.data.token);
        setAuthenticated(true);
        setPassword("");
        toast({ title: t("लॉगिन सफल", "Login successful") });
      } else {
        toast({ title: t("गलत पासवर्ड", "Invalid password"), variant: "destructive" });
      }
    } catch {
      toast({ title: t("कुछ गड़बड़ हुई", "Something went wrong"), variant: "destructive" });
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    const token = getToken();
    await supabase.functions.invoke("admin-auth", { body: { action: "logout", token } });
    sessionStorage.removeItem(SESSION_KEY);
    setAuthenticated(false);
  };

  const fetchData = async () => {
    const [sRes, cRes] = await Promise.all([
      supabase.from("schemes").select("*").order("created_at", { ascending: false }),
      supabase.from("eligibility_checks").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    if (sRes.data) setSchemes(sRes.data as any);
    if (cRes.data) setChecks(cRes.data as any);
  };

  useEffect(() => { if (authenticated) fetchData(); }, [authenticated]);

  const resetForm = () => {
    setNewScheme({
      name_hi: "", name_en: "", description_hi: "", description_en: "",
      category: "general", apply_link: "", required_documents: "",
      eligibility_criteria: "", target_group: "",
    });
    setEditingScheme(null);
  };

  const addOrUpdateScheme = async () => {
    if (!newScheme.name_hi || !newScheme.name_en) {
      toast({ title: t("नाम भरें", "Fill name"), variant: "destructive" });
      return;
    }
    const payload = {
      name_hi: newScheme.name_hi,
      name_en: newScheme.name_en,
      description_hi: newScheme.description_hi || null,
      description_en: newScheme.description_en || null,
      category: newScheme.category,
      apply_link: newScheme.apply_link || null,
      required_documents: newScheme.required_documents ? newScheme.required_documents.split(",").map(s => s.trim()).filter(Boolean) : [],
      target_group: newScheme.target_group ? newScheme.target_group.split(",").map(s => s.trim()).filter(Boolean) : [],
      eligibility_criteria: newScheme.eligibility_criteria ? (() => { try { return JSON.parse(newScheme.eligibility_criteria); } catch { return { description: newScheme.eligibility_criteria }; } })() : {},
    };

    if (editingScheme) {
      await supabase.from("schemes").update(payload).eq("id", editingScheme.id);
      toast({ title: t("योजना अपडेट की गई", "Scheme updated") });
    } else {
      await supabase.from("schemes").insert(payload);
      toast({ title: t("योजना जोड़ दी गई", "Scheme added") });
    }
    setDialogOpen(false);
    resetForm();
    fetchData();
  };

  const deleteScheme = async (id: string) => {
    await supabase.from("schemes").delete().eq("id", id);
    fetchData();
    toast({ title: t("योजना हटा दी गई", "Scheme deleted") });
  };

  const startEdit = (s: Scheme) => {
    setEditingScheme(s);
    setNewScheme({
      name_hi: s.name_hi,
      name_en: s.name_en,
      description_hi: s.description_hi || "",
      description_en: s.description_en || "",
      category: s.category,
      apply_link: s.apply_link || "",
      required_documents: s.required_documents?.join(", ") || "",
      eligibility_criteria: s.eligibility_criteria ? JSON.stringify(s.eligibility_criteria) : "",
      target_group: s.target_group?.join(", ") || "",
    });
    setDialogOpen(true);
  };

  // Login screen
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authenticated) {
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
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("पासवर्ड डालें", "Enter password")}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full font-hindi" disabled={loginLoading}>
                {loginLoading ? t("जांच हो रही है...", "Verifying...") : t("लॉगिन करें", "Login")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
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
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4 text-center">
            <FileText className="h-6 w-6 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold">{schemes.length}</div>
            <p className="text-xs text-muted-foreground font-hindi">{t("योजनाएं", "Schemes")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Users className="h-6 w-6 text-secondary mx-auto mb-1" />
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
          <TabsTrigger value="submissions" className="font-hindi">{t("उपयोगकर्ता", "Users")}</TabsTrigger>
        </TabsList>

        <TabsContent value="schemes">
          <div className="flex justify-end mb-3">
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" /> {t("नई योजना", "Add Scheme")}</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-hindi">
                    {editingScheme ? t("योजना संपादित करें", "Edit Scheme") : t("नई योजना जोड़ें", "Add New Scheme")}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div><Label>Name (Hindi)</Label><Input value={newScheme.name_hi} onChange={(e) => setNewScheme(p => ({ ...p, name_hi: e.target.value }))} /></div>
                  <div><Label>Name (English)</Label><Input value={newScheme.name_en} onChange={(e) => setNewScheme(p => ({ ...p, name_en: e.target.value }))} /></div>
                  <div><Label>Description (Hindi)</Label><Textarea value={newScheme.description_hi} onChange={(e) => setNewScheme(p => ({ ...p, description_hi: e.target.value }))} /></div>
                  <div><Label>Description (English)</Label><Textarea value={newScheme.description_en} onChange={(e) => setNewScheme(p => ({ ...p, description_en: e.target.value }))} /></div>
                  <div>
                    <Label>Category</Label>
                    <Select value={newScheme.category} onValueChange={(v) => setNewScheme(p => ({ ...p, category: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="housing">Housing</SelectItem>
                        <SelectItem value="employment">Employment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Apply Link</Label><Input value={newScheme.apply_link} onChange={(e) => setNewScheme(p => ({ ...p, apply_link: e.target.value }))} placeholder="https://..." /></div>
                  <div><Label>Required Documents (comma-separated)</Label><Input value={newScheme.required_documents} onChange={(e) => setNewScheme(p => ({ ...p, required_documents: e.target.value }))} /></div>
                  <div><Label>Target Group (comma-separated)</Label><Input value={newScheme.target_group} onChange={(e) => setNewScheme(p => ({ ...p, target_group: e.target.value }))} /></div>
                  <div><Label>Eligibility Criteria (JSON or text)</Label><Textarea value={newScheme.eligibility_criteria} onChange={(e) => setNewScheme(p => ({ ...p, eligibility_criteria: e.target.value }))} /></div>
                  <Button onClick={addOrUpdateScheme} className="w-full">
                    {editingScheme ? t("अपडेट करें", "Update") : t("जोड़ें", "Add")}
                  </Button>
                </div>
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
                      <Button variant="ghost" size="sm" onClick={() => startEdit(s)}>
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
