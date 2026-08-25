import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import OlympiadContent from "./OlympiadContent";

export const metadata: Metadata = {
  title: "The Olympiad",
  description: `Explore the ${BRAND.name} — 4 subject groups, 35 grade divisions, 3 rounds from State Qualifier to the Global Round.`,
};

export default function OlympiadPage() {
  return <OlympiadContent />;
}
