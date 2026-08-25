import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${BRAND.name} — the ${BRAND.fullName}. Our mission, governance, and the team behind the global olympiad.`,
};

export default function AboutPage() {
  return <AboutContent />;
}
