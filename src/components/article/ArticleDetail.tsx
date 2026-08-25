'use client';

// Reader view for a single CMS article, shared by /news/[slug] and /press/[slug].
// Client component so the reader's locale (held in localStorage) picks the right
// translation — the list pages flatten to English because they show only a title.

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useI18n } from '@/lib/i18n/context';
import type { Article, ArticleTranslation } from '@/lib/cms/types';
import Link from 'next/link';
import Image from 'next/image';

interface ArticleDetailProps {
  article: Article;
  backHref: string;
}

/**
 * Resolve the translation for the active locale, falling back field by field to
 * English. A partially translated article shows translated fields where they exist
 * rather than dropping back to English wholesale.
 */
function resolveTranslation(article: Article, locale: string): ArticleTranslation {
  const en = article.translations.en;
  const byLocale = article.translations as unknown as Record<
    string,
    Partial<ArticleTranslation> | undefined
  >;
  const mine = byLocale[locale];
  if (!mine) return en;
  return {
    title: mine.title?.trim() || en.title,
    excerpt: mine.excerpt?.trim() || en.excerpt,
    body: mine.body?.trim() || en.body,
    seo_title: mine.seo_title?.trim() || en.seo_title,
    seo_description: mine.seo_description?.trim() || en.seo_description,
  };
}

function formatDate(iso: string | null, locale: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return new Date(iso).toISOString().slice(0, 10);
  }
}

export default function ArticleDetail({ article, backHref }: ArticleDetailProps) {
  const { t, locale } = useI18n();
  const a = resolveTranslation(article, locale);
  const label = article.category === 'press' ? t.article.press : t.article.news;

  // Body is authored in a plain textarea. Rendering it as text paragraphs — never as
  // HTML — keeps staff-authored copy from becoming an injection vector.
  const paragraphs = a.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
        <section className="gradient-hero pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors mb-6"
            >
              ← {t.article.back}
            </Link>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-bold uppercase tracking-wider">
                {label}
              </span>
              {article.published_at && (
                <time className="text-white/50 text-sm" dateTime={article.published_at}>
                  {formatDate(article.published_at, locale)}
                </time>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight leading-tight">
              {a.title}
            </h1>
            {a.excerpt && (
              <p className="mt-6 text-lg text-white/70 leading-relaxed">{a.excerpt}</p>
            )}
          </div>
        </section>

        {/* Cover image — optional; articles without one simply skip it */}
        {article.cover_url && (
          <div className="bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-14">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl bg-bg-subtle">
                <Image
                  src={article.cover_url}
                  alt={a.title}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Body */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              {paragraphs.length > 0 ? (
                <div className="space-y-5">
                  {paragraphs.map((para, i) => (
                    <p key={i} className="text-text-secondary leading-relaxed text-base md:text-lg whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-text-secondary italic">{t.article.emptyBody}</p>
              )}
            </ScrollReveal>

            <div className="mt-14 pt-8 border-t border-border/30">
              <Link
                href={backHref}
                className="inline-flex items-center gap-2 text-orange font-semibold hover:underline"
              >
                ← {t.article.back}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
