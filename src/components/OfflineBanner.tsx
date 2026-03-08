import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useLang } from "@/contexts/LanguageContext";

const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  const { t } = useLang();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground text-center py-2 px-4 flex items-center justify-center gap-2 text-sm font-medium animate-in slide-in-from-top-2">
      <WifiOff className="h-4 w-4 flex-shrink-0" />
      <span className="font-hindi">
        {t("इंटरनेट कनेक्शन नहीं है", "You are offline")}
      </span>
    </div>
  );
};

export default OfflineBanner;
