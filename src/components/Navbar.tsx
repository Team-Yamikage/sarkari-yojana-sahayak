import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { lang, toggleLang, t } = useLang();
  const location = useLocation();

  const links = [
    { to: "/", label: t("होम", "Home") },
    { to: "/eligibility", label: t("पात्रता जांचें", "Check Eligibility") },
    { to: "/schemes", label: t("योजना समझें", "Scheme Explainer") },
    { to: "/letter", label: t("पत्र बनाएं", "Letter Generator") },
    { to: "/about", label: t("हमारे बारे में", "About") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b">
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-gradient-primary font-hindi">🇮🇳 {t("सरकारी योजना मित्र", "Yojana Mitra")}</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(l.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Button variant="outline" size="sm" onClick={toggleLang} className="ml-2 gap-1">
            <Globe className="h-4 w-4" />
            {lang === "hi" ? "EN" : "हि"}
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleLang} className="gap-1">
            <Globe className="h-4 w-4" />
            {lang === "hi" ? "EN" : "हि"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-card pb-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-sm font-medium ${
                isActive(l.to) ? "bg-accent text-accent-foreground" : "text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
