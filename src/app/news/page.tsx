import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import NewsContent from "./NewsContent";
import { fetchPublishedArticles, fetchFeaturedArticle } from "@/lib/cms/queries";
import { FALLBACK_NEWS_ARTICLES, FALLBACK_FEATURED_NEWS } from "@/lib/cms/fallback-news";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News & Announcements",
  description: `Latest news, announcements, and updates from ${BRAND.name} — registration openings, Global Round confirmations, and organisational milestones.`,
};

export default async function NewsPage() {
  const [articles, featured] = await Promise.all([
    fetchPublishedArticles("news").catch(() => FALLBACK_NEWS_ARTICLES),
    fetchFeaturedArticle("news").catch(() => FALLBACK_FEATURED_NEWS),
  ]);
  return <NewsContent articles={articles} featured={featured} />;
}
