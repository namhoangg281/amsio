"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ButtonLink from "@/components/ui/ButtonLink";
import { SUBJECTS, ROUNDS, ACHIEVEMENT_TIERS } from "@/lib/constants";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const SUBJECT_IMAGES: Record<string, string> = {
  mathematics: `${BASE}/images/generated/subjects/math.jpg`,
  science: `${BASE}/images/generated/subjects/science.jpg`,
  language: `${BASE}/images/generated/subjects/language.jpg`,
  ci: `${BASE}/images/generated/subjects/ci.jpg`,
};

export default function OlympiadContent() {
  const { t } = useI18n();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden gradient-hero">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Left: text */}
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-gold/30 text-gold text-sm font-semibold mb-6">
                  {t.pages.olympiad.badge}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
                  {t.pages.olympiad.title}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl lg:max-w-none">
                  {t.pages.olympiad.subtitle}
                </p>
              </div>

              {/* Right: hero image — hidden on mobile */}
              <div className="hidden lg:flex justify-center items-center flex-shrink-0">
                <div className="relative w-full max-w-[480px]">
                  {/* Outer glow ring */}
                  <div className="absolute -inset-8 bg-gradient-to-br from-gold/30 via-orange/20 to-transparent rounded-full blur-3xl" />
                  {/* Inner ring accent */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-gold/20 to-orange/10 blur-sm" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${BASE}/images/generated/hero/hero-competition.jpg`}
                    alt="AMSIO Competition"
                    width={480}
                    height={360}
                    className="relative w-full h-auto rounded-2xl shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subject image strip */}
        <section className="bg-navy py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {(
                [
                  { key: "mathematics", label: "Mathematics", color: "#2563EB" },
                  { key: "science",     label: "Science",     color: "#059669" },
                  { key: "language",    label: "Language",    color: "#7C3AED" },
                  { key: "ci",          label: "Computational Intelligence", color: "#E8590C" },
                ] as const
              ).map(({ key, label, color }) => (
                <div key={key} className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SUBJECT_IMAGES[key]}
                    alt={label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* colour overlay */}
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{ backgroundColor: color }}
                  />
                  {/* label */}
                  <div className="absolute inset-0 flex items-end p-4">
                    <span className="text-white font-bold text-sm md:text-base leading-tight drop-shadow-lg">
                      {label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subjects */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.pages.olympiad.exploreSubjects}
              subtitle="Each subject is independently designed to assess deep understanding and genuine problem-solving ability."
            />

            <div className="space-y-8">
              {SUBJECTS.map((subject, i) => (
                <ScrollReveal key={subject.id} delay={i * 0.1}>
                  <Link href={`/olympiad/${subject.id}`}>
                    <div className="group flex flex-col md:flex-row gap-6 p-8 rounded-2xl border border-border/30 hover:shadow-xl hover:border-transparent transition-all cursor-pointer">
                      <div
                        className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 transition-transform group-hover:scale-110 overflow-hidden"
                        style={{ backgroundColor: subject.color }}
                      >
                        {SUBJECT_IMAGES[subject.id] && (
                          <div
                            className="absolute inset-0 bg-cover bg-center opacity-30"
                            style={{ backgroundImage: `url('${SUBJECT_IMAGES[subject.id]}')` }}
                          />
                        )}
                        <span className="relative z-10">{subject.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                          {subject.name}
                        </h3>
                        <p className="text-text-secondary leading-relaxed mb-4">
                          {subject.description}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="px-3 py-1 rounded-full bg-navy-light text-navy font-medium">
                            {subject.divisions} Division Levels
                          </span>
                          <span className="px-3 py-1 rounded-full bg-navy-light text-navy font-medium">
                            {subject.duration}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-navy-light text-text-secondary">
                            {subject.divisionLabel}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <svg
                          className="w-6 h-6 text-navy/30 group-hover:text-orange transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Rounds */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.pages.olympiad.viewSchedule}
              subtitle="A structured journey from school to the world stage."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROUNDS.map((round, i) => (
                <ScrollReveal key={round.id} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/20 h-full">
                    <div className="text-4xl mb-4">{round.icon}</div>
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange/10 text-orange text-xs font-bold mb-3">
                      Step {i + 1}
                    </div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy mb-1">
                      {round.name}
                    </h3>
                    <p className="text-sm font-medium text-orange mb-3">
                      {round.subtitle}
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {round.description}
                    </p>
                    <p className="mt-4 text-sm font-medium text-navy">
                      {round.date}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Achievement Tiers */}
        <section className="py-24 gradient-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Achievement Recognition"
              subtitle="Every effort acknowledged. Every achievement earned."
              light
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ACHIEVEMENT_TIERS.map((tier, i) => (
                <ScrollReveal key={tier.name} delay={i * 0.1}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-bold"
                      style={{ backgroundColor: tier.color, color: "#fff" }}
                    >
                      {i === 0 ? "D" : i === 1 ? "HM" : i === 2 ? "M" : "P+"}
                    </div>
                    <h3 className="text-white font-bold">{tier.name}</h3>
                    <p className="text-white/60 text-sm mt-1">{tier.percentage}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.4} className="text-center mt-12">
              <ButtonLink href="/olympiad/rounds">{t.pages.olympiad.learnMore}</ButtonLink>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
