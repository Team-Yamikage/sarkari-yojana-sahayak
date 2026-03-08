import { Link, useLocation } from "react-router-dom";
import { Globe, Sun, Moon, Heart } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useTheme } from "@/hooks/useTheme";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { lang, toggleLang, t } = useLang();
  const { dark, toggleTheme } = useTheme();
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
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b">
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <img src="/logo.png" alt="Sarkari Yojana Mitra AI" className="h-8 w-8 rounded-full" />
          <span className="text-gradient-primary font-hindi hidden sm:inline">{t("सरकारी योजना मित्र", "Yojana Mitra")}</span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-2.5 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(l.to)
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/saved" className="relative px-2.5 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent">
            <Heart className={`h-4 w-4 ${isActive("/saved") ? "text-primary fill-primary" : ""}`} />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-1 h-9 w-9">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={toggleLang} className="ml-1 gap-1">
            <Globe className="h-4 w-4" />
            {lang === "hi" ? "EN" : "हि"}
          </Button>
        </div>

        {/* Mobile controls only (menu moved to bottom nav) */}
        <div className="flex lg:hidden items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={toggleLang} className="gap-1">
            <Globe className="h-4 w-4" />
            {lang === "hi" ? "EN" : "हि"}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
