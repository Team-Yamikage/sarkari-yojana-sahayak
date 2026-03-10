import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

const validateMobile = (num: string): string | null => {
  const cleaned = num.replace(/\s/g, "");
  if (!/^\d{10}$/.test(cleaned)) return "Must be exactly 10 digits";
  if (/^(.)\1{9}$/.test(cleaned)) return "Invalid number (all same digits)";
  if (/^(0000|1234|9876|1111|2222|3333|4444|5555|6666|7777|8888|9999)/.test(cleaned))
    return "This doesn't look like a real number";
  if (!/^[6-9]/.test(cleaned)) return "Indian mobile numbers start with 6-9";
  return null;
};

const Auth = () => {
  const { t } = useLang();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "", mobile: "" });
  const [mobileError, setMobileError] = useState<string | null>(null);

  const update = (key: string, val: string) => {
    setForm((p) => ({ ...p, [key]: val }));
    if (key === "mobile") setMobileError(validateMobile(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLogin) {
      const mErr = validateMobile(form.mobile);
      if (mErr) {
        setMobileError(mErr);
        return;
      }
      if (!form.name.trim()) {
        toast({ title: t("कृपया नाम भरें", "Please enter your name"), variant: "destructive" });
        return;
      }
    }
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        toast({ title: t("लॉगिन सफल!", "Login successful!") });
        navigate("/");
      } else {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.name, mobile_number: form.mobile },
          },
        });
        if (error) throw error;
        // Update profile with name and mobile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("profiles" as any).update({
            full_name: form.name,
            mobile_number: form.mobile,
          } as any).eq("id", user.id);
        }
        toast({ title: t("खाता बन गया! लॉगिन हो गया।", "Account created! You are logged in.") });
        navigate("/profile");
      }
    } catch (err: any) {
      toast({ title: err.message || t("कुछ गड़बड़ हुई", "Something went wrong"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <img src="/logo.png" alt="Logo" className="h-16 w-16 mx-auto mb-2 rounded-full" />
          <CardTitle className="font-hindi text-xl">
            {isLogin ? t("लॉगिन करें", "Login") : t("खाता बनाएं", "Create Account")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <Label className="font-hindi">{t("पूरा नाम", "Full Name")} *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder={t("अपना नाम लिखें", "Enter your name")}
                    required
                  />
                </div>
                <div>
                  <Label className="font-hindi">{t("मोबाइल नंबर", "Mobile Number")} *</Label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 bg-muted rounded-md text-sm font-medium border border-input">+91</span>
                    <Input
                      value={form.mobile}
                      onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      maxLength={10}
                      inputMode="numeric"
                      required
                    />
                  </div>
                  {mobileError && form.mobile.length > 0 && (
                    <p className="text-sm text-destructive mt-1">{mobileError}</p>
                  )}
                  {!mobileError && form.mobile.length === 10 && (
                    <p className="text-sm text-secondary mt-1">✓ {t("वैध नंबर", "Valid number")}</p>
                  )}
                </div>
              </>
            )}
            <div>
              <Label className="font-hindi">{t("ईमेल", "Email")} *</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>
            <div>
              <Label className="font-hindi">{t("पासवर्ड", "Password")} *</Label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full font-hindi" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLogin ? t("लॉगिन करें", "Login") : t("खाता बनाएं", "Sign Up")}
            </Button>
          </form>
          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline font-hindi"
            >
              {isLogin
                ? t("खाता नहीं है? साइन अप करें", "Don't have an account? Sign Up")
                : t("पहले से खाता है? लॉगिन करें", "Already have an account? Login")}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
