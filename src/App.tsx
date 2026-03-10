import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";
import InstallBanner from "@/components/InstallBanner";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import OfflineBanner from "@/components/OfflineBanner";
import Index from "./pages/Index";
import EligibilityChecker from "./pages/EligibilityChecker";
import SchemeExplainer from "./pages/SchemeExplainer";
import LetterGenerator from "./pages/LetterGenerator";
import GovtJobs from "./pages/GovtJobs";
import DocumentChecklist from "./pages/DocumentChecklist";
import SchemeCompare from "./pages/SchemeCompare";
import SavedItems from "./pages/SavedItems";
import AdminPanel from "./pages/AdminPanel";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import ApplicationTracker from "./pages/ApplicationTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <OfflineBanner />
              <Navbar />
              <main className="flex-1 pb-16 lg:pb-0">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/eligibility" element={<EligibilityChecker />} />
                  <Route path="/schemes" element={<SchemeExplainer />} />
                  <Route path="/letter" element={<LetterGenerator />} />
                  <Route path="/govt-jobs" element={<GovtJobs />} />
                  <Route path="/documents" element={<DocumentChecklist />} />
                  <Route path="/compare" element={<SchemeCompare />} />
                  <Route path="/saved" element={<SavedItems />} />
                  <Route path="/admin" element={<AdminPanel />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/tracker" element={<ApplicationTracker />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <InstallBanner />
              <AIChatbot />
              <BottomNav />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
