import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLang } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const AIChatbot = () => {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const newMsgs: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const resp = await supabase.functions.invoke("ai-chat", {
        body: { type: "chat", data: { message: text, history: newMsgs.slice(-10) }, lang },
      });
      const answer = resp.data?.result || t("कोई जवाब नहीं मिला", "No response");
      setMessages((m) => [...m, { role: "assistant", content: answer }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: t("कुछ गड़बड़ हुई", "Something went wrong") }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-2xl btn-soft text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Panel */}
      {open && (
        <div className="fixed bottom-22 right-5 z-50 w-[340px] max-w-[calc(100vw-2.5rem)] h-[460px] glass-panel-strong rounded-2xl neu-raised flex flex-col overflow-hidden">
          {/* Header */}
          <div className="gradient-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <span className="font-semibold font-hindi text-sm">{t("योजना मित्र AI", "Yojana Mitra AI")}</span>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-8 font-hindi">
                {t("कोई भी सवाल पूछें — योजना, पात्रता, दस्तावेज़...", "Ask anything — schemes, eligibility, documents...")}
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />}
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "gradient-primary text-primary-foreground"
                      : "bg-accent text-foreground"
                  }`}
                >
                  {m.content}
                </div>
                {m.role === "user" && <User className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <Bot className="h-5 w-5 text-primary mt-1" />
                <div className="bg-accent rounded-xl px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={send} className="border-t border-border/50 p-2 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("यहाँ टाइप करें...", "Type here...")}
              className="text-sm font-hindi rounded-xl bg-accent/50 border-border/50"
              disabled={loading}
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} className="rounded-xl btn-soft border-0 text-primary-foreground">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
