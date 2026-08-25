"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import Flag from "@/components/ui/Flag";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ABC_PARTNER } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import type { ArticleDisplayItem } from "@/lib/cms/types";

const keyFacts = [
  { label: "Founded", value: "2026" },
  { label: "Member Countries", value: "12" },
  { label: "Subject Groups", value: "4" },
  { label: "Divisions", value: "35" },
  { label: "Achievement Tiers", value: "4" },
  { label: "Grand Finals cycle", value: "Annual" },
  { label: "Grand Finals", value: "2027, San Francisco" },
  { label: "Academic Partner", value: ABC_PARTNER.name },
];

const brandAssets = [
  {
    title: "Logo — PNG (Transparent)",
    description: "High-resolution PNG with transparent background, suitable for digital use and documents.",
    icon: "🖼️",
  },
  {
    title: "Logo — SVG",
    description: "Scalable vector format for print, large-format, and any resolution-sensitive application.",
    icon: "📐",
  },
  {
    title: "Colour Palette",
    description: "Official HEX, RGB, and CMYK values for Navy, Orange, Gold, and all supporting colours.",
    icon: "🎨",
  },
  {
    title: "Typography Guide",
    description: "Approved typefaces, weights, and usage guidelines for headlines, body copy, and captions.",
    icon: "🔤",
  },
];

const boilerplate = `AMSIO International (Alliance for International Mathematics, Science and Computational Intelligence Olympiad) is a global academic olympiad governing body founded in 2018. Operating across 20+ member countries, AMSIO International provides young learners from Grades 1 through Grade 12+ with a rigorous, curriculum-neutral platform to demonstrate genuine intellectual ability in four subject groups: Mathematics, Science, Language, and Computational Intelligence. Guided by the mission "Empowering Global Education Leaders," AMSIO International employs novel-scenario assessment design that rewards reasoning over rote memorisation. Achievement is recognised through Gold (Top 10%), Silver (next 20%), Bronze (next 30%), and Certificate of Participation. The Global Round (International Finals) is held annually, with upcoming editions in the United States (2027), London (2028), Singapore (2029), and Seoul (2030). Examination development is supported by Academic Partner ABC Education Group.`;

