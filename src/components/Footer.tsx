import { useLang } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLang();
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-6 text-center text-sm text-muted-foreground">
        <p className="font-hindi">
          {t(
            "Built for CodeYogi – Builders of Bharat AI Challenge 🇮🇳",
            "Built for CodeYogi – Builders of Bharat AI Challenge 🇮🇳"
          )}
        </p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <img src="/logo.png" alt="Logo" className="h-6 w-6 rounded-full" />
          <p>{t("© 2026 सरकारी योजना मित्र AI", "© 2026 Sarkari Yojana Mitra AI")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
