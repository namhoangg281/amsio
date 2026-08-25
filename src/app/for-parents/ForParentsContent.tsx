"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ButtonLink from "@/components/ui/ButtonLink";
import { ACHIEVEMENT_TIERS } from "@/lib/constants";
import {
  Globe,
  Brain,
  Award,
  Star,
  GraduationCap,
  Clock,
  CheckCircle,
  HelpCircle,
  School,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const tierColors: Record<string, { bg: string; border: string; badge: string }> = {
  Gold: { bg: "bg-amber-50", border: "border-amber-300", badge: "bg-amber-400 text-white" },
  Silver: { bg: "bg-slate-50", border: "border-slate-300", badge: "bg-slate-400 text-white" },
  Bronze: { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-400 text-white" },
  Certificate: { bg: "bg-navy-light", border: "border-navy/20", badge: "bg-navy text-white" },
};

export default function ForParentsContent() {
  const { t } = useI18n();

  const whyMatters = [
    {
      icon: Globe,
      title: t.forParents.whySection.item1.title,
      description: t.forParents.whySection.item1.description,
    },
    {
      icon: Brain,
      title: t.forParents.whySection.item2.title,
      description: t.forParents.whySection.item2.description,
    },
    {
      icon: Award,
      title: t.forParents.whySection.item3.title,
      description: t.forParents.whySection.item3.description,
    },
    {
      icon: Star,
      title: t.forParents.whySection.item4.title,
      description: t.forParents.whySection.item4.description,
    },
    {
      icon: GraduationCap,
      title: t.forParents.whySection.item5.title,
      description: t.forParents.whySection.item5.description,
    },
  ];

  const journey = [
    {
      step: 1,
      title: t.forParents.journeySection.step1.title,
      desc: t.forParents.journeySection.step1.desc,
      timing: t.forParents.journeySection.step1.timing,
    },
    {
      step: 2,
      title: t.forParents.journeySection.step2.title,
      desc: t.forParents.journeySection.step2.desc,
      timing: t.forParents.journeySection.step2.timing,
    },
    {
      step: 3,
      title: t.forParents.journeySection.step3.title,
      desc: t.forParents.journeySection.step3.desc,
      timing: t.forParents.journeySection.step3.timing,
    },
    {
      step: 4,
      title: t.forParents.journeySection.step4.title,
      desc: t.forParents.journeySection.step4.desc,
      timing: t.forParents.journeySection.step4.timing,
      conditional: true,
    },
    {
      step: 5,
      title: t.forParents.journeySection.step5.title,
      desc: t.forParents.journeySection.step5.desc,
      timing: t.forParents.journeySection.step5.timing,
      conditional: true,
    },
  ];

  const faqs = [
    { q: t.forParents.faqSection.faq1.q, a: t.forParents.faqSection.faq1.a },
    { q: t.forParents.faqSection.faq2.q, a: t.forParents.faqSection.faq2.a },
    { q: t.forParents.faqSection.faq3.q, a: t.forParents.faqSection.faq3.a },
    { q: t.forParents.faqSection.faq4.q, a: t.forParents.faqSection.faq4.a },
    { q: t.forParents.faqSection.faq5.q, a: t.forParents.faqSection.faq5.a },
    { q: t.forParents.faqSection.faq6.q, a: t.forParents.faqSection.faq6.a },
    { q: t.forParents.faqSection.faq7.q, a: t.forParents.faqSection.faq7.a },
    { q: t.forParents.faqSection.faq8.q, a: t.forParents.faqSection.faq8.a },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${BASE}/images/generated/hero/hero-parents.jpg')`, opacity: 0.18 }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 text-gold border border-gold/30 mb-6">
                {t.pages.forParents.badge}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
                {t.pages.forParents.title}
              </h1>
              <p className="mt-6 text-lg text-white/70 max-w-2xl">
                {t.pages.forParents.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Why AMSIO matters */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.pages.forParents.whyTitle}
              subtitle={t.forParents.whySection.subtitle}
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyMatters.map((item, i) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.title} delay={i * 0.1}>
                    <div className="p-8 rounded-2xl border border-border/30 hover:shadow-lg transition-shadow h-full">
                      <div className="w-12 h-12 rounded-xl bg-navy-light flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-navy" />
                      </div>
                      <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Journey */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.pages.forParents.journeyTitle}
              subtitle={t.forParents.journeySection.subtitle}
            />
            <div className="space-y-6">
              {journey.map((item, i) => (
                <ScrollReveal key={item.step} delay={i * 0.1}>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          item.conditional ? "bg-orange" : "gradient-navy"
                        }`}
                      >
                        {item.step}
                      </div>
                      {i < journey.length - 1 && (
                        <div className="w-0.5 flex-1 mt-2 bg-border/40 min-h-[24px]" />
                      )}
                    </div>
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-border/20 mb-2">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-navy">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {item.conditional && (
                            <span className="text-xs font-medium text-orange bg-orange-light px-2 py-0.5 rounded-full">
                              {t.forParents.journeySection.topPerformersOnly}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-xs text-text-secondary">
                            <Clock className="w-3.5 h-3.5" />
                            {item.timing}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* What to expect on competition day */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.forParents.competitionDaySection.title}
              subtitle={t.forParents.competitionDaySection.subtitle}
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Clock,
                  title: t.forParents.competitionDaySection.card1.title,
                  points: [
                    t.forParents.competitionDaySection.card1.point1,
                    t.forParents.competitionDaySection.card1.point2,
                    t.forParents.competitionDaySection.card1.point3,
                    t.forParents.competitionDaySection.card1.point4,
                  ],
                },
                {
                  icon: CheckCircle,
                  title: t.forParents.competitionDaySection.card2.title,
                  points: [
                    t.forParents.competitionDaySection.card2.point1,
                    t.forParents.competitionDaySection.card2.point2,
                    t.forParents.competitionDaySection.card2.point3,
                    t.forParents.competitionDaySection.card2.point4,
                    t.forParents.competitionDaySection.card2.point5,
                  ],
                },
                {
                  icon: School,
                  title: t.forParents.competitionDaySection.card3.title,
                  points: [
                    t.forParents.competitionDaySection.card3.point1,
                    t.forParents.competitionDaySection.card3.point2,
                    t.forParents.competitionDaySection.card3.point3,
                    t.forParents.competitionDaySection.card3.point4,
                    t.forParents.competitionDaySection.card3.point5,
                  ],
                },
                {
                  icon: Brain,
                  title: t.forParents.competitionDaySection.card4.title,
                  points: [
                    t.forParents.competitionDaySection.card4.point1,
                    t.forParents.competitionDaySection.card4.point2,
                    t.forParents.competitionDaySection.card4.point3,
                    t.forParents.competitionDaySection.card4.point4,
                    t.forParents.competitionDaySection.card4.point5,
                  ],
                },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <ScrollReveal key={card.title} delay={i * 0.1}>
                    <div className="p-6 rounded-2xl border border-border/30 h-full">
                      <div className="w-10 h-10 rounded-xl bg-navy-light flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-navy" />
                      </div>
                      <h3 className="font-bold font-[family-name:var(--font-display)] text-navy mb-3">
                        {card.title}
                      </h3>
                      <ul className="space-y-1.5">
                        {card.points.map((pt) => (
                          <li key={pt} className="text-sm text-text-secondary flex gap-2">
                            <span className="text-gold mt-0.5 flex-shrink-0">•</span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Understanding results */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.forParents.resultsSection.title}
              subtitle={t.forParents.resultsSection.subtitle}
            />
            <div className="grid sm:grid-cols-2 gap-6">
              {ACHIEVEMENT_TIERS.map((tier, i) => {
                const styles = tierColors[tier.name] ?? {
                  bg: "bg-gray-50",
                  border: "border-gray-200",
                  badge: "bg-gray-400 text-white",
                };
                return (
                  <ScrollReveal key={tier.name} delay={i * 0.1}>
                    <div
                      className={`p-6 rounded-2xl border ${styles.bg} ${styles.border}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy">
                          {tier.name}
                        </h3>
                        <span
                          className={`text-sm font-semibold px-3 py-1 rounded-full ${styles.badge}`}
                        >
                          {tier.percentage}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {tier.name === "Gold" &&
                          t.forParents.resultsSection.distinction.description}
                        {tier.name === "Silver" &&
                          t.forParents.resultsSection.highMerit.description}
                        {tier.name === "Bronze" &&
                          t.forParents.resultsSection.merit.description}
                        {tier.name === "Certificate" &&
                          t.forParents.resultsSection.participationPlus.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
            <div className="mt-8 p-5 rounded-xl bg-white border border-border/30 text-sm text-text-secondary text-center">
              {t.forParents.resultsSection.footer}
            </div>
          </div>
        </section>

        {/* Grand Finals */}
        <section className="py-24 gradient-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.forParents.grandFinalsSection.title}
              subtitle={t.forParents.grandFinalsSection.subtitle}
              light
            />
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: t.forParents.grandFinalsSection.card1.title,
                  desc: t.forParents.grandFinalsSection.card1.desc,
                },
                {
                  title: t.forParents.grandFinalsSection.card2.title,
                  desc: t.forParents.grandFinalsSection.card2.desc,
                },
                {
                  title: t.forParents.grandFinalsSection.card3.title,
                  desc: t.forParents.grandFinalsSection.card3.desc,
                },
              ].map((card, i) => (
                <ScrollReveal key={card.title} delay={i * 0.1}>
                  <div className="glass rounded-2xl p-8 border border-white/10">
                    <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-gold mb-3">
                      {card.title}
                    </h3>
                    <p className="text-white/75 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            <div className="mt-10 text-center">
              <ButtonLink href="/grand-finals" variant="outline" size="lg">
                {t.pages.forParents.cta}
              </ButtonLink>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.forParents.faqSection.title}
              subtitle={t.forParents.faqSection.subtitle}
            />
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <ScrollReveal key={i} delay={i * 0.05}>
                  <div className="rounded-xl border border-border/30 p-6 bg-bg-subtle">
                    <div className="flex gap-3">
                      <HelpCircle className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold font-[family-name:var(--font-display)] text-navy mb-2">
                          {faq.q}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — Talk to your school */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="rounded-2xl bg-white border border-border/30 shadow-lg p-12">
                <div className="w-14 h-14 rounded-2xl gradient-navy flex items-center justify-center mx-auto mb-6">
                  <School className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] text-navy mb-4">
                  {t.forParents.ctaSection.title}
                </h2>
                <p className="text-text-secondary mb-8 leading-relaxed">
                  {t.forParents.ctaSection.body}
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <ButtonLink href="/contact" size="lg">{t.common.contactUs}</ButtonLink>
                  <ButtonLink href="/for-schools" variant="outline" size="lg">
                    {t.forParents.ctaSection.informationForSchoolsButton}
                  </ButtonLink>
                </div>
                <p className="mt-6 text-sm text-text-secondary">
                  {t.forParents.ctaSection.schoolsEmailNote}{" "}
                  <a
                    href="mailto:info@amsio.org"
                    className="text-navy font-medium hover:text-orange transition-colors"
                  >
                    info@amsio.org
                  </a>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
