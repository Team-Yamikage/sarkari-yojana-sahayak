import { Link, useLocation } from "react-router-dom";
import { Home, Search, FileText, Briefcase, MoreHorizontal } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { useState } from "react";

const BottomNav = () => {
  const { t } = useLang();
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);

  const mainTabs = [
    { to: "/", icon: Home, label: t("होम", "Home") },
    { to: "/eligibility", icon: Search, label: t("पात्रता", "Eligibility") },
    { to: "/schemes", icon: FileText, label: t("योजनाएं", "Schemes") },
    { to: "/govt-jobs", icon: Briefcase, label: t("नौकरी", "Jobs") },
  ];

  const moreTabs = [
    { to: "/letter", label: t("पत्र बनाएं", "Letter") },
    { to: "/documents", label: t("दस्तावेज़", "Documents") },
    { to: "/compare", label: t("तुलना", "Compare") },
    { to: "/saved", label: t("सेव किये", "Saved") },
    { to: "/about", label: t("हमारे बारे में", "About") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* More menu overlay */}
      {showMore && (
        <div className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm lg:hidden" onClick={() => setShowMore(false)}>
          <div
            className="absolute bottom-16 left-0 right-0 bg-card border-t rounded-t-2xl p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 gap-2">
              {moreTabs.map((tab) => (
                <Link
                  key={tab.to}
                  to={tab.to}
                  onClick={() => setShowMore(false)}
                  className={`flex items-center justify-center py-3 px-2 rounded-xl text-xs font-medium font-hindi transition-colors ${
                    isActive(tab.to)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t lg:hidden safe-bottom">
        <div className="flex items-center justify-around h-14">
          {mainTabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive(tab.to)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <tab.icon className={`h-5 w-5 ${isActive(tab.to) ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-medium font-hindi leading-none">{tab.label}</span>
            </Link>
          ))}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
              showMore ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="text-[10px] font-medium font-hindi leading-none">{t("और", "More")}</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
