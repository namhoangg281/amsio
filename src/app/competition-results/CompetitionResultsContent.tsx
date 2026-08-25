"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useI18n } from "@/lib/i18n/context";
import type { CompetitionShowcase } from "./page";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// ─── Static content ───────────────────────────────────────────────────────────

const accessSteps = [
  {
    step: 1,
    title: "Log In to the Participant Portal",
    description:
      "Access amsio.org/contact using the credentials issued to your school upon registration.",
  },
  {
    step: 2,
    title: "Navigate to Results",
    description:
      'Select "My Results" from the dashboard. Results for each round appear here once published.',
  },
  {
    step: 3,
    title: "Download Your Certificate",
    description:
      "Certificates of Achievement are available as PDF. Gold, Silver, Bronze, and Certificate of Participation are issued to all eligible participants.",
  },
];

interface AchievementTier {
  label: string;
  threshold: string;
  color: string;
  textColor: string;
  bg: string;
  border: string;
  description: string;
}

const achievementTiers: AchievementTier[] = [
  {
    label: "Gold",
    threshold: "Top 10%",
    color: "#E8A817",
    textColor: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    description: "Exceptional performance. The highest recognition awarded by AMSIO.",
  },
  {
    label: "Silver",
    threshold: "Next 20%",
    color: "#9CA3AF",
    textColor: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-200",
    description: "Outstanding achievement, placing in the top 30% of all participants.",
  },
  {
    label: "Bronze",
    threshold: "Next 30%",
    color: "#CD7F32",
    textColor: "text-amber-800",
    bg: "bg-orange-50",
    border: "border-orange-200",
    description: "Strong performance recognised at the national and international level.",
  },
  {
    label: "Certificate of Participation",
    threshold: "All participants",
    color: "#1B3A5C",
    textColor: "text-navy",
    bg: "bg-navy-light",
    border: "border-navy/20",
    description: "Commendable effort. All participants receive a certificate of participation.",
  },
];

// ─── Medal badge ─────────────────────────────────────────────────────────────

function MedalBadge({ medal }: { medal: string | null }) {
  if (!medal) return null;
  const colorMap: Record<string, string> = {
    Gold:   "bg-amber-100 text-amber-800 border-amber-300",
    Silver: "bg-gray-100 text-gray-700 border-gray-300",
    Bronze: "bg-orange-100 text-orange-800 border-orange-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorMap[medal] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
    >
      {medal === "Gold" ? "🥇" : medal === "Silver" ? "🥈" : "🥉"} {medal}
    </span>
  );
}

// ─── Certificate thumbnail ────────────────────────────────────────────────────

