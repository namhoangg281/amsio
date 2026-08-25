'use client';

// Content for /olympiad/rounds. Client component so copy resolves through useI18n();
// the page stays a Server Component so it can still export metadata.
// Icons and colours stay in code — they are presentation, not translatable copy.

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useI18n } from '@/lib/i18n/context';
import Link from 'next/link';

const ROUND_STYLE = [
  { icon: '🏫', color: '#1B3A5C' },
  { icon: '🏛️', color: '#2563EB' },
  { icon: '🌏', color: '#E8590C' },
];

const RULE_ICONS = ['👤', '📋', '📝'];

export default function RoundsContent() {
  const { t } = useI18n();
  const p = t.rounds.page;

  const rounds = [p.r1, p.r2, p.r3].map((r, i) => ({
    step: i + 1,
    name: r.name,
    subtitle: r.subtitle,
    date: r.date,
    details: [r.d1, r.d2, r.d3, r.d4, r.d5],
    note: r.note,
    ...ROUND_STYLE[i],
  }));

  const timeline = [p.t1, p.t2, p.t3, p.t4, p.t5, p.t6];

  const ruleSections = [p.rule1, p.rule2, p.rule3].map((r, i) => ({
    title: r.title,
    icon: RULE_ICONS[i],
    items: [r.i1, r.i2, r.i3, r.i4],
  }));

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/generated/hero/hero-competition.jpg')" }} />
          <div className="absolute inset-0 bg-navy-dark/85" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              {p.heroTitle}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              {p.heroSubtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[p.badgeStages, p.badgeCycle, p.badgeGlobal].map((badge) => (
                <span
                  key={badge}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Round cards */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={p.stagesTitle} subtitle={p.stagesSubtitle} />

            <div className="space-y-8">
              {rounds.map((round, i) => (
                <ScrollReveal key={round.step} delay={i * 0.1}>
                  <div className="group flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden border border-border/30 shadow-sm hover:shadow-xl transition-shadow">
                    {/* Left colored strip */}
                    <div
                      className="md:w-56 p-8 flex flex-col items-center justify-center text-white text-center flex-shrink-0"
                      style={{ backgroundColor: round.color }}
                    >
                      <div className="text-5xl mb-3">{round.icon}</div>
                      <div className="text-sm font-bold opacity-70 mb-1">{p.stepLabel} {round.step}</div>
                      <div className="text-2xl font-bold font-[family-name:var(--font-display)]">{round.name}</div>
                      <div className="text-sm opacity-80 mt-1">{round.subtitle}</div>
                      <div className="mt-4 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
                        {round.date}
                      </div>
                    </div>

                    {/* Right content */}
                    <div className="flex-1 p-8 bg-white">
                      <ul className="space-y-3 mb-5">
                        {round.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-3 text-text-secondary text-sm">
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: round.color }}
                            >
                              ✓
                            </span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                      <div className="p-4 rounded-xl bg-bg-subtle border border-border/20 text-sm text-text-secondary italic">
                        {round.note}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={p.timelineTitle} subtitle={p.timelineSubtitle} />

            <div className="relative">
              <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-navy/10" />

              {timeline.map((item, i) => (
                <ScrollReveal key={item.event} delay={i * 0.08}>
                  <div className="relative flex items-start gap-6 mb-8 pl-20 md:pl-28">
                    <div className="absolute left-6 md:left-10 w-5 h-5 rounded-full gradient-navy border-2 border-white shadow-md flex-shrink-0" />
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-border/20 flex-1">
                      <div className="text-xs font-bold text-orange mb-1">{item.period}</div>
                      <div className="font-bold text-navy">{item.event}</div>
                      <div className="text-sm text-text-secondary mt-1">{item.detail}</div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Eligibility & Rules */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={p.rulesTitle} subtitle={p.rulesSubtitle} />

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {ruleSections.map((section, i) => (
                <ScrollReveal key={section.title} delay={i * 0.1}>
                  <div className="p-8 rounded-2xl bg-bg-subtle border border-border/30 h-full">
                    <div className="text-4xl mb-4">{section.icon}</div>
                    <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-navy mb-4">{section.title}</h3>
                    <ul className="space-y-3">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 gradient-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionHeading title={p.ctaTitle} subtitle={p.ctaSubtitle} light />
            <ScrollReveal delay={0.2}>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/for-schools/register"
                  className="inline-flex items-center px-8 py-4 rounded-full bg-orange text-white font-semibold text-lg hover:bg-orange/90 transition-colors shadow-lg"
                >
                  {p.ctaRegister}
                </Link>
                <Link
                  href="/for-schools"
                  className="inline-flex items-center px-8 py-4 rounded-full bg-white/10 border border-white/30 text-white font-semibold text-lg hover:bg-white/20 transition-colors"
                >
                  {p.ctaForSchools}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
