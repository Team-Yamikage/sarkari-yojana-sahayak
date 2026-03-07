import { useLang } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLang();
  return (
    <footer className="border-t border-border/50 glass-panel-strong mt-auto">
      <div className="container py-6 text-center text-sm text-muted-foreground">
        <p className="font-hindi">
          {t(
            "Built for CodeYogi – Builders of Bharat AI Challenge 🇮🇳",
            "Built for CodeYogi – Builders of Bharat AI Challenge 🇮🇳"
          )}
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="h-6 w-6 rounded-lg bg-primary/20 flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="h-5 w-5 rounded" />
          </div>
          <p>{t("© 2026 सरकारी योजना मित्र AI", "© 2026 Sarkari Yojana Mitra AI")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
