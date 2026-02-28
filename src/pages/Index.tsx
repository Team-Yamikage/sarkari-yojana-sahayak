import { Link } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, FileText, PenTool, Users, Wheat, GraduationCap, Heart } from "lucide-react";

const Index = () => {
  const { t } = useLang();

  const features = [
    {
      icon: Search,
      title: t("पात्रता जांचें", "Check Eligibility"),
      desc: t("अपनी जानकारी भरें और जानें कौन-सी योजनाएं आपके लिए हैं", "Fill your details and find which schemes are for you"),
      to: "/eligibility",
    },
    {
      icon: FileText,
      title: t("योजना समझें", "Understand Schemes"),
      desc: t("किसी भी योजना का नाम लिखें, AI सरल भाषा में समझाएगा", "Type any scheme name, AI will explain in simple language"),
      to: "/schemes",
    },
    {
      icon: PenTool,
      title: t("पत्र बनाएं", "Generate Letter"),
      desc: t("छात्रवृत्ति, पेंशन या शिकायत के लिए हिंदी में पत्र बनाएं", "Generate Hindi letters for scholarship, pension or complaint"),
      to: "/letter",
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
      <section className="gradient-saffron py-16 md:py-24">
        <div className="container text-center">
          <img src="/logo.png" alt="Sarkari Yojana Mitra AI" className="h-24 w-24 mx-auto mb-4 rounded-full bg-white/90 p-1" />
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground font-hindi leading-tight">
            {t("सरकारी योजना मित्र AI", "Sarkari Yojana Mitra AI")}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mt-2 font-hindi">
            {t("समझो अपनी सरकारी योजना", "Understand Your Government Schemes")}
          </p>
          <p className="max-w-2xl mx-auto mt-4 text-primary-foreground/80 font-hindi text-sm md:text-base">
            {t(
              "यह AI टूल आपको बताएगा कि आप कौन-कौन सी सरकारी योजना के लिए eligible हैं और उन्हें कैसे apply करें।",
              "This AI tool will tell you which government schemes you are eligible for and how to apply for them."
            )}
          </p>
          <Link to="/eligibility">
            <Button size="lg" variant="secondary" className="mt-8 font-hindi text-base">
              {t("अभी पात्रता जांचें →", "Check Eligibility Now →")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-10 bg-background">
        <div className="container">
          <h2 className="text-center text-xl font-semibold mb-6 font-hindi">
            {t("यह किसके लिए है?", "Who is this for?")}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {targetUsers.map((u, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-4 bg-card rounded-lg border text-center">
                <u.icon className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium font-hindi">{u.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 bg-muted/50">
        <div className="container">
          <h2 className="text-center text-xl font-semibold mb-6 font-hindi">
            {t("मुख्य सुविधाएं", "Key Features")}
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <Link to={f.to} key={i}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <f.icon className="h-10 w-10 text-primary mb-3" />
                    <h3 className="font-semibold text-lg font-hindi">{f.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 font-hindi">{f.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
