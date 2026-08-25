"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import NewsSubscribeForm from "@/components/news/NewsSubscribeForm";
import { useI18n } from "@/lib/i18n/context";
import type { ArticleDisplayItem } from "@/lib/cms/types";
import Link from "next/link";
import Image from "next/image";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

type FilterTab = "All" | "Registration" | "Global Round" | "Organization" | "Examination";

const filterTabs: FilterTab[] = [
  "All",
  "Registration",
  "Global Round",
  "Organization",
  "Examination",
];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

interface NewsContentProps {
  articles: ArticleDisplayItem[];
  featured: ArticleDisplayItem | null;
}

export default function NewsContent({ articles, featured }: NewsContentProps) {
  const { t } = useI18n();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden gradient-hero">
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${BASE}/images/generated/hero/hero-news.jpg')`, opacity: 0.18 }}
          />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6">
              <span>📰</span>
              <span>Latest Updates</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              {t.pages.news.title}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              {t.pages.news.subtitle}
            </p>
          </div>
        </section>

        {/* Filter Tabs (visual only) */}
        <section className="border-b border-border/30 bg-white sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-3 scrollbar-none">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
                    tab === "All"
                      ? "bg-navy text-white"
                      : "text-text-secondary hover:text-navy hover:bg-navy-light"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featured && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <div className="relative rounded-3xl overflow-hidden gradient-navy shadow-2xl">
                  {featured.cover_url && (
                    <Image
                      src={featured.cover_url}
                      alt={featured.title}
                      fill
                      sizes="100vw"
                      className="object-cover opacity-25"
                    />
                  )}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold via-transparent to-transparent" />
                  <div className="relative px-8 py-12 md:px-12 md:py-16 lg:py-20 lg:px-16">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-bold uppercase tracking-wider">
                        Featured
                      </span>
                      <span className="text-white/50 text-sm">
                        {formatDate(featured.published_at ?? featured.created_at)}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-white max-w-3xl leading-tight mb-6">
                      {featured.title}
                    </h2>
                    <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-3xl mb-8">
                      {featured.excerpt}
                    </p>
                    <Link
                      href={`/news/${featured.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold text-navy-dark text-sm font-bold hover:bg-gold/90 transition-colors"
                    >
                      {t.article.readMore} →
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* Latest News Grid */}
        <section className="py-16 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Latest News"
              subtitle="All announcements from AMSIO International and its National Partners."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <ScrollReveal key={article.id} delay={i * 0.08} className="h-full">
                  <article className="bg-white rounded-2xl border border-border/20 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col overflow-hidden">
                    {article.cover_url && (
                      <Link href={`/news/${article.slug}`} className="relative block w-full aspect-[16/9] bg-bg-subtle">
                        <Image
                          src={article.cover_url}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      </Link>
                    )}
                    <div className="px-6 pt-6 pb-4 flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-navy-light text-navy">
                          News
                        </span>
                        <time className="text-xs text-text-secondary">
                          {formatDate(article.published_at ?? article.created_at)}
                        </time>
                      </div>
                      <h3 className="font-bold font-[family-name:var(--font-display)] text-navy text-base leading-snug mb-3">
                        {article.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="px-6 pb-6">
                      <Link
                        href={`/news/${article.slug}`}
                        className="inline-flex items-center gap-1 text-orange text-sm font-semibold hover:underline"
                      >
                        {t.article.readMore} →
                      </Link>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Subscribe */}
        <section className="py-20 bg-white border-t border-border/20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="text-4xl mb-4">📬</div>
              <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-display)] text-navy mb-3">
                Stay Up to Date
              </h2>
              <p className="text-text-secondary mb-8">
                Receive announcements directly — registration windows, results
                publication dates, and Global Round news.
              </p>
              <NewsSubscribeForm />
              <p className="mt-4 text-xs text-text-secondary">
                No spam. Unsubscribe at any time. Updates only.
              </p>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
