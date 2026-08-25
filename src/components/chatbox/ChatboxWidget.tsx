"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import keywordsData from "@/data/chatbox/keywords.json";

const AmsifoxModel = dynamic(() => import("./AmsifoxModel"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-orange-500 rounded-full" />
  ),
});

// ---------------------------------------------------------------------------
// FoxErrorBoundary — catches R3F/WebGL errors so the trigger never goes blank
// ---------------------------------------------------------------------------

class FoxErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      // Fallback: simple CSS fox shape — NO PNG, no image
      return (
        <div className="w-full h-full rounded-full bg-[#E8590C] flex items-center justify-center">
          <span className="text-white text-xl">🦊</span>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Lang = "vi" | "en" | "zh" | "fr" | "ar";

interface KeywordEntry {
  id: string;
  aliases: string[];
  response_vi: string;
  response_en: string;
}

interface KeywordsFile {
  version: string;
  note: string;
  entries: KeywordEntry[];
}

interface Message {
  role: "bot" | "user";
  content: string;
  id: string;
}

interface HistoryItem {
  role: "user" | "assistant";
  content: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function detectLang(text: string): Lang {
  const viChars =
    /[àáảãạăắằẳẵặâấầẩẫậđèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;
  if (viChars.test(text)) return "vi";
  if (/[一-鿿㐀-䶿]/.test(text)) return "zh";
  if (/[؀-ۿݐ-ݿ]/.test(text)) return "ar";
  if (
    /[éèêëàâùûüçœæîïôÿ]/i.test(text) ||
    /\b(le|la|les|de|du|un|une|des|est|je|tu|il|nous|vous|ils|que|qui|quoi|comment|pourquoi|bonjour|merci)\b/i.test(
      text
    )
  )
    return "fr";
  return "en";
}

function findAnswer(input: string, lang: Lang): string | null {
  const lower = input.toLowerCase();
  const kb = keywordsData as KeywordsFile;
  for (const entry of kb.entries) {
    if (entry.aliases.some((alias) => lower.includes(alias))) {
      return lang === "vi" ? entry.response_vi : entry.response_en;
    }
  }
  return null;
}

const WELCOME_MESSAGES: Record<Lang, string> = {
  vi: "Xin chào! Tôi là AMSIFOX 🦊 Hỏi tôi bất cứ điều gì về AMSIO nhé.",
  en: "Hi! I'm AMSIFOX 🦊 Ask me anything about AMSIO.",
  zh: "你好！我是 AMSIFOX 🦊 欢迎向我询问任何关于 AMSIO 的问题。",
  fr: "Bonjour ! Je suis AMSIFOX 🦊 Posez-moi vos questions sur AMSIO.",
  ar: "مرحباً! أنا AMSIFOX 🦊 اسألني أي شيء عن AMSIO.",
};

// ---------------------------------------------------------------------------
// Markdown renderer — no external lib, regex only
// ---------------------------------------------------------------------------

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const lineNodes = parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });

    nodes.push(<span key={lineIdx}>{lineNodes}</span>);
    if (lineIdx < lines.length - 1) {
      nodes.push(<br key={`br-${lineIdx}`} />);
    }
  });

  return <>{nodes}</>;
}

// ---------------------------------------------------------------------------
// TypingIndicator
// ---------------------------------------------------------------------------

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-orange-300 flex-shrink-0">
        <Image
          src="/images/mascot/amsifox.png"
          alt="AMSIFOX"
          width={28}
          height={28}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1">
        <span
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BotMessage
// ---------------------------------------------------------------------------

