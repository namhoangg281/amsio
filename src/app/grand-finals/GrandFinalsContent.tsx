"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Flag from "@/components/ui/Flag";
import { GRAND_FINALS, GF_MEDALS } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/context";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function GrandFinalsContent() {
  const { t } = useI18n();

  const whatToExpectItems = [
    { title: t.grandFinals.whatToExpect.item1.title, desc: t.grandFinals.whatToExpect.item1.desc, icon: "🎭" },
    { title: t.grandFinals.whatToExpect.item2.title, desc: t.grandFinals.whatToExpect.item2.desc, icon: "📝" },
    { title: t.grandFinals.whatToExpect.item3.title, desc: t.grandFinals.whatToExpect.item3.desc, icon: "🌏" },
    { title: t.grandFinals.whatToExpect.item4.title, desc: t.grandFinals.whatToExpect.item4.desc, icon: "🏆" },
  ];

  return (
    <>
      <Navbar />
      <main>
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden gradient-hero">
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url('${BASE}/images/generated/grand-finals/gf-ceremony.jpg')` }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-gold/30 text-gold text-sm font-semibold mb-6">
              {t.pages.grandFinals.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              {t.pages.grandFinals.title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              {t.pages.grandFinals.subtitle}
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-6">
              {Object.entries(GF_MEDALS).map(([medal, info]) => (
                <div
                  key={medal}
                  className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-full px-6 py-3 backdrop-blur-sm"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: info.color }}
                  >
                    {medal === "gold" ? "🥇" : medal === "silver" ? "🥈" : "🥉"}
                  </div>
                  <div className="text-left">
                    <span className="text-white font-bold capitalize">{medal}</span>
                    <p className="text-white/60 text-xs">{info.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.grandFinals.hostCities.title}
              subtitle={t.grandFinals.hostCities.subtitle}
            />

            <div className="grid md:grid-cols-2 gap-8">
              {GRAND_FINALS.map((gf, i) => (
                <ScrollReveal key={gf.year} delay={i * 0.1}>
                  <div
                    className={`relative rounded-2xl p-10 overflow-hidden flex flex-col justify-end text-white ${
                      i === 0 ? "md:col-span-2 min-h-[300px]" : "min-h-[240px]"
                    }`}
                  >
                    {/* Host country characteristic background */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url('${BASE}/images/generated/cities/${gf.code}.jpg')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/55 to-navy-dark/20" />
                    {i === 0 && (
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold text-navy-dark text-xs font-bold z-10">
                        {t.grandFinals.hostCities.nextBadge}
                      </div>
                    )}
                    <div className="relative">
                      <Flag code={gf.code} alt={gf.country} className="w-20 md:w-24 rounded-md shadow-md" />
                      <h3 className="mt-4 text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-white drop-shadow">
                        {gf.city}, {gf.country}
                      </h3>
                      <p className="mt-2 text-lg font-medium text-gold drop-shadow">
                        {t.grandFinals.hostCities.cardYearLabel.replace("{year}", String(gf.year))}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-bg-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.grandFinals.whatToExpect.title}
              subtitle={t.grandFinals.whatToExpect.subtitle}
            />

            <div className="grid md:grid-cols-2 gap-6">
              {whatToExpectItems.map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.1} className="h-full">
                  <div className="h-full bg-white rounded-xl p-6 shadow-sm border border-border/20">
                    <span className="text-3xl">{item.icon}</span>
                    <h3 className="mt-3 text-lg font-bold font-[family-name:var(--font-display)] text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