function formatPressDate(iso: string | null): string {
  if (!iso) return "Coming Soon";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

interface PressContentProps {
  articles: ArticleDisplayItem[];
}

export default function PressContent({ articles }: PressContentProps) {
  const { t } = useI18n();

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
                "radial-gradient(circle at 75% 30%, #E8A817 0%, transparent 50%), radial-gradient(circle at 15% 75%, #E8590C 0%, transparent 50%)",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm font-medium mb-6">
                {t.pages.press.subtitle}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
                {t.pages.press.title}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                Official resources for journalists, media organisations, and communications professionals covering AMSIO International.
              </p>
              <div className="mt-8">
                <a
                  href="mailto:info@amsio.org"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-colors font-medium"
                >
                  <span>📧</span>
                  <span>info@amsio.org</span>
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Press Kit */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal direction="left">
                <p className="text-xs font-bold tracking-widest uppercase text-orange mb-4">Press Kit</p>
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] text-navy leading-tight mb-6">
                  Everything you need to cover AMSIO International
                </h2>
                <p className="text-text-secondary leading-relaxed mb-6">
                  The AMSIO International Press Kit contains all the assets and information a journalist or media producer needs to report accurately and compellingly on the world&apos;s newest international academic olympiad.
                </p>
                <ul className="space-y-3 text-text-secondary mb-8">
                  {[
                    "Official logos in multiple formats and colour schemes",
                    "Approved boilerplate text for press releases and articles",
                    "Key facts and statistics for infographics",
                    "High-resolution imagery and brand colour palette",
                    "Organisation background and governance overview",
                    "Grand Finals schedule and host city information",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="text-gold font-bold mt-0.5 flex-shrink-0">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full gradient-navy text-white font-semibold hover:opacity-90 transition-opacity shadow-lg"
                >
                  <span>⬇</span>
                  Download Press Kit
                </a>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.15}>
                <div className="bg-bg-subtle rounded-3xl p-8 border border-border/30">
                  <h3 className="font-bold font-[family-name:var(--font-display)] text-navy text-lg mb-6">
                    Media Contact
                  </h3>
                  <div className="space-y-5">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center text-lg flex-shrink-0">
                        📧
                      </div>
                      <div>
                        <p className="font-semibold text-navy">Email</p>
                        <a href="mailto:info@amsio.org" className="text-orange hover:underline">
                          info@amsio.org
                        </a>
                        <p className="text-xs text-text-secondary mt-1">Responses within 2 business days</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center text-lg flex-shrink-0">
                        🌐
                      </div>
                      <div>
                        <p className="font-semibold text-navy">Website</p>
                        <span className="text-text-secondary">amsio.org</span>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center text-lg flex-shrink-0">
                        📍
                      </div>
                      <div>
                        <p className="font-semibold text-navy">Jurisdiction</p>
                        <span className="text-text-secondary">International — 20+ member countries</span>
                      </div>
                    </div>
                    <div className="border-t border-border/30 pt-5">
                      <p className="text-xs text-text-secondary leading-relaxed">
                        For interview requests, please include your publication name, deadline, and a brief description of the story angle. We are happy to arrange written Q&amp;A or background briefings.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Brand Assets */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Brand Assets"
              subtitle="Official design assets for media use. Please do not modify logos or use unapproved colour combinations."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              {brandAssets.map((asset, i) => (
                <ScrollReveal key={asset.title} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-7 border border-border/30 flex flex-col h-full hover:border-navy/20 hover:shadow-md transition-all duration-300">
                    <div className="text-4xl mb-4">{asset.icon}</div>
                    <h3 className="font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                      {asset.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed flex-1">{asset.description}</p>
                    <a
                      href="#"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange hover:text-orange/80 transition-colors"
                    >
                      Download <span>→</span>
                    </a>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Boilerplate */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Approved Boilerplate"
              subtitle="Use this text when describing AMSIO International in press releases, articles, and broadcast content."
            />
            <ScrollReveal>
              <div className="bg-bg-subtle rounded-2xl p-8 md:p-12 border border-border/30 relative">
                <div className="text-6xl text-navy/5 font-serif absolute top-4 left-8 select-none leading-none">&ldquo;</div>
                <p className="text-text-primary leading-relaxed text-lg relative z-10">
                  {boilerplate}
                </p>
                <div className="mt-6 pt-6 border-t border-border/30 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <p className="text-xs text-text-secondary">
                    This text may be used verbatim or lightly adapted for editorial style. Please do not alter factual content.
                  </p>
                  <button
                    className="flex-shrink-0 px-5 py-2.5 rounded-full border-2 border-navy text-navy font-semibold text-sm hover:bg-navy hover:text-white transition-colors"
                    onClick={undefined}
                    aria-label="Copy boilerplate text"
                  >
                    Copy Text
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Key Facts */}
        <section className="py-24 bg-navy-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Key Facts for Journalists"
              subtitle="Quick reference statistics and information for use in headlines, captions, and infographics."
              light
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {keyFacts.map((fact, i) => (
                <ScrollReveal key={fact.label} delay={i * 0.07}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
                    <div className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-gold mb-2 leading-tight">
                      {fact.value}
                    </div>
                    <div className="text-white/60 text-sm">{fact.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Grand Finals quick reference */}
            <ScrollReveal delay={0.2}>
              <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-8">
                <h3 className="font-bold font-[family-name:var(--font-display)] text-gold text-lg mb-5">
                  Grand Finals Schedule
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { year: 2027, city: "San Francisco", country: "USA", code: "us" },
                    { year: 2028, city: "London", country: "United Kingdom", code: "gb" },
                    { year: 2029, city: "Singapore", country: "Singapore", code: "sg" },
                    { year: 2030, city: "Seoul", country: "South Korea", code: "kr" },
                  ].map((gf) => (
                    <div key={gf.year} className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                      <Flag code={gf.code} alt={gf.country} className="w-8 rounded-sm shadow" />
                      <div>
                        <div className="font-bold text-white">{gf.year}</div>
                        <div className="text-white/60 text-sm">{gf.city}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Announcements — sourced from CMS (fallback to static data when DB unavailable) */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Announcements"
              subtitle="Official statements and news from AMSIO International."
            />
            <div className="grid md:grid-cols-3 gap-8 mt-4">
              {articles.map((article, i) => (
                <ScrollReveal key={article.id} delay={i * 0.1}>
                  <div className="rounded-2xl border border-border/30 overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                    {article.cover_url && (
                      <Link href={`/press/${article.slug}`} className="relative block w-full aspect-[16/9] bg-bg-subtle">
                        <Image
                          src={article.cover_url}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </Link>
                    )}
                    <div className="gradient-navy p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 rounded-full bg-gold/20 border border-gold/30 text-gold text-xs font-bold">
                          Press
                        </span>
                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/60 text-xs font-medium">
                          {formatPressDate(article.published_at)}
                        </span>
                      </div>
                      <h3 className="font-bold font-[family-name:var(--font-display)] text-white text-lg leading-snug">
                        {article.title}
                      </h3>
                    </div>
                    <div className="p-6 bg-bg-subtle flex-1 flex flex-col">
                      <p className="text-text-secondary text-sm leading-relaxed flex-1">{article.excerpt}</p>
                      <div className="mt-5">
                        <Link
                          href={`/press/${article.slug}`}
                          className="inline-flex items-center gap-1 text-orange text-sm font-semibold hover:underline"
                        >
                          {t.article.readMore} →
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Guidelines */}
        <section className="py-20 bg-bg-subtle border-t border-border/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-navy mb-3">
                  Media Usage Guidelines
                </h2>
                <p className="text-text-secondary">
                  When covering AMSIO International, please observe the following guidelines.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    label: "Correct name",
                    text: 'Always refer to the organisation as "AMSIO International" on first reference, and "AMSIO" on subsequent references.',
                  },
                  {
                    label: "Full name",
                    text: 'The full name "Alliance for International Mathematics, Science and Computational Intelligence Olympiad" should appear at least once in longer pieces.',
                  },
                  {
                    label: "Academic Partner",
                    text: 'ABC Education Group is the "Academic Partner." It does not co-own, co-found, or set strategy for AMSIO International.',
                  },
                  {
                    label: "Logo usage",
                    text: "Do not alter the AMSIO International logo colours, proportions, or typography. Use the approved assets from the Press Kit.",
                  },
                ].map((g) => (
                  <div key={g.label} className="bg-white rounded-xl p-6 border border-border/30 flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-orange mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-navy">{g.label}:</span>{" "}
                      <span className="text-text-secondary">{g.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 gradient-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionHeading
              title="Questions from Media?"
              subtitle="Our communications team is ready to assist with enquiries, interview requests, and background briefings."
              light
            />
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <a
                href="mailto:info@amsio.org"
                className="px-8 py-4 rounded-full bg-orange text-white font-semibold hover:bg-orange/90 transition-colors shadow-lg"
              >
                Contact Press Team
              </a>
              <Link
                href="/about"
                className="px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors"
              >
                About AMSIO International
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
