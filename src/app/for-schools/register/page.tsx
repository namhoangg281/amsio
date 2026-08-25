import type { Metadata } from "next";
import { BRAND } from "@/lib/constants";
import RegisterContent from "./RegisterContent";

export const metadata: Metadata = {
  title: "Register Your School — AMSIO",
  description: `Register as an AMSIO Partner School and bring ${BRAND.name} to your students.`,
};

export default function SchoolRegisterPage() {
  return <RegisterContent />;
}
