'use client';

// Content for /about/governance. Client component so copy resolves through useI18n();
// the page stays a Server Component so it can still export metadata.
// Icons stay in code — presentation, not translatable copy.

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SectionHeading from '@/components/ui/SectionHeading';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { ABC_PARTNER } from '@/lib/constants';
import { useI18n } from '@/lib/i18n/context';
import Link from 'next/link';

const COMMITTEE_ICONS = ['∑', '⚛', '文', '{}'];
const PRINCIPLE_ICONS = ['⚖️', '🔍', '🎓', '🌐'];

export default function GovernanceContent() {
  const { t } = useI18n();
  const g = t.governance;

  const councilFunctions = [g.fn1, g.fn2, g.fn3, g.fn4, g.fn5];
  const execRoles = [g.exec1, g.exec2, g.exec3, g.exec4, g.exec5];
  const subjectCommittees = [g.sc1, g.sc2, g.sc3, g.sc4].map((sc, i) => ({
    ...sc,
    icon: COMMITTEE_ICONS[i],
  }));
  const keyPrinciples = [g.kp1, g.kp2, g.kp3, g.kp4].map((kp, i) => ({
    ...kp,
    icon: PRINCIPLE_ICONS[i],
  }));
  const integrityCommitments = [g.ic1, g.ic2, g.ic3, g.ic4];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden gradient-hero">
          <div className="absolute inset-0 opacity-0" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 80%, #E8A817 0%, transparent 50%), radial-gradient(circle at 85% 15%, #E8590C 0%, transparent 50%)',
            }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm font-medium mb-6">
                {g.heroBadge}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
                {g.heroTitle}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                {g.heroSubtitle}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Governance Structure */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={g.councilTitle} subtitle={g.councilSubtitle} />
            <div className="grid lg:grid-cols-2 gap-12 mt-4 items-start">
              <ScrollReveal direction="left">
                <div className="space-y-6">
                  <div className="bg-navy-light rounded-2xl p-8 border border-navy/10">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy mb-4">
                      {g.compositionTitle}
                    </h3>
                    <ul className="space-y-3 text-text-secondary">
                      {[g.composition1, g.composition2, g.composition3].map((line) => (
                        <li key={line} className="flex gap-3">
                          <span className="text-orange font-bold mt-0.5">—</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-navy-light rounded-2xl p-8 border border-navy/10">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy mb-4">
                      {g.decisionTitle}
                    </h3>
                    <ul className="space-y-3 text-text-secondary">
                      {[g.decision1, g.decision2, g.decision3].map((line) => (
                        <li key={line} className="flex gap-3">
                          <span className="text-orange font-bold mt-0.5">—</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.15}>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy mb-6">
                    {g.functionsTitle}
                  </h3>
                  {councilFunctions.map((fn, i) => (
                    <div
                      key={fn.title}
                      className="flex gap-4 p-5 rounded-xl border border-border/30 hover:border-navy/20 hover:bg-bg-subtle transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full gradient-navy text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy mb-1">{fn.title}</h4>
                        <p className="text-sm text-text-secondary leading-relaxed">{fn.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Org Chart */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={g.orgTitle} subtitle={g.orgSubtitle} />
            <ScrollReveal>
              <div className="flex flex-col items-center gap-0">
                {/* Council */}
                <div className="w-full max-w-md bg-navy text-white rounded-2xl px-8 py-6 text-center shadow-lg">
                  <div className="text-xs font-bold tracking-widest uppercase text-gold mb-1">{g.orgSupremeLabel}</div>
                  <div className="text-xl font-bold font-[family-name:var(--font-display)]">
                    {g.orgCouncilName}
                  </div>
                  <div className="text-white/60 text-sm mt-1">{g.orgCouncilDetail}</div>
                </div>

                {/* Connector */}
                <div className="w-0.5 h-10 bg-navy/30" />

                {/* Executive Committee */}
                <div className="w-full max-w-sm bg-white border-2 border-navy rounded-2xl px-8 py-5 text-center shadow-md">
                  <div className="text-xs font-bold tracking-widest uppercase text-orange mb-1">{g.orgOperationalLabel}</div>
                  <div className="text-lg font-bold font-[family-name:var(--font-display)] text-navy">
                    {g.orgExecName}
                  </div>
                  <div className="text-text-secondary text-sm mt-1">{g.orgExecDetail}</div>
                </div>

                {/* Connector fork */}
                <div className="w-0.5 h-10 bg-navy/30" />

                {/* Bottom tier */}
                <div className="w-full grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-border/40 rounded-xl px-6 py-5 text-center">
                    <div className="text-xs font-bold tracking-widest uppercase text-gold mb-1">{g.orgAcademicLabel}</div>
                    <div className="font-bold font-[family-name:var(--font-display)] text-navy">{g.orgCommitteesName}</div>
                    <div className="text-text-secondary text-sm mt-1">
                      {g.orgCommitteesDetail}
                    </div>
                  </div>
                  <div className="bg-white border border-border/40 rounded-xl px-6 py-5 text-center">
                    <div className="text-xs font-bold tracking-widest uppercase text-gold mb-1">{g.orgNetworkLabel}</div>
                    <div className="font-bold font-[family-name:var(--font-display)] text-navy">{g.orgPartnersName}</div>
                    <div className="text-text-secondary text-sm mt-1">
                      {g.orgPartnersDetail}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Executive Committee */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={g.execTitle} subtitle={g.execSubtitle} />
            <ScrollReveal>
              <div className="max-w-3xl mx-auto bg-bg-subtle rounded-2xl p-8 border border-border/30">
                <div className="space-y-4">
                  {execRoles.map((item) => (
                    <div key={item.role} className="flex gap-4 p-4 bg-white rounded-xl border border-border/20">
                      <div className="w-2 h-2 rounded-full bg-orange mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-navy">{item.role}:</span>{' '}
                        <span className="text-text-secondary">{item.responsibility}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Subject Committees */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={g.committeesTitle} subtitle={g.committeesSubtitle} />
            <div className="grid md:grid-cols-2 gap-8 mt-4">
              {subjectCommittees.map((sc, i) => (
                <ScrollReveal key={sc.subject} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-8 border border-border/30 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl gradient-navy flex items-center justify-center text-white text-xl font-bold font-[family-name:var(--font-display)]">
                        {sc.icon}
                      </div>
                      <div>
                        <h3 className="font-bold font-[family-name:var(--font-display)] text-navy text-lg">
                          {sc.subject}
                        </h3>
                        <p className="text-xs text-orange font-semibold">{g.committeeLabel}</p>
                      </div>
                    </div>
                    <p className="text-text-secondary leading-relaxed">{sc.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Academic Partner */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={g.partnerTitle} subtitle={g.partnerSubtitle} />
            <ScrollReveal>
              <div className="max-w-3xl mx-auto bg-bg-subtle rounded-2xl p-10 border border-border/30">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl gradient-navy flex items-center justify-center text-white text-2xl font-bold font-[family-name:var(--font-display)] flex-shrink-0">
                    ABC
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] text-navy">
                      {ABC_PARTNER.name}
                    </h3>
                    <p className="text-orange font-semibold mt-1">{ABC_PARTNER.role}</p>
                    <p className="text-text-secondary mt-4 leading-relaxed">
                      {g.partnerBody}
                    </p>
                    <div className="mt-5 p-4 bg-navy-light rounded-xl border border-navy/10">
                      <p className="text-sm text-text-secondary">
                        <span className="font-semibold text-navy">{g.partnerNoteLabel}</span>{' '}
                        {g.partnerNote}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Key Principles */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={g.principlesTitle} subtitle={g.principlesSubtitle} />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
              {keyPrinciples.map((p, i) => (
                <ScrollReveal key={p.title} delay={i * 0.1}>
                  <div className="text-center p-8 rounded-2xl bg-white border border-border/30 h-full">
                    <div className="text-4xl mb-4">{p.icon}</div>
                    <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-navy mb-3">
                      {p.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{p.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Integrity Commitments */}
        <section className="py-24 bg-navy-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading title={g.integrityTitle} subtitle={g.integritySubtitle} light />
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              {integrityCommitments.map((ic, i) => (
                <ScrollReveal key={ic.area} delay={i * 0.1}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full">
                    <h3 className="font-bold font-[family-name:var(--font-display)] text-gold text-lg mb-3">
                      {ic.area}
                    </h3>
                    <p className="text-white/70 leading-relaxed">{ic.detail}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 gradient-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionHeading title={g.ctaTitle} subtitle={g.ctaSubtitle} light />
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link
                href="/about/team"
                className="px-8 py-4 rounded-full bg-orange text-white font-semibold hover:bg-orange/90 transition-colors shadow-lg"
              >
                {g.ctaTeam}
              </Link>
              <Link
                href="/for-schools"
                className="px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors"
              >
                {g.ctaSchools}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
