"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GRAND_FINALS, GF_MEDALS } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ButtonLink from "@/components/ui/ButtonLink";
import Flag from "@/components/ui/Flag";
import { useI18n } from "@/lib/i18n/context";

export default function GrandFinalsShowcase() {
  const { t } = useI18n();
  const nextFinals = GRAND_FINALS[0];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/generated/grand-finals/gf-ceremony.jpg')" }}
      />
      <div className="absolute inset-0 bg-navy-dark/85" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t.home.grandFinals.title}
          subtitle={t.home.grandFinals.subtitle}
          light
        />

        {/* Featured city — only the US Grand Finals links to the Grand Finals page */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <Link href="/grand-finals">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative inline-block overflow-hidden border border-white/10 rounded-3xl px-12 py-10 hover:border-white/30 transition-colors cursor-pointer"
              >
                {/* Host country characteristic background */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('/images/generated/cities/${nextFinals.code}.jpg')` }}
                />
                <div className="absolute inset-0 bg-navy-dark/65" />
                <div className="relative">
                  <Flag code={nextFinals.code} alt={nextFinals.country} className="w-24 md:w-28 mx-auto rounded-md shadow-lg" />
                  <h3 className="mt-4 text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] text-white drop-shadow">
                    {nextFinals.city}, {nextFinals.country}
                  </h3>
                  <p className="mt-2 text-gold text-lg font-medium drop-shadow">
                    {t.home.grandFinals.grandFinalsLabel} {nextFinals.year}
                  </p>
                </div>
              </motion.div>
            </Link>
          </div>
        </ScrollReveal>

        {/* Medals */}
        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {Object.entries(GF_MEDALS).map(([medal, info]) => (
              <div
                key={medal}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: info.color }}
                >
                  {medal === "gold" ? "🥇" : medal === "silver" ? "🥈" : "🥉"}
                </div>
                <div>
                  <span className="text-white font-semibold capitalize">{medal}</span>
                  <span className="text-white/60 ml-2 text-sm">{info.label}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Future hosts */}
        <ScrollReveal delay={0.3}>
          <div className="text-center">
            <p className="text-white/40 text-sm uppercase tracking-wider mb-6">
              {t.home.grandFinals.futureHosts}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {GRAND_FINALS.slice(1).map((gf) => (
                /* Future host cities are informational only — no link (mục 4) */
                <div
                  key={gf.year}
                  className="relative overflow-hidden rounded-xl w-44 min-h-[120px] flex flex-col justify-end text-center border border-white/10"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/images/generated/cities/${gf.code}.jpg')` }}
                  />
                  <div className="absolute inset-0 bg-navy-dark/60" />
                  <div className="relative px-6 py-4">
                    <Flag code={gf.code} alt={gf.country} className="w-9 mx-auto rounded-sm shadow" />
                    <p className="text-white font-medium mt-2 drop-shadow">{gf.city}</p>
                    <p className="text-white/70 text-sm drop-shadow">{gf.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4} className="text-center mt-12">
          <ButtonLink href="/grand-finals" size="lg">{t.home.grandFinals.learnMore}</ButtonLink>
        </ScrollReveal>
      </div>
    </section>
  );
}
