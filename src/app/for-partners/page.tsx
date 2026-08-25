import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import ForPartnersContent from "./ForPartnersContent";

export const metadata: Metadata = {
  title: "Partner Resources",
  description: `${BRAND.name} National Partner resource hub — operational toolkit, key responsibilities, support information, and the document library for registered National Partners.`,
};

export default function ForPartnersPage() {
  return <ForPartnersContent />;
}
