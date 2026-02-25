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
        <p className="mt-1">
          {t("© 2025 सरकारी योजना मित्र AI", "© 2025 Sarkari Yojana Mitra AI")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
