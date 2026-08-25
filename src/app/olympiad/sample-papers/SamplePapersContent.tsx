"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ButtonLink from "@/components/ui/ButtonLink";
import { SUBJECTS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/context";

export default function SamplePapersContent() {
  const { t } = useI18n();

  const subjectMeta = [
    {
      id: "mathematics",
      color: "#2563EB",
      icon: "∑",
      bg: "bg-blue-50",
      accent: "text-blue-700",
      border: "border-blue-200",
    },
    {
      id: "science",
      color: "#059669",
      icon: "⚛",
      bg: "bg-emerald-50",
      accent: "text-emerald-700",
      border: "border-emerald-200",
    },
    {
      id: "language",
      color: "#7C3AED",
      icon: "文",
      bg: "bg-violet-50",
      accent: "text-violet-700",
      border: "border-violet-200",
    },
    {
      id: "ci",
      color: "#E8590C",
      icon: "{}",
      bg: "bg-orange-50",
      accent: "text-orange-700",
      border: "border-orange-200",
    },
  ];

  const formatHints = [
    {
      icon: "📋",
      title: t.samplePapers.formatHints["0"].title,
      description: t.samplePapers.formatHints["0"].description,
    },
    {
      icon: "🧮",
      title: t.samplePapers.formatHints["1"].title,
      description: t.samplePapers.formatHints["1"].description,
    },
    {
      icon: "⏱",
      title: t.samplePapers.formatHints["2"].title,
      description: t.samplePapers.formatHints["2"].description,
    },
    {
      icon: "🌐",
      title: t.samplePapers.formatHints["3"].title,
      description: t.samplePapers.formatHints["3"].description,
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden gradient-navy">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6">
              <span>📄</span>
              <span>{t.pages.samplePapers.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              {t.pages.samplePapers.title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              {t.pages.samplePapers.subtitle}
            </p>
          </div>
        </section>

        {/* Important Notice */}
        <section className="py-12 bg-amber-50 border-b border-amber-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-xl">
                ℹ
              </div>
              <div>
                <h2 className="font-bold text-amber-900 text-lg font-[family-name:var(--font-display)] mb-1">
                  {t.samplePapers.notice.heading}
                </h2>
                <p className="text-amber-800 leading-relaxed">
                  {t.samplePapers.notice.body}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Available Sample Papers */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.samplePapers.availableSection.title}
              subtitle={t.samplePapers.availableSection.subtitle}
            />

            <div className="grid md:grid-cols-2 gap-8">
              {SUBJECTS.map((subject, i) => {
                const meta = subjectMeta.find((m) => m.id === subject.id)!;
                return (
                  <ScrollReveal key={subject.id} delay={i * 0.1}>
                    <div
                      className={`rounded-2xl border ${meta.border} overflow-hidden`}
                    >
                      {/* Card header */}
                      <div
                        className="px-8 py-6 flex items-center gap-4"
                        style={{ backgroundColor: meta.color }}
                      >
                        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold text-white">
                          {subject.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-white">
                            {subject.name}
                          </h3>
                          <p className="text-white/75 text-sm mt-0.5">
                            {subject.duration} · {subject.divisions} Divisions
                          </p>
                        </div>
                      </div>

                      {/* Downloads */}
                      <div className={`px-8 py-6 ${meta.bg} space-y-4`}>
                        {[t.samplePapers.levelPrimary, t.samplePapers.levelSecondary].map(
                          (level) => (
                            <div
                              key={level}
                              className="flex items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-white"
                            >
                              <div>
                                <p className="font-semibold text-navy text-sm">
                                  {t.samplePapers.paperLabel.replace("{level}", level)}
                                </p>
                                <p className={`text-xs mt-0.5 ${meta.accent}`}>
                                  {t.samplePapers.paperRelease}
                                </p>
                              </div>
                              <a
                                href="#"
                                aria-label={`Download ${subject.name} ${level} sample paper`}
                                className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                                style={{ backgroundColor: meta.color }}
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                  />
                                </svg>
                                {t.pages.samplePapers.download}
                              </a>
                            </div>
                          )
                        )}

                        {/* CI note for university */}
                        {subject.id === "ci" && (
                          <div className="flex items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm border border-white">
                            <div>
                              <p className="font-semibold text-navy text-sm">
                                {t.samplePapers.ciUniversityLabel}
                              </p>
                              <p className={`text-xs mt-0.5 ${meta.accent}`}>
                                {t.samplePapers.paperRelease}
                              </p>
                            </div>
                            <a
                              href="#"
                              aria-label="Download Computational Intelligence University sample paper"
                              className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                              style={{ backgroundColor: meta.color }}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                              {t.pages.samplePapers.download}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* What to Expect */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.samplePapers.whatToExpectSection.title}
              subtitle={t.samplePapers.whatToExpectSection.subtitle}
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {formatHints.map((hint, i) => (
                <ScrollReveal key={hint.title} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/20 h-full">
                    <div className="text-3xl mb-4">{hint.icon}</div>
                    <h3 className="font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                      {hint.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {hint.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Preparation Philosophy */}
        <section className="py-24 gradient-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="text-5xl mb-6">💡</div>
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] text-white mb-6">
                {t.samplePapers.prepSection.heading}
              </h2>
              <blockquote className="text-xl md:text-2xl text-white/80 italic leading-relaxed border-l-4 border-gold pl-6 text-left max-w-2xl mx-auto">
                {t.samplePapers.prepSection.quote}
              </blockquote>
              <p className="mt-8 text-white/60 text-base max-w-2xl mx-auto">
                {t.samplePapers.prepSection.body}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2} className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <ButtonLink href="/olympiad/faq" size="lg">{t.samplePapers.prepSection.ctaFaq}</ButtonLink>
              <ButtonLink href="/for-schools" variant="outline" size="lg">
                {t.samplePapers.prepSection.ctaSchool}
              </ButtonLink>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
