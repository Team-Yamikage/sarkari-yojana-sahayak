import { useLang } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { User, MapPin, GraduationCap, Heart } from "lucide-react";

const About = () => {
  const { t } = useLang();

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-bold font-hindi text-center mb-6">
        {t("हमारे बारे में", "About Us")}
      </h1>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center mb-6">
            <img src="/logo.png" alt="Sarkari Yojana Mitra AI" className="w-20 h-20 rounded-full mb-4" />
            <h2 className="text-xl font-bold">Shashank Shekhar Verma</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {t("कक्षा 12 विद्यार्थी", "Class 12 Student")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t("उम्र", "Age")}</p>
                <p className="text-sm font-medium">17 {t("वर्ष", "Years")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t("स्थान", "Location")}</p>
                <p className="text-sm font-medium">{t("मुज़फ्फरनगर, उत्तर प्रदेश", "Muzaffarnagar, UP")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <User className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t("पिता", "Father")}</p>
                <p className="text-sm font-medium">Mr. Bijander Kumar</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Heart className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">{t("माता", "Mother")}</p>
                <p className="text-sm font-medium">Mrs. Kushum Lata</p>
              </div>
            </div>
          </div>

          <div className="bg-accent/50 rounded-lg p-4">
            <p className="font-hindi text-sm leading-relaxed">
              {t(
                "मैं मुज़फ्फरनगर का कक्षा 12 का विद्यार्थी हूँ जो मानता है कि तकनीक और AI ग्रामीण भारत को सशक्त बना सकते हैं। सरकारी योजना मित्र AI के माध्यम से, मेरा लक्ष्य है कि लोग बिना साइबर कैफे या बिचौलियों पर निर्भर हुए सरकारी योजनाओं को समझ सकें। मेरा उद्देश्य ऐसे व्यावहारिक समाधान बनाना है जो भारत की असली समस्याओं को हल करें।",
                "I am a Class 12 student from Muzaffarnagar who believes that technology and AI can empower rural India. Through Sarkari Yojana Mitra AI, I aim to help people understand government schemes without depending on cyber cafes or middlemen. My goal is to build practical solutions that solve real problems in Bharat."
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
