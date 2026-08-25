import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import SamplePapersContent from "./SamplePapersContent";

export const metadata: Metadata = {
  title: "Sample Papers",
  description: `Download sample examination papers for ${BRAND.name} across Mathematics, Science, Language, and Computational Intelligence.`,
};

export default function SamplePapersPage() {
  return <SamplePapersContent />;
}
