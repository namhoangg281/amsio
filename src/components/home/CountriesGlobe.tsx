"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { COUNTRIES } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ButtonLink from "@/components/ui/ButtonLink";
import Flag from "@/components/ui/Flag";
import { useI18n } from "@/lib/i18n/context";

export default function CountriesGlobe() {
  const { t } = useI18n();

  return (
    <section className="py-24 md:py-32 bg-bg-subtle overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t.home.countries.title}
          subtitle={t.home.countries.subtitle}
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Globe placeholder — will be replaced with Three.js in Phase 3 */}
          <ScrollReveal>
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-navy/10 to-navy/5 border border-navy/10" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-navy-light to-white border border-navy/5" />

              {/* Country dots positioned on "globe" */}
              {COUNTRIES.map((country, i) => {
                const angle = (i / COUNTRIES.length) * 2 * Math.PI;
                const radiusOffsets = [3, 7, 1, 9, 5, 2, 8, 4, 6, 0, 7, 3];
                const radius = 35 + radiusOffsets[i % radiusOffsets.length];
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                return (
                  <motion.div
                    key={country.slug}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                    className="absolute w-3 h-3"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <Link href={`/countries/${country.slug}`}>
                      <motion.div
                        whileHover={{ scale: 2 }}
                        className="w-3 h-3 rounded-full bg-orange shadow-lg cursor-pointer relative group"
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-navy text-white text-xs px-2 py-1 rounded pointer-events-none">
                          <Flag code={country.code} className="w-4 inline rounded-[1px] mr-1" />{country.name}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-orange animate-ping opacity-20" />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Center AMSIO logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-4xl font-bold font-[family-name:var(--font-display)] text-navy/20">
                    AMSIO
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Country list */}
          <ScrollReveal delay={0.2}>
            <div>
              <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] text-navy mb-6">
                {t.home.countries.nationalPartners}
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {COUNTRIES.map((country) => (
                  <Link key={country.slug} href={`/countries/${country.slug}`}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:shadow-md transition-all cursor-pointer"
                    >
                      <Flag code={country.code} alt={country.name} className="w-7 rounded-sm shadow-sm" />
                      <div>
                        <span className="text-sm font-medium text-navy">
                          AMSIO {country.name}
                        </span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>

              <ButtonLink href="/countries/become-partner" variant="secondary" size="lg">
                {t.home.countries.becomePartner}
              </ButtonLink>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
