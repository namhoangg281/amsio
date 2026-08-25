"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ButtonLink from "@/components/ui/ButtonLink";
import Flag from "@/components/ui/Flag";
import { COUNTRIES, COMING_SOON_COUNTRIES, SHOW_COUNTRY_LISTINGS } from "@/lib/constants";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

const WorldPartnerMap = dynamic(
  () => import("@/components/ui/WorldPartnerMap"),
  { ssr: false }
);

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function CountriesContent() {
  const { t } = useI18n();

  return (
    <>
      <Navbar />
      <main>
        <section className="relative gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${BASE}/images/generated/hero/hero-countries.jpg')`, opacity: 0.18 }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              {t.pages.countries.title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              {t.pages.countries.subtitle}
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* "Our Global Reach" heading bỏ theo yêu cầu (Country mục 1) */}
            <WorldPartnerMap />
            <p className="mt-8 text-center text-sm text-text-secondary">
              Don&apos;t see your country listed?{' '}
              <a
                href="mailto:info@amsio.org"
                className="font-semibold text-orange hover:underline"
              >
                Contact AMSIO International
              </a>
              {' '}to express interest in becoming a National Partner.
            </p>
          </div>
        </section>

        {SHOW_COUNTRY_LISTINGS && (<>
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.pages.countries.members}
              subtitle="Each country is managed by a dedicated National Partner responsible for school recruitment, exam administration, and local operations."
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {COUNTRIES.map((country, i) => (
                <ScrollReveal key={country.slug} delay={i * 0.05}>
                  <Link href={`/countries/${country.slug}`}>
                    <div className="group flex items-center gap-4 p-6 rounded-2xl border border-border/30 hover:shadow-xl hover:border-orange/30 transition-all cursor-pointer">
                      <Flag code={country.code} alt={country.name} className="w-11 rounded-sm shadow-sm" />
                      <div>
                        <h3 className="font-bold text-navy font-[family-name:var(--font-display)] group-hover:text-orange transition-colors">
                          AMSIO {country.name}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {country.email}
                        </p>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Countries */}
        <section id="coming-soon" className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.pages.countries.comingSoon}
              subtitle="We are actively expanding to new regions. These countries are in the process of establishing National Partnerships."
            />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {COMING_SOON_COUNTRIES.map((country, i) => (
                <ScrollReveal key={country.slug} delay={i * 0.05}>
                  <div className="flex items-center gap-4 p-6 rounded-2xl border border-border/20 bg-white/60 opacity-70">
                    <Flag code={country.code} alt={country.name} className="w-11 rounded-sm grayscale" />
                    <div>
                      <h3 className="font-bold text-navy/60 font-[family-name:var(--font-display)]">
                        {country.name}
                      </h3>
                      <p className="text-xs text-text-secondary">
                        {t.common.comingSoon}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <div className="text-center mt-12">
              <ButtonLink href="/countries/become-partner" variant="outline" size="lg">
                {t.pages.countries.becomePartner}
              </ButtonLink>
            </div>
          </div>
        </section>
        </>)}

        <section className="py-24 gradient-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionHeading
              title="Your Country Not Listed?"
              subtitle="We're actively expanding. Become a National Partner and bring AMSIO to your students."
              light
            />
            <ButtonLink href="/countries/become-partner" size="lg">{t.common.becomePartner}</ButtonLink>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
