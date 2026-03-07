import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe, Heart } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { lang, toggleLang, t } = useLang();
  const { totalCount } = useBookmarks();
  const location = useLocation();

  const links = [
    { to: "/", label: t("होम", "Home") },
    { to: "/eligibility", label: t("पात्रता जांचें", "Eligibility") },
    { to: "/schemes", label: t("योजनाएं", "Schemes") },
    { to: "/letter", label: t("पत्र बनाएं", "Letter") },
    { to: "/govt-jobs", label: t("नौकरी", "Jobs") },
    { to: "/documents", label: t("दस्तावेज़", "Documents") },
    { to: "/compare", label: t("तुलना", "Compare") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel-strong border-b border-border/50">
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg group">
          <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center glow-primary transition-all group-hover:bg-primary/30">
            <img src="/logo.png" alt="Sarkari Yojana Mitra AI" className="h-7 w-7 rounded-lg" />
          </div>
          <span className="text-gradient-primary font-hindi hidden sm:inline text-base font-semibold tracking-tight">
            {t("सरकारी योजना मित्र", "Yojana Mitra")}
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive(l.to)
                  ? "gradient-primary text-primary-foreground neu-raised-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/saved" className="relative px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-accent/60 ml-1">
            <Heart className={`h-4 w-4 ${isActive("/saved") ? "text-primary fill-primary" : "text-muted-foreground"}`} />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                {totalCount}
              </span>
            )}
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLang}
            className="ml-2 gap-1.5 rounded-xl border-border/50 bg-accent/40 hover:bg-accent/70 text-foreground"
          >
            <Globe className="h-3.5 w-3.5" />
            {lang === "hi" ? "EN" : "हि"}
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center gap-1">
          <Link to="/saved" className="relative p-2">
            <Heart className={`h-4 w-4 ${isActive("/saved") ? "text-primary fill-primary" : "text-muted-foreground"}`} />
            {totalCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
          <Button variant="outline" size="sm" onClick={toggleLang} className="gap-1 rounded-xl border-border/50 bg-accent/40">
            <Globe className="h-3.5 w-3.5" />
            {lang === "hi" ? "EN" : "हि"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setOpen(!open)} className="rounded-xl">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border/50 glass-panel-strong pb-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive(l.to)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/about" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground">
            {t("हमारे बारे में", "About")}
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
