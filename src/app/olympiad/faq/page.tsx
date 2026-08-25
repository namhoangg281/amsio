"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

const FAQ_ICONS: Record<string, string> = {
  general: "🌐",
  registration: "📋",
  competition: "✏️",
  results: "🏅",
  grandfinals: "🌟",
  schools: "🏫",
};

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-border/30 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-bg-subtle transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-navy text-sm md:text-base leading-snug">{question}</span>
        <span
          className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-navy/20 flex items-center justify-center text-navy font-bold text-xl leading-none"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s ease", display: "flex" }}
        >
          +
        </span>
      </button>
      {isOpen && (
        <div className="px-6 py-5 bg-bg-subtle border-t border-border/20">
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const { t } = useI18n();
  const faqCategories = t.faq.categories;
  const [activeCategory, setActiveCategory] = useState("general");
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const currentCategory = faqCategories.find((c) => c.id === activeCategory);

  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return currentCategory?.questions ?? [];
    const q = searchQuery.toLowerCase();
    return (currentCategory?.questions ?? []).filter(
      (item) =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [searchQuery, currentCategory]);

  const toggleItem = (key: string) => {
    setOpenItem((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 gradient-navy" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              {t.faq.title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              {t.faq.subtitle}
            </p>

            {/* Search Bar */}
            <div className="mt-10 max-w-xl mx-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder={t.faq.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white transition-colors text-xl"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenItem(null);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat.id
                      ? "bg-navy text-white shadow-lg"
                      : "bg-white border border-border/30 text-text-secondary hover:border-navy/30 hover:text-navy"
                  }`}
                >
                  <span>{FAQ_ICONS[cat.id] ?? ""}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="space-y-3">
              {filteredQuestions.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="font-semibold text-navy mb-1">{t.faq.noResults}</p>
                  <p className="text-sm">{t.faq.tryDifferentSearch}</p>
                </div>
              ) : (
                filteredQuestions.map((item, i) => (
                  <AccordionItem
                    key={`${activeCategory}-${i}`}
                    question={item.q}
                    answer={item.a}
                    isOpen={openItem === `${activeCategory}-${i}`}
                    onToggle={() => toggleItem(`${activeCategory}-${i}`)}
                  />
                ))
              )}
            </div>

            {/* Still have questions CTA — ẩn theo yêu cầu (mục 20). Đổi false → true để hiện lại. */}
            {false && (
            <div className="mt-16 p-8 rounded-2xl gradient-navy text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-white mb-2">
                {t.faq.stillHaveQuestions}
              </h3>
              <p className="text-white/70 text-sm mb-6">
                {t.faq.contactDescription}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-orange text-white font-semibold hover:bg-orange/90 transition-colors shadow-lg"
                >
                  {t.faq.contactUs}
                </Link>
                <Link
                  href="/countries"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  {t.faq.findPartner}
                </Link>
              </div>
            </div>
            )}

            {/* Quick links */}
            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              {t.faq.quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block p-4 rounded-xl bg-white border border-border/30 hover:border-navy/30 hover:shadow-md transition-all group"
                >
                  <div className="font-semibold text-navy text-sm group-hover:text-orange transition-colors">{link.label}</div>
                  <div className="text-xs text-text-secondary mt-0.5">{link.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
