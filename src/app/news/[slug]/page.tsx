import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleDetail from "@/components/article/ArticleDetail";
import { fetchPublishedArticleBySlug } from "@/lib/cms/queries";

// Articles are published from the CMS at any time, so the route resolves per request
// rather than being baked at build. The CMS revalidates its own caches on publish.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchPublishedArticleBySlug("news", slug);
  if (!article) return { title: "Article not found — AMSIO International" };

  const en = article.translations.en;
  return {
    title: en.seo_title?.trim() || `${en.title} — AMSIO International`,
    description: en.seo_description?.trim() || en.excerpt,
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchPublishedArticleBySlug("news", slug);
  if (!article) notFound();

  return <ArticleDetail article={article} backHref="/news" />;
}
