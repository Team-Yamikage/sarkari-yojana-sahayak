import { useState, useEffect, useMemo } from "react";
import { useLang } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { sampleGovtJobs } from "@/data/sampleGovtJobs";
import {
  Loader2, Calendar, IndianRupee, GraduationCap, User, Briefcase,
  CheckCircle2, AlertTriangle, ExternalLink, Users, ClipboardList, Heart, Share2
} from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";

interface GovtJob {
  id: string;
  post_name: string;
  department: string;
  total_vacancies: number;
  qualification: string;
  min_age: number;
  max_age: number;
  age_relaxation_obc: number | null;
  age_relaxation_sc_st: number | null;
  fee_general: number | null;
  fee_obc: number | null;
  fee_sc_st: number | null;
  registration_start: string;
  registration_end: string;
  selection_process: string | null;
  description: string | null;
  apply_link: string | null;
  category_reservation: string[] | null;
  state: string | null;
  is_active: boolean | null;
}

interface UserProfile {
  age: number;
  gender: string;
  category: string;
  qualification: string;
  state: string;
  disability: boolean;
}

const QUALIFICATIONS = ["10th", "12th", "ITI", "Diploma", "Graduate", "Postgraduate"];

const qualificationRank = (q: string) => {
  const order = ["10th", "12th", "ITI", "Diploma", "Graduate", "Postgraduate"];
  return order.indexOf(q);
};

