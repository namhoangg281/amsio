import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import PressContent from "./PressContent";
import { fetchPublishedArticles } from "@/lib/cms/queries";
import { FALLBACK_PRESS_ARTICLES } from "@/lib/cms/fallback-press";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Press & Media — AMSIO International",
  description: `Official press and media resources for ${BRAND.name}. Brand assets, boilerplate copy, key facts, and media contact information.`,
};

export default async function PressPage() {
  const articles = await fetchPublishedArticles("press").catch(() => FALLBACK_PRESS_ARTICLES);
  return <PressContent articles={articles} />;
}
