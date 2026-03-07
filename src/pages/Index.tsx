import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Search, FileText, PenTool, Users, Wheat, GraduationCap, Heart, ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  const { t } = useLang();

  const features = [
    {
      icon: Search,
      title: t("पात्रता जांचें", "Check Eligibility"),
      desc: t("अपनी जानकारी भरें और जानें कौन-सी योजनाएं आपके लिए हैं", "Fill your details and find which schemes are for you"),
      to: "/eligibility",
      gradient: "from-primary to-secondary",
    },
    {
      icon: FileText,
      title: t("योजना समझें", "Understand Schemes"),
      desc: t("किसी भी योजना का नाम लिखें, AI सरल भाषा में समझाएगा", "Type any scheme name, AI will explain in simple language"),
      to: "/schemes",
      gradient: "from-secondary to-primary",
    },
    {
      icon: PenTool,
      title: t("पत्र बनाएं", "Generate Letter"),
      desc: t("छात्रवृत्ति, पेंशन या शिकायत के लिए हिंदी में पत्र बनाएं", "Generate Hindi letters for scholarship, pension or complaint"),
      to: "/letter",
      gradient: "from-primary via-secondary to-primary",
    },
  ];

  const targetUsers = [
    { icon: GraduationCap, label: t("विद्यार्थी", "Students") },
    { icon: Wheat, label: t("किसान", "Farmers") },
    { icon: Users, label: t("कम आय वाले परिवार", "Low-income families") },
    { icon: Heart, label: t("वरिष्ठ नागरिक", "Senior citizens") },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative gradient-hero py-20 md:py-32 overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 text-sm text-primary font-medium">
            <Sparkles className="h-4 w-4" />
            {t("AI-संचालित सरकारी योजना सहायक", "AI-Powered Government Scheme Assistant")}
          </div>

          <div className="relative inline-block mb-6">
            <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl animate-glow-pulse" />
            <img
              src="/logo.png"
              alt="Sarkari Yojana Mitra AI"
              className="relative h-24 w-24 mx-auto rounded-2xl neu-raised animate-float"
            />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold font-hindi leading-tight">
            <span className="text-gradient-primary">{t("सरकारी योजना", "Sarkari Yojana")}</span>
            <br />
            <span className="text-foreground">{t("मित्र AI", "Mitra AI")}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-4 font-hindi max-w-xl mx-auto">
            {t("समझो अपनी सरकारी योजना", "Understand Your Government Schemes")}
          </p>
          <p className="max-w-2xl mx-auto mt-3 text-muted-foreground/80 font-hindi text-sm md:text-base leading-relaxed">
            {t(
              "यह AI टूल आपको बताएगा कि आप कौन-कौन सी सरकारी योजना के लिए eligible हैं और उन्हें कैसे apply करें।",
              "This AI tool will tell you which government schemes you are eligible for and how to apply for them."
            )}
          </p>
          <Link to="/eligibility">
            <Button
              size="lg"
              className="mt-8 font-hindi text-base rounded-2xl px-8 py-6 btn-soft text-primary-foreground border-0 gap-2"
            >
              {t("अभी पात्रता जांचें", "Check Eligibility Now")}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-14">
        <div className="container">
          <h2 className="text-center text-xl font-semibold mb-8 font-hindi text-foreground">
            {t("यह किसके लिए है?", "Who is this for?")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {targetUsers.map((u, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl neu-raised bg-card text-center group hover:glow-primary transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <u.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium font-hindi text-foreground">{u.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-14">
        <div className="container">
          <h2 className="text-center text-xl font-semibold mb-8 font-hindi text-foreground">
            {t("मुख्य सुविधाएं", "Key Features")}
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Link to={f.to} key={i} className="group">
                <div className="h-full p-6 rounded-2xl neu-raised bg-card hover:glow-primary transition-all duration-300 cursor-pointer">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg font-hindi text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2 font-hindi leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("जानें", "Explore")} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
