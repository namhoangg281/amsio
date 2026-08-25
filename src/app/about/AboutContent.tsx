"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BRAND, GRAND_FINALS, ABC_PARTNER } from "@/lib/constants";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function AboutContent() {
  const { t } = useI18n();

  const values = [
    {
      title: t.about.values.excellence.title,
      description: t.about.values.excellence.description,
      icon: "🏆",
    },
    {
      title: t.about.values.fairness.title,
      description: t.about.values.fairness.description,
      icon: "⚖️",
    },
    {
      title: t.about.values.integrity.title,
      description: t.about.values.integrity.description,
      icon: "🛡️",
    },
    {
      title: t.about.values.innovation.title,
      description: t.about.values.innovation.description,
      icon: "💡",
    },
    {
      title: t.about.values.globalCollaboration.title,
      description: t.about.values.globalCollaboration.description,
      icon: "🌍",
    },
  ];

  const milestones = [
    { year: "2018", event: t.about.milestones["2018"].event },
    { year: "2019", event: t.about.milestones["2019"].event },
    { year: "2022", event: t.about.milestones["2022"].event },
    { year: "2026", event: t.about.milestones["2026"].event },
    { year: "Q4 2026", event: t.about.milestones.oct2026.event },
    { year: "Q1 2027", event: t.about.milestones.jan2027.event },
    { year: "June 2027", event: `Global Round — International Finals in ${GRAND_FINALS[0].city}, ${GRAND_FINALS[0].country}.` },
    { year: "2028", event: `Global Round in ${GRAND_FINALS[1].city}. Expansion to 20+ countries.` },
    { year: "2029", event: `Global Round in ${GRAND_FINALS[2].city}. Launch of online participation track.` },
    { year: "2030", event: `Global Round in ${GRAND_FINALS[3].city}. Vision: 50+ countries, 500,000+ participants.` },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden gradient-hero">
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url('${BASE}/images/generated/hero/hero-about.jpg')` }}
          />
          {/* Decorative blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-gold/30 text-gold text-sm font-semibold mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                {t.pages.about.badge}
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight leading-[1.1]">
                {t.pages.about.title}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                {t.pages.about.subtitle}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap justify-center gap-8 mt-12">
                {[
                  { value: "20+", label: t.about.stats.memberCountries },
                  { value: "4", label: t.about.stats.subjectGroups },
                  { value: "29", label: t.about.stats.gradeDivisions },
                  { value: "2027", label: t.about.stats.firstGrandFinals },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="text-3xl font-bold font-[family-name:var(--font-display)] text-gold">{s.value}</p>
                    <p className="text-sm text-white/50 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.about.visionMission.title}
              subtitle={t.about.visionMission.subtitle}
            />

            <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
              <ScrollReveal>
                <div className="h-full p-8 rounded-2xl bg-bg-subtle border border-border/30">
                  <div className="text-4xl mb-4">🔭</div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy mb-3">
                    {t.about.visionMission.visionLabel}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {t.about.visionMission.visionText}
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <div className="h-full p-8 rounded-2xl bg-bg-subtle border border-border/30">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy mb-3">
                    {t.about.visionMission.missionLabel}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {t.about.visionMission.missionText}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.pages.about.valuesTitle}
              subtitle={t.about.valuesSubtitle}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-12">
              {values.map((value, i) => (
                <ScrollReveal key={value.title} delay={i * 0.1}>
                  <div className="h-full text-center p-6 rounded-2xl bg-white border border-border/30 hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.2}>
              <p className="text-center text-text-secondary italic max-w-3xl mx-auto mt-12">
                {t.about.valuesIntro}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.pages.about.timelineTitle}
              subtitle={t.about.timelineSubtitle}
            />

            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-navy/10 md:-translate-x-0.5" />

              {milestones.map((m, i) => (
                <ScrollReveal key={m.year} delay={i * 0.1}>
                  <div
                    className={`relative flex items-start gap-6 mb-8 ${
                      i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="hidden md:block flex-1" />
                    <div className="relative z-10 w-8 h-8 rounded-full gradient-navy flex items-center justify-center text-white text-xs font-bold shadow-lg flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-border/20">
                      <span className="text-sm font-bold text-orange">{m.year}</span>
                      <p className="mt-1 text-text-primary">{m.event}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Academic Partner */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.pages.about.partnerLabel}
              subtitle={t.about.partnerSubtitle}
            />

            <ScrollReveal>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Card ABC — Academic Sponsorship Partner */}
                <div className="bg-bg-subtle rounded-2xl p-8 border border-border/30">
                  <div className="flex items-center mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/logo/abc-logo-horizontal.png"
                      alt="ABC Education Group"
                      className="h-20 w-auto object-contain"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange mb-1">{t.about.partner.abc.label}</p>
                  <h3 className="font-bold text-navy text-xl font-[family-name:var(--font-display)] mb-4">{ABC_PARTNER.name}</h3>
                  <ul className="space-y-3">
                    {t.about.partner.abc.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
                        <span className="text-orange mt-1 shrink-0">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-border/30 text-sm text-text-secondary">
                    <div>
                      <span className="font-semibold text-navy block">{t.about.partner.headquartersLabel}</span>
                      {ABC_PARTNER.headquarters}
                    </div>
                    <div>
                      <span className="font-semibold text-navy block">{t.about.partner.presenceLabel}</span>
                      {ABC_PARTNER.countries}+ {t.about.partner.presenceSuffix}
                    </div>
                    <div>
                      <span className="font-semibold text-navy block">{t.about.partner.establishedLabel}</span>
                      {ABC_PARTNER.established}
                    </div>
                  </div>
                </div>

                {/* Card Polaris — Assessment Unit */}
                <div className="bg-bg-subtle rounded-2xl p-8 border border-border/30">
                  <div className="flex items-center mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/logo/polaris-logo.png"
                      alt="Polaris Global Academy"
                      className="h-20 w-auto object-contain"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange mb-1">{t.about.partner.polaris.label}</p>
                  <h3 className="font-bold text-navy text-xl font-[family-name:var(--font-display)] mb-4">Polaris Global Academy</h3>
                  <ul className="space-y-3">
                    {t.about.partner.polaris.bullets.map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
                        <span className="text-orange mt-1 shrink-0">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Quick links */}
        <section className="py-24 gradient-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionHeading
              title="AMSIO International"
              subtitle={t.about.learnMore.subtitle}
              light
            />
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                { label: t.about.learnMore.links.governanceCouncil, href: "/about/governance" },
                { label: t.about.learnMore.links.executiveTeam, href: "/about/team" },
                { label: t.about.learnMore.links.pressMedia, href: "/press" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors font-medium"
                >
                  {link.label}
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
