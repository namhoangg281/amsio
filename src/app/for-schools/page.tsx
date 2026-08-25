import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import ForSchoolsContent from "./ForSchoolsContent";

export const metadata: Metadata = {
  title: "For Schools",
  description: `Partner with ${BRAND.name} to bring world-class academic competition to your students. Earn recognition as an AMSIO Partner School.`,
};

export default function ForSchoolsPage() {
  return <ForSchoolsContent />;
}