function CertificateThumbnail({ pdfUrl, studentName }: { pdfUrl: string | null; studentName: string }) {
  if (!pdfUrl) return null;

  return (
    <a
      href={pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Download ${studentName}'s certificate`}
      className="flex-shrink-0 w-12 h-16 rounded-md border border-amber-200 bg-amber-50 flex flex-col items-center justify-center gap-0.5 shadow-sm hover:shadow-md hover:border-amber-400 transition-all group"
      title="Download certificate"
    >
      <svg
        className="w-5 h-5 text-amber-600 group-hover:text-amber-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span className="text-[9px] font-semibold text-amber-700 leading-tight">PDF</span>
    </a>
  );
}

// ─── Top performers section ───────────────────────────────────────────────────

function TopPerformersSection({ competitions }: { competitions: CompetitionShowcase[] }) {
  const [selectedCompIdx, setSelectedCompIdx] = useState(0);
  const comp = competitions[selectedCompIdx];
  const performers = comp?.top_performers ?? [];

  return (
    <section className="py-24 bg-bg-subtle">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Top Performers"
          subtitle="Medal winners and highest scorers from each AMSIO competition season."
        />

        {competitions.length > 1 && (
          <div className="flex gap-2 flex-wrap mb-8">
            {competitions.map((c, i) => (
              <button
                key={c.id}
                onClick={() => setSelectedCompIdx(i)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  i === selectedCompIdx
                    ? "gradient-navy text-white border-transparent shadow-sm"
                    : "bg-white text-navy border-border/40 hover:border-navy/30"
                }`}
              >
                {c.name}{c.year ? ` ${c.year}` : ""}
              </button>
            ))}
          </div>
        )}

        {performers.length === 0 ? (
          <div className="flex gap-4 items-start p-5 rounded-2xl bg-blue-50 border border-blue-200">
            <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg">
              🕐
            </div>
            <div>
              <p className="font-semibold text-blue-900 text-sm">Results not yet published</p>
              <p className="text-blue-700 text-sm mt-1 leading-relaxed">
                Results for this competition will appear here once officially released.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {performers.map((p, i) => (
              <ScrollReveal key={p.user_id} delay={i * 0.05}>
                <div className="flex items-center gap-4 bg-white rounded-2xl border border-border/20 shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center text-sm font-bold text-navy/60">
                    {i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-semibold text-navy truncate">{p.student_name}</span>
                      <MedalBadge medal={p.medal} />
                      {p.gf_qualified && !p.medal && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-navy/10 text-navy border border-navy/20">
                          🌐 Grand Finals
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
                      {p.r1_score != null && (
                        <span>Round 1: <span className="font-medium text-navy">{p.r1_score}</span></span>
                      )}
                      {p.r2_score != null && (
                        <span>Round 2: <span className="font-medium text-navy">{p.r2_score}</span></span>
                      )}
                      {p.subjects.length > 0 && (
                        <span className="text-text-secondary/70">{p.subjects.join(", ")}</span>
                      )}
                    </div>
                  </div>

                  <CertificateThumbnail pdfUrl={p.certificate_pdf_url} studentName={p.student_name} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  competitions: CompetitionShowcase[];
}

export default function CompetitionResultsContent({ competitions }: Props) {
  const { t } = useI18n();
  const hasResults = competitions.length > 0;

  return (
    <>
      <Navbar />
      <main>
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden gradient-hero">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${BASE}/images/generated/hero/hero-results.jpg')`, opacity: 0.18 }}
          />
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-orange/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6">
              <span>🏅</span>
              <span>Participant Results</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              {t.pages.results.title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              {t.pages.results.subtitle}
            </p>
          </div>
        </section>

        {!hasResults && (
          <section className="py-12 bg-white border-b border-border/20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex gap-4 items-start p-5 rounded-2xl bg-blue-50 border border-blue-200">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg">
                  🕐
                </div>
                <div>
                  <p className="font-semibold text-blue-900 text-sm">{t.pages.results.comingSoon}</p>
                  <p className="text-blue-700 text-sm mt-1 leading-relaxed">
                    Round 1 results will be published following the conclusion of all
                    national examinations. Check back or log in to the portal for updates.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {hasResults && <TopPerformersSection competitions={competitions} />}

        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="How to Access Your Results"
              subtitle="Results are published through the AMSIO participant portal. Your school administrator will have your login credentials."
            />

            <div className="space-y-4">
              {accessSteps.map((item, i) => (
                <ScrollReveal key={item.step} delay={i * 0.1}>
                  <div className="flex gap-5 items-start p-6 rounded-2xl border border-border/20 hover:shadow-md transition-shadow bg-white">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-navy flex items-center justify-center text-white font-bold text-lg font-[family-name:var(--font-display)]">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-bold font-[family-name:var(--font-display)] text-navy mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.3} className="text-center mt-10">
              <a
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full gradient-navy text-white font-semibold text-base hover:opacity-90 transition-opacity shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Log In to Portal
              </a>
            </ScrollReveal>
          </div>
        </section>

        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Achievement Tiers"
              subtitle="Every participant receives a certificate. Achievement tiers are determined by national percentile rankings."
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievementTiers.map((tier, i) => (
                <ScrollReveal key={tier.label} delay={i * 0.1}>
                  <div className={`rounded-2xl border ${tier.border} ${tier.bg} p-6 h-full`}>
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm mb-4 shadow-sm"
                      style={{ backgroundColor: tier.color }}
                    >
                      {tier.threshold.replace("Top ", "").replace("%", "%")}
                    </div>
                    <h3 className={`font-bold font-[family-name:var(--font-display)] text-lg mb-1 ${tier.textColor}`}>
                      {tier.label}
                    </h3>
                    <p className={`text-xs font-semibold mb-3 ${tier.textColor} opacity-70`}>
                      {tier.threshold} of participants
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {tier.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 gradient-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <p className="text-white/60 text-sm mb-2">Previous Seasons</p>
              <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-white mb-4">
                Archive Access
              </h2>
              <p className="text-white/70 text-base leading-relaxed max-w-2xl mx-auto mb-8">
                Results from previous seasons are accessible through the participant
                portal. Schools and participants who have completed any season of AMSIO
                can retrieve historical results, rankings, and certificates at any time.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-navy font-semibold text-base hover:bg-white/90 transition-colors shadow-lg"
              >
                Access Portal
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
