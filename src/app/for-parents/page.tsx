import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import ForParentsContent from "./ForParentsContent";

export const metadata: Metadata = {
  title: "For Parents",
  description: `Support your child's journey in ${BRAND.name}. Understand how the olympiad works, what to expect, and how achievement is recognised at every level.`,
};

export default function ForParentsPage() {
  return <ForParentsContent />;
}