const GovtJobs = () => {
  const { t, lang } = useLang();
  const { toggle, isBookmarked } = useBookmarks();
  const [jobs, setJobs] = useState<GovtJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    age: 25, gender: "Male", category: "General",
    qualification: "Graduate", state: "All India", disability: false,
  });

  const [states, setStates] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch states
      const { data: stData } = await supabase.from("states").select("name").order("name");
      if (stData) setStates(["All India", ...stData.map(s => s.name)]);

      // Fetch jobs
      const { data, error } = await supabase
        .from("govt_jobs")
        .select("*")
        .eq("is_active", true)
        .order("registration_end", { ascending: true });

      if (data && data.length > 0) {
        setJobs(data as GovtJob[]);
      } else {
        // Seed sample data if empty
        const { data: inserted } = await supabase
          .from("govt_jobs")
          .insert(sampleGovtJobs)
          .select();
        if (inserted) setJobs(inserted as GovtJob[]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const filteredJobs = useMemo(() => {
    if (!submitted) return [];

    return jobs.filter((job) => {
      // Filter expired vs upcoming
      if (showUpcoming) {
        if (job.registration_start <= today) return false;
      } else {
        if (job.registration_end < today) return false;
      }

      // Age check with relaxation
      let maxAge = job.max_age;
      if (profile.category === "OBC") maxAge += (job.age_relaxation_obc || 0);
      if (profile.category === "SC" || profile.category === "ST") maxAge += (job.age_relaxation_sc_st || 0);
      if (profile.disability) maxAge += 10;
      if (profile.age < job.min_age || profile.age > maxAge) return false;

      // Qualification check
      if (qualificationRank(profile.qualification) < qualificationRank(job.qualification)) return false;

      // State check
      if (profile.state !== "All India" && job.state !== "All India" && job.state !== profile.state) return false;

      return true;
    });
  }, [submitted, jobs, profile, showUpcoming, today]);

  const getFee = (job: GovtJob) => {
    switch (profile.category) {
      case "SC": case "ST": return job.fee_sc_st ?? 0;
      case "OBC": return job.fee_obc ?? 0;
      default: return job.fee_general ?? 0;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl md:text-3xl font-bold font-hindi text-center mb-2">
        {t("सरकारी नौकरी खोजें", "Govt Jobs & Vacancies Finder")}
      </h1>
      <p className="text-center text-muted-foreground font-hindi mb-6">
        {t("अपनी पात्रता के अनुसार सरकारी नौकरियां देखें", "Find government jobs matching your eligibility")}
      </p>

      {/* Alert */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center gap-2 bg-accent border border-primary/20 rounded-lg px-4 py-3 text-sm">
          <AlertTriangle className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="font-hindi text-accent-foreground">
            {t("आवेदन करने से पहले अंतिम तिथि अवश्य जांचें।", "Check registration last date before applying.")}
          </span>
        </div>
      </div>

      {/* Eligibility Form */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="font-hindi text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {t("अपनी जानकारी भरें", "Enter Your Details")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="font-hindi">{t("उम्र", "Age")}</Label>
              <Input
                type="number"
                min={14}
                max={65}
                value={profile.age}
                onChange={(e) => setProfile(p => ({ ...p, age: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label className="font-hindi">{t("लिंग", "Gender")}</Label>
              <Select value={profile.gender} onValueChange={(v) => setProfile(p => ({ ...p, gender: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">{t("पुरुष", "Male")}</SelectItem>
                  <SelectItem value="Female">{t("महिला", "Female")}</SelectItem>
                  <SelectItem value="Other">{t("अन्य", "Other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-hindi">{t("श्रेणी", "Category")}</Label>
              <Select value={profile.category} onValueChange={(v) => setProfile(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["General", "OBC", "SC", "ST"].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-hindi">{t("शिक्षा", "Education")}</Label>
              <Select value={profile.qualification} onValueChange={(v) => setProfile(p => ({ ...p, qualification: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {QUALIFICATIONS.map(q => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-hindi">{t("राज्य", "State")}</Label>
              <Select value={profile.state} onValueChange={(v) => setProfile(p => ({ ...p, state: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {states.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-3 pb-1">
              <div className="flex items-center gap-2">
                <Switch
                  checked={profile.disability}
                  onCheckedChange={(v) => setProfile(p => ({ ...p, disability: v }))}
                />
                <Label className="font-hindi">{t("विकलांगता", "Disability")}</Label>
              </div>
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <Button type="submit" className="w-full font-hindi">
                {t("नौकरियां खोजें", "Find Eligible Jobs")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {submitted && (
        <>
          {/* Toggle + Count */}
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
            <p className="text-sm text-muted-foreground font-hindi">
              {filteredJobs.length} {t("नौकरियां मिलीं", "jobs found")}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUpcoming(false)}
                className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
                  !showUpcoming ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {t("सक्रिय भर्तियां", "Active Vacancies")}
              </button>
              <button
                onClick={() => setShowUpcoming(true)}
                className={`text-sm px-3 py-1.5 rounded-md font-medium transition-colors ${
                  showUpcoming ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {t("आगामी भर्तियां", "Upcoming Vacancies")}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 font-hindi">
              {t("आपकी पात्रता के अनुसार कोई नौकरी नहीं मिली", "No eligible jobs found for your profile")}
            </p>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow overflow-hidden">
                  {/* Eligible badge */}
                  <div className="bg-secondary/10 border-b border-secondary/20 px-4 py-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium text-secondary font-hindi">
                      {t("आप इस पद के लिए पात्र हैं", "You are eligible for this post")}
                    </span>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-lg font-bold">{job.post_name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" /> {job.department}
                        </p>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 self-start">
                        <Users className="h-3 w-3 mr-1" /> {job.total_vacancies} {t("पद", "Posts")}
                      </Badge>
                    </div>

                    {job.description && (
                      <p className="text-sm text-muted-foreground mb-3">{job.description}</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-xs text-muted-foreground">{t("योग्यता", "Qualification")}</div>
                          <div className="font-medium">{job.qualification}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-xs text-muted-foreground">{t("आयु सीमा", "Age Limit")}</div>
                          <div className="font-medium">{job.min_age} - {job.max_age} {t("वर्ष", "yrs")}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-xs text-muted-foreground">{t("आवेदन शुल्क", "Fee")}</div>
                          <div className="font-medium">₹{getFee(job)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ClipboardList className="h-4 w-4 text-primary" />
                        <div>
                          <div className="text-xs text-muted-foreground">{t("चयन प्रक्रिया", "Selection")}</div>
                          <div className="font-medium text-xs">{job.selection_process}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t">
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {t("शुरू:", "Start:")} {new Date(job.registration_start).toLocaleDateString("en-IN")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-destructive" />
                          {t("अंतिम:", "Last:")} {new Date(job.registration_end).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => toggle("job", job.id)}>
                          <Heart className={`h-4 w-4 ${isBookmarked("job", job.id) ? "fill-destructive text-destructive" : ""}`} />
                        </Button>
                        <Button
                          size="icon" variant="ghost" className="h-8 w-8"
                          onClick={() => {
                            const text = `${job.post_name} — ${job.department}\n${t("पद:", "Posts:")} ${job.total_vacancies}\n${t("अंतिम तिथि:", "Last Date:")} ${new Date(job.registration_end).toLocaleDateString("en-IN")}\n${job.apply_link || ""}\n\n— Sarkari Yojana Mitra AI`;
                            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        {job.apply_link && (
                          <Button size="sm" asChild className="gap-1">
                            <a href={job.apply_link} target="_blank" rel="noopener noreferrer">
                              {t("आवेदन करें", "Apply Now")} <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GovtJobs;
