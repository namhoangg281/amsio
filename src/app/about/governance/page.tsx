import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import GovernanceContent from "./GovernanceContent";

export const metadata: Metadata = {
  title: "Governance & Council — AMSIO International",
  description: `Learn how ${BRAND.name} is governed — the International Council, Executive Committee, Subject Committees, and the principles of independence, transparency, and academic integrity.`,
};

export default function GovernancePage() {
  return <GovernanceContent />;
}
