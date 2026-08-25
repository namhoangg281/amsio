import type { Metadata } from "next";
import RoundsContent from "./RoundsContent";

export const metadata: Metadata = {
  title: "Rounds & Structure — AMSIO International",
  description: `Understand the full AMSIO competition structure — Round 1 State Qualifier, Round 2 National Finals, and the Global Round in the United States.`,
};

export default function RoundsPage() {
  return <RoundsContent />;
}
