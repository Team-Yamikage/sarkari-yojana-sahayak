import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, LogOut, User } from "lucide-react";

const Profile = () => {
  const { t, lang } = useLang();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    mobile_number: "",
    age: "",
    gender: "",
    category: "",
    state: "",
    district: "",
    annual_income: "",
    occupation: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles" as any).select("*").eq("id", user.id).single();
      if (data) {
        const d = data as any;
        setProfile({
          full_name: d.full_name || "",
          mobile_number: d.mobile_number || "",
          age: d.age?.toString() || "",
          gender: d.gender || "",
          category: d.category || "",
          state: d.state || "",
          district: d.district || "",
          annual_income: d.annual_income?.toString() || "",
          occupation: d.occupation || "",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user, navigate]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles" as any).update({
      full_name: profile.full_name,
      mobile_number: profile.mobile_number,
      age: profile.age ? parseInt(profile.age) : null,
      gender: profile.gender || null,
      category: profile.category || null,
      state: profile.state || null,
      district: profile.district || null,
      annual_income: profile.annual_income ? parseInt(profile.annual_income) : null,
      occupation: profile.occupation || null,
    } as any).eq("id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: t("सेव में त्रुटि", "Error saving"), variant: "destructive" });
    } else {
      toast({ title: t("प्रोफ़ाइल सेव हो गई!", "Profile saved!") });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const update = (key: string, val: string) => setProfile((p) => ({ ...p, [key]: val }));

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle className="font-hindi flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t("मेरी प्रोफ़ाइल", "My Profile")}
          </CardTitle>
          <p className="text-sm text-muted-foreground font-hindi">
            {t("अपनी जानकारी सेव करें ताकि पात्रता जांच में बार-बार न भरनी पड़े",
              "Save your details so you don't have to re-enter for eligibility checks")}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-hindi">{t("पूरा नाम", "Full Name")}</Label>
            <Input value={profile.full_name} onChange={(e) => update("full_name", e.target.value)} />
          </div>
          <div>
            <Label className="font-hindi">{t("मोबाइल", "Mobile")}</Label>
            <Input value={profile.mobile_number} onChange={(e) => update("mobile_number", e.target.value.replace(/\D/g, "").slice(0, 10))} inputMode="numeric" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-hindi">{t("उम्र", "Age")}</Label>
              <Input type="number" value={profile.age} onChange={(e) => update("age", e.target.value)} />
            </div>
            <div>
              <Label className="font-hindi">{t("लिंग", "Gender")}</Label>
              <Select value={profile.gender} onValueChange={(v) => update("gender", v)}>
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
              <Label className="font-hindi">{t("वर्ग", "Category")}</Label>
              <Select value={profile.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger><SelectValue placeholder={t("चुनें", "Select")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{t("सामान्य", "General")}</SelectItem>
                  <SelectItem value="obc">{t("ओबीसी", "OBC")}</SelectItem>
                  <SelectItem value="sc">{t("अनुसूचित जाति", "SC")}</SelectItem>
                  <SelectItem value="st">{t("अनुसूचित जनजाति", "ST")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-hindi">{t("व्यवसाय", "Occupation")}</Label>
              <Input value={profile.occupation} onChange={(e) => update("occupation", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-hindi">{t("राज्य", "State")}</Label>
              <Input value={profile.state} onChange={(e) => update("state", e.target.value)} />
            </div>
            <div>
              <Label className="font-hindi">{t("जिला", "District")}</Label>
              <Input value={profile.district} onChange={(e) => update("district", e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="font-hindi">{t("वार्षिक आय", "Annual Income")}</Label>
            <Input type="number" value={profile.annual_income} onChange={(e) => update("annual_income", e.target.value)} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="flex-1 font-hindi" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {t("सेव करें", "Save Profile")}
            </Button>
            <Button onClick={handleLogout} variant="outline" className="font-hindi gap-2">
              <LogOut className="h-4 w-4" />
              {t("लॉगआउट", "Logout")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
