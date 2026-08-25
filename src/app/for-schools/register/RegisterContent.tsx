'use client';

// Content for /for-schools/register. Client component so the text resolves through
// useI18n() — the locale lives in localStorage, which a Server Component cannot read.
// The page itself stays a Server Component so it can still export metadata.

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ButtonLink from '@/components/ui/ButtonLink';
import SchoolRegistrationForm from '@/components/school/SchoolRegistrationForm';
import { BRAND } from '@/lib/constants';
import { useI18n } from '@/lib/i18n/context';
import Link from 'next/link';

export default function RegisterContent() {
  const { t } = useI18n();
  const r = t.forSchools.register;

  const steps = [r.step1, r.step2, r.step3, r.step4];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6">
              <span>🏫</span>
              <span>{r.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              {r.title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              {r.subtitle}
            </p>
          </div>
        </section>

        {/* Registration Form + Info */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 items-start">

              {/* Left — Form */}
              <ScrollReveal className="lg:col-span-3">
                <div className="bg-white rounded-2xl border border-border/20 shadow-sm p-8">
                  <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                    {r.formTitle}
                  </h2>
                  <p className="text-text-secondary text-sm mb-8">
                    {r.requiredNote}
                  </p>
                  <SchoolRegistrationForm />
                </div>
              </ScrollReveal>

              {/* Right — Info Panel */}
              <ScrollReveal delay={0.15} className="lg:col-span-2">
                <div className="space-y-6">

                  {/* What happens next */}
                  <div className="rounded-2xl bg-navy-light p-6">
                    <h3 className="font-bold text-navy mb-4 text-base">{r.nextTitle}</h3>
                    <ol className="space-y-3">
                      {steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-text-secondary">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-navy text-white text-xs flex items-center justify-center font-bold mt-0.5">
                            {i + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Contact */}
                  <div className="rounded-2xl bg-bg-subtle p-6">
                    <h3 className="font-bold text-navy text-base mb-2">{r.helpTitle}</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      {r.helpBody}
                    </p>
                    <div className="flex flex-col gap-2">
                      <Link href="/countries" className="text-sm font-semibold text-orange hover:underline">
                        → {r.findPartner}
                      </Link>
                      <Link href={`mailto:${BRAND.email}`} className="text-sm font-semibold text-orange hover:underline">
                        → {r.emailUs}
                      </Link>
                    </div>
                  </div>

                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 gradient-navy">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <p className="text-white/70 mb-6 text-lg">
                {r.ctaBody}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <ButtonLink href="/for-schools" variant="outline" size="lg">{r.ctaAbout}</ButtonLink>
                <ButtonLink href="/countries" variant="secondary" size="lg">{r.ctaFindPartner}</ButtonLink>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