function BotMessage({ content }: { content: string }) {
  return (
    <div className="flex items-end gap-2">
      <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-orange-300 flex-shrink-0">
        <Image
          src="/images/mascot/amsifox.png"
          alt="AMSIFOX"
          width={28}
          height={28}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="bg-white text-[#1B3A5C] rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%] text-sm shadow-sm leading-relaxed">
        {renderMarkdown(content)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// UserMessage
// ---------------------------------------------------------------------------

function UserMessage({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div className="bg-[#E8590C] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] text-sm leading-relaxed">
        {content}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Widget
// ---------------------------------------------------------------------------

export default function ChatboxWidget() {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialise welcome message — updates when locale changes
  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "bot",
        content: WELCOME_MESSAGES[locale] ?? WELCOME_MESSAGES.en,
      },
    ]);
  }, [locale]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const addMessage = useCallback((msg: Omit<Message, "id">) => {
    const id = `${Date.now()}-${Math.random()}`;
    setMessages((prev) => [...prev, { ...msg, id }]);
    return id;
  }, []);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const lang = detectLang(text);

    addMessage({ role: "user", content: text });
    setInput("");
    setLoading(true);

    try {
      // 1. Try AI first (unless quota already exceeded this session)
      if (!quotaExceeded) {
        let aiSucceeded = false;
        try {
          const res = await fetch("/api/v1/chatbox", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text, history }),
          });

          const data = (await res.json()) as { reply?: string; error?: string };

          if (data.error === "QUOTA_EXCEEDED") {
            setQuotaExceeded(true);
            // fallthrough to keyword matching below
          } else if (data.reply) {
            addMessage({ role: "bot", content: data.reply });
            setHistory((prev) => [
              ...prev,
              { role: "user", content: text },
              { role: "assistant", content: data.reply! },
            ]);
            aiSucceeded = true;
          } else if (!res.ok) {
            // Non-quota server error — still fallthrough to keywords
          }
        } catch {
          // Network error — fallthrough to keywords
        }

        if (aiSucceeded) return;
      }

      // 2. Fallback: keyword matching
      const answer = findAnswer(text, lang);
      if (answer) {
        addMessage({ role: "bot", content: answer });
      } else {
        const fallbackMessages: Record<Lang, string> = {
          vi: "Vui lòng liên hệ **info@amsio.org** để được hỗ trợ thêm.",
          zh: "如需进一步帮助，请联系 **info@amsio.org**。",
          fr: "Pour plus d'assistance, contactez **info@amsio.org**.",
          ar: "للمزيد من المساعدة، يرجى التواصل عبر **info@amsio.org**.",
          en: "Please contact **info@amsio.org** for further assistance.",
        };
        addMessage({
          role: "bot",
          content: fallbackMessages[lang] ?? fallbackMessages.en,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [input, loading, quotaExceeded, history, addMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <>
      {/* Chat window */}
      <div
        className={[
          "fixed bottom-24 right-4 z-50",
          "w-[calc(100vw-2rem)] sm:w-[360px] max-h-[480px]",
          "rounded-2xl shadow-2xl overflow-hidden",
          "flex flex-col",
          "transition-all duration-300",
          open
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="bg-[#1B3A5C] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-white border-2 border-[#E8590C] flex-shrink-0 overflow-hidden flex items-center justify-center">
            <AmsifoxModel size="sm" animate={false} />
          </div>

          {/* Title + mode badge */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-[family-name:var(--font-display)] font-bold text-white text-base leading-tight">
                AMSIFOX
              </span>
              {quotaExceeded ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white/70">
                  FAQ
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8A817] text-white">
                  ✨ AI
                </span>
              )}
            </div>
            <div className="text-white/60 text-xs">AMSIO Assistant</div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="text-white/60 hover:text-white transition-colors ml-1 flex-shrink-0"
            aria-label="Close chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto bg-[#F0F4F8] px-4 py-4 flex flex-col gap-3"
          style={{ minHeight: 0 }}
        >
          {messages.map((msg) =>
            msg.role === "bot" ? (
              <BotMessage key={msg.id} content={msg.content} />
            ) : (
              <UserMessage key={msg.id} content={msg.content} />
            )
          )}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="bg-white border-t border-gray-200 px-3 py-3 flex items-center gap-2 flex-shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AMSIFOX... / Hỏi AMSIFOX..."
            disabled={loading}
            className="flex-1 text-sm text-gray-800 placeholder-gray-400 border-none outline-none bg-transparent disabled:opacity-50"
            aria-label="Message input"
          />
          <button
            onClick={() => void handleSend()}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-full bg-[#E8590C] text-white flex items-center justify-center flex-shrink-0 hover:bg-orange-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Floating trigger button */}
      <div className="group fixed bottom-6 right-6 z-50">
        {/* Notification dot — shown when chat is closed */}
        {!open && (
          <span className="absolute -top-1 -right-1 z-10 flex h-4 w-4 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white" />
          </span>
        )}
        {!open && (
          <div className="absolute bottom-full mb-3 right-0 pointer-events-none
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            bg-[#1B3A5C] text-white text-xs font-medium px-3 py-1.5 rounded-full
            whitespace-nowrap shadow-lg
            after:content-[''] after:absolute after:top-full after:right-4
            after:border-4 after:border-transparent after:border-t-[#1B3A5C]">
            Ask AMSIFOX 🦊
          </div>
        )}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={[
            "w-[60px] h-[60px] rounded-full",
            "bg-[#1B3A5C]",
            "ring-2 ring-[#E8590C] ring-offset-2",
            "flex items-center justify-center",
            "shadow-lg",
            "transition-transform duration-200 hover:scale-110",
            !open ? "animate-[foxPulse_2.5s_ease-in-out_infinite]" : "",
          ].join(" ")}
          aria-label={open ? "Close AMSIFOX chat" : "Open AMSIFOX chat"}
          aria-expanded={open}
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <FoxErrorBoundary>
              <AmsifoxModel size="sm" animate={true} />
            </FoxErrorBoundary>
          )}
        </button>
      </div>
    </>
  );
}
