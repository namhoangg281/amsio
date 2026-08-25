import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import GrandFinalsContent from "./GrandFinalsContent";

export const metadata: Metadata = {
  title: "Global Round — International Finals",
  description: `The ${BRAND.name} Global Round brings together top achievers from every member country. Gold, Silver, and Bronze — the ultimate stage for young minds.`,
};

export default function GrandFinalsPage() {
  return <GrandFinalsContent />;
}
