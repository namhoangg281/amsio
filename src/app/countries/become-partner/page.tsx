import { BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import BecomePartnerContent from "./BecomePartnerContent";

export const metadata: Metadata = {
  title: "Become a National Partner",
  description: `Apply to become an AMSIO National Partner and bring the ${BRAND.fullName} to your country. Exclusive territory rights, revenue sharing, and full operational support.`,
};

export default function BecomePartnerPage() {
  return <BecomePartnerContent />;
}
