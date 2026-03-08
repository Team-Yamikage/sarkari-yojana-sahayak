import { Download, X, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useState } from "react";

const InstallBanner = () => {
  const { t } = useLang();
  const { canInstall, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem("install-banner-dismissed") === "true";
  });

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("install-banner-dismissed", "true");
  };

  // Don't show if already installed or dismissed
  if (isInstalled || dismissed) return null;

  // Show iOS instructions or Android install button
  if (!canInstall && !isIOS) return null;

  return (
    <div className="fixed bottom-16 left-2 right-2 z-40 lg:hidden animate-in slide-in-from-bottom-4">
      <div className="bg-card border-2 border-primary/20 rounded-2xl p-3 shadow-xl flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Download className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold font-hindi leading-tight">
            {t("ऐप डाउनलोड करें", "Download App")}
          </p>
          <p className="text-[11px] text-muted-foreground font-hindi leading-tight mt-0.5">
            {isIOS
              ? t("Share बटन दबाएं → 'Add to Home Screen' चुनें", "Tap Share → 'Add to Home Screen'")
              : t("होम स्क्रीन पर इंस्टॉल करें", "Install to your home screen")}
          </p>
        </div>
        {isIOS ? (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Share className="h-4 w-4 text-primary" />
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={dismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button size="sm" className="h-8 text-xs font-hindi" onClick={install}>
              {t("इंस्टॉल", "Install")}
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={dismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallBanner;
