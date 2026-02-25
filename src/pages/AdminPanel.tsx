import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Users, FileText, BarChart3 } from "lucide-react";

interface Scheme {
  id: string;
  name_hi: string;
  name_en: string;
  description_hi: string | null;
  description_en: string | null;
  category: string;
  is_active: boolean;
}

interface EligibilityCheck {
  id: string;
  name: string;
  age: number;
  state: string;
  occupation: string;
  category: string;
  created_at: string;
}

const AdminPanel = () => {
  const { t, lang } = useLang();
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [checks, setChecks] = useState<EligibilityCheck[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newScheme, setNewScheme] = useState({ name_hi: "", name_en: "", description_hi: "", description_en: "", category: "general" });

  const fetchData = async () => {
    const [sRes, cRes] = await Promise.all([
      supabase.from("schemes").select("*").order("created_at", { ascending: false }),
      supabase.from("eligibility_checks").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    if (sRes.data) setSchemes(sRes.data);
    if (cRes.data) setChecks(cRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const addScheme = async () => {
    if (!newScheme.name_hi || !newScheme.name_en) {
      toast({ title: t("नाम भरें", "Fill name"), variant: "destructive" });
      return;
    }
    await supabase.from("schemes").insert(newScheme);
    setDialogOpen(false);
    setNewScheme({ name_hi: "", name_en: "", description_hi: "", description_en: "", category: "general" });
    fetchData();
    toast({ title: t("योजना जोड़ दी गई", "Scheme added") });
  };

  const deleteScheme = async (id: string) => {
    await supabase.from("schemes").delete().eq("id", id);
    fetchData();
    toast({ title: t("योजना हटा दी गई", "Scheme deleted") });
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold font-hindi mb-6">{t("एडमिन पैनल", "Admin Panel")}</h1>

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
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="h-4 w-4 mr-1" /> {t("नई योजना", "Add Scheme")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-hindi">{t("नई योजना जोड़ें", "Add New Scheme")}</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Name (Hindi)</Label><Input value={newScheme.name_hi} onChange={(e) => setNewScheme(p => ({ ...p, name_hi: e.target.value }))} /></div>
                  <div><Label>Name (English)</Label><Input value={newScheme.name_en} onChange={(e) => setNewScheme(p => ({ ...p, name_en: e.target.value }))} /></div>
                  <div><Label>Description (Hindi)</Label><Input value={newScheme.description_hi} onChange={(e) => setNewScheme(p => ({ ...p, description_hi: e.target.value }))} /></div>
                  <div><Label>Description (English)</Label><Input value={newScheme.description_en} onChange={(e) => setNewScheme(p => ({ ...p, description_en: e.target.value }))} /></div>
                  <Button onClick={addScheme} className="w-full">{t("जोड़ें", "Add")}</Button>
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
                    <TableCell>
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
