'use client';

// Content for /countries/become-partner. Client component so copy resolves through
// useI18n(); the page stays a Server Component so it can still export metadata.
// Icons stay in code — presentation, not translatable copy.

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import Flag from '@/components/ui/Flag';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { COMING_SOON_COUNTRIES } from '@/lib/constants';
import { useI18n } from '@/lib/i18n/context';

const MAILTO = 'mailto:info@amsio.org?subject=Expression of Interest — AMSIO National Partner';
const BENEFIT_ICONS = ['🌍', '💰', '📦', '🏅', '✈️'];
const PROFILE_ICONS = ['🏫', '🏆', '📚'];

function MailIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

export default function BecomePartnerContent() {
  const { t } = useI18n();
  const p = t.becomePartner;

  const responsibilities = [p.resp1, p.resp2, p.resp3, p.resp4, p.resp5, p.resp6];
  const facts = [p.fact1, p.fact2, p.fact3, p.fact4, p.fact5, p.fact6, p.fact7];
  const benefits = [p.b1, p.b2, p.b3, p.b4, p.b5].map((b, i) => ({ ...b, icon: BENEFIT_ICONS[i] }));
  const profiles = [p.p1, p.p2, p.p3].map((x, i) => ({ ...x, icon: PROFILE_ICONS[i] }));
  const steps = [p.s1, p.s2, p.s3, p.s4];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-navy-dark">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange via-transparent to-transparent pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm font-medium mb-6">
                <span>🤝</span>
                <span>{p.heroBadge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight leading-tight mb-6">
                {p.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-white/65 leading-relaxed max-w-2xl mb-8">
                {p.heroSubtitle}
              </p>
              <a
                href={MAILTO}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-orange text-white font-semibold text-base hover:bg-orange/90 transition-colors shadow-xl"
              >
                <MailIcon />
                {p.heroCta}
              </a>
            </div>
          </div>
        </section>

        {/* What Is a National Partner */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <ScrollReveal>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] text-navy mb-6">
                    {p.whatTitle}
                  </h2>
                  <p className="text-text-secondary leading-relaxed text-base mb-6">
                    {p.whatBody1}
                  </p>
                  <p className="text-text-secondary leading-relaxed text-base mb-8">
                    {p.whatBody2}
                  </p>
                  <h3 className="font-bold font-[family-name:var(--font-display)] text-navy mb-4">
                    {p.responsibilitiesTitle}
                  </h3>
                  <ul className="space-y-3">
                    {responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-navy-light flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <span className="text-sm text-text-secondary leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.15}>
                <div className="bg-bg-subtle rounded-3xl p-8 lg:p-10 border border-border/20">
                  <h3 className="font-bold font-[family-name:var(--font-display)] text-navy text-xl mb-6">
                    {p.factsTitle}
                  </h3>
                  <dl className="space-y-5">
                    {facts.map((item) => (
                      <div key={item.label} className="flex justify-between gap-4 border-b border-border/20 pb-5 last:border-0 last:pb-0">
                        <dt className="text-sm text-text-secondary">{item.label}</dt>
                        <dd className="text-sm font-semibold text-navy text-right">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Why Partner with AMSIO */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={p.benefitsTitle} subtitle={p.benefitsSubtitle} />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b, i) => (
                <ScrollReveal key={b.title} delay={i * 0.08}>
                  <div className="bg-white rounded-2xl p-7 border border-border/20 shadow-sm h-full hover:shadow-lg transition-shadow">
                    <div className="text-3xl mb-4">{b.icon}</div>
                    <h3 className="font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                      {b.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Profile */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={p.profileTitle} subtitle={p.profileSubtitle} />

            <div className="grid md:grid-cols-3 gap-6">
              {profiles.map((item, i) => (
                <ScrollReveal key={item.label} delay={i * 0.1}>
                  <div className="rounded-2xl border border-border/20 bg-bg-subtle p-8 h-full text-center">
                    <div className="text-4xl mb-5">{item.icon}</div>
                    <h3 className="font-bold font-[family-name:var(--font-display)] text-navy mb-3">
                      {item.label}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.3}>
              <p className="text-center text-text-secondary text-sm mt-8 max-w-2xl mx-auto">
                {p.profileNote}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-24 gradient-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={p.processTitle} subtitle={p.processSubtitle} light />

            <div className="space-y-5">
              {steps.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.1}>
                  <div className="flex gap-5 items-start bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange flex items-center justify-center text-white font-bold text-lg font-[family-name:var(--font-display)]">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold font-[family-name:var(--font-display)] text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-white/65 text-sm leading-relaxed mb-2">
                        {item.description}
                      </p>
                      <p className="text-xs text-gold/80 font-medium">{item.note}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Countries */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={p.comingTitle} subtitle={p.comingSubtitle} />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {COMING_SOON_COUNTRIES.map((country, i) => (
                <ScrollReveal key={country.slug} delay={i * 0.04}>
                  <div className="flex items-center gap-4 p-5 rounded-2xl border border-border/20 bg-bg-subtle">
                    <Flag code={country.code} alt={country.name} className="w-9 rounded-sm shadow-sm" />
                    <div>
                      <p className="font-semibold text-navy text-sm font-[family-name:var(--font-display)]">
                        {country.name}
                      </p>
                      <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {p.comingBadge}
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.3}>
              <p className="text-center text-text-secondary text-sm mt-8">
                {p.comingNote}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="bg-white rounded-3xl border border-border/20 shadow-lg p-10 md:p-14">
                <div className="text-5xl mb-6">🤝</div>
                <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-navy mb-4">
                  {p.ctaTitle}
                </h2>
                <p className="text-text-secondary leading-relaxed mb-3">
                  {p.ctaBody}
                </p>
                <p className="font-semibold text-navy mb-8">
                  info@amsio.org
                </p>
                <a
                  href={MAILTO}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-orange text-white font-semibold text-base hover:bg-orange/90 transition-colors shadow-lg"
                >
                  <MailIcon />
                  {p.ctaButton}
                </a>
                <p className="mt-6 text-sm text-text-secondary">
                  {p.ctaResponse}
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
