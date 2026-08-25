import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with AMSIO International or your local National Partner. Reach out for inquiries about competitions, partnerships, or school registration.",
  openGraph: {
    title: "Contact AMSIO International",
    description:
      "Have a question about AMSIO? Reach out to our global team or your local National Partner.",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
