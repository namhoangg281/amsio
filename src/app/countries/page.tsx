import type { Metadata } from "next";
import { BRAND, COUNTRIES } from "@/lib/constants";
import CountriesContent from "./CountriesContent";

export const metadata: Metadata = {
  title: "Countries",
  description: `${BRAND.name} operates in ${COUNTRIES.length}+ countries worldwide. Find your local AMSIO chapter or become a National Partner.`,
};

export default function CountriesPage() {
  return <CountriesContent />;
}
