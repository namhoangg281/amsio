"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import {
  BookOpen,
  FileText,
  Layers,
  ClipboardList,
  Users,
  Package,
  UserCheck,
  BarChart2,
  Trophy,
  DollarSign,
  Mail,
  Download,
  Globe,
  ShieldCheck,
  Headphones,
  Megaphone,
  MonitorCheck,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const toolkit = [
  {
    icon: BookOpen,
    title: "International Handbook",
    description:
      "The authoritative reference for all National Partners. Covers governance, examination protocols, results management, Global Round, and compliance requirements.",
  },
  {
    icon: FileText,
    title: "National Partner Manual",
    description:
      "Country-level operational guide. Covers your responsibilities, timeline, school management, reporting, and the full exam delivery workflow from T-14 to results day.",
  },
  {
    icon: Layers,
    title: "Examination Specifications",
    description:
      "Detailed subject structure, paper formats, division definitions, timing, permitted materials, and delivery conditions for every subject group.",
  },
  {
    icon: ClipboardList,
    title: "Forms & Templates",
    description:
      "All required operational documents: school registration forms, proctor instructions, incident report templates, student data submission sheets, and results acknowledgement forms.",
  },
];

const responsibilities = [
  {
    icon: Users,
    title: "School Recruitment",
    items: [
      "Identify and approach eligible schools within your country",
      "Onboard schools through the AMSIO registration process",
      "Provide schools with all necessary information and materials",
      "Maintain an up-to-date register of partner schools",
    ],
  },
  {
    icon: Package,
    title: "Examination Delivery",
    items: [
      "Receive exam papers securely from AMSIO HQ",
      "Distribute papers to partner schools in accordance with delivery protocols",
      "Administer Round 1 and Round 2 examinations within your country",
      "Return completed scripts to AMSIO HQ in line with schedule",
    ],
  },
  {
    icon: UserCheck,
    title: "Student Registration",
    items: [
      "Collect participant data from all partner schools",
      "Verify data accuracy and completeness before submission",
      "Submit final registration data to AMSIO HQ on time",
      "Handle amendments and corrections within the permitted window",
    ],
  },
  {
    icon: BarChart2,
    title: "Results Management",
    items: [
      "Receive and review results data from AMSIO HQ",
      "Distribute individual results to schools promptly",
      "Coordinate certificate printing and distribution",
      "Manage any results queries through the official appeals process",
    ],
  },
  {
    icon: Trophy,
    title: "Global Round",
    items: [
      "Identify and select the national delegation from Round 2 results",
      "Communicate qualification to students and schools",
      "Coordinate delegation travel and logistics",
      "Represent your country professionally at the Global Round",
    ],
  },
  {
    icon: DollarSign,
    title: "Financial",
    items: [
      "Collect participation fees from partner schools",
      "Maintain accurate financial records for all transactions",
      "Submit financial reports to AMSIO HQ per the agreed schedule",
      "Resolve any payment discrepancies promptly",
    ],
  },
];

const hqSupport = [
  {
    icon: Package,
    title: "Examination Papers",
    desc: "Exam papers are dispatched from AMSIO HQ and arrive T-14 days before the scheduled exam date. Delivery tracking details are provided upon dispatch.",
  },
  {
    icon: Headphones,
    title: "Dedicated Partner Manager",
    desc: "Every National Partner has a named Partner Manager at AMSIO HQ as their primary operational contact. Your Partner Manager handles escalations and coordination.",
  },
  {
    icon: ShieldCheck,
    title: "Appeals Process",
    desc: "AMSIO HQ manages all appeals centrally. National Partners have a 14 working-day window post-results to submit appeals on behalf of students via the official portal.",
  },
  {
    icon: Megaphone,
    title: "Marketing Playbook",
    desc: "A full marketing and brand asset package — including digital graphics, print templates, social media content, and messaging guidelines — is provided each cycle.",
  },
  {
    icon: MonitorCheck,
    title: "Results Portal Access",
    desc: "Authorised National Partner staff have access to the secure AMSIO Results Portal for real-time data, certificate generation, and reporting.",
  },
];

const contacts = [
  {
    label: "General Enquiries",
    email: "info@amsio.org",
    desc: "For general questions not covered by the operational contacts below.",
  },
  {
    label: "Partner Operations",
    email: "info@amsio.org",
    desc: "Primary contact for all operational matters, timelines, and escalations.",
  },
  {
    label: "Examination Queries",
    email: "info@amsio.org",
    desc: "Examination specifications, paper delivery, script returns, and appeals.",
  },
  {
    label: "Finance",
    email: "info@amsio.org",
    desc: "Fee invoicing, payment queries, and financial reporting.",
  },
];

const documents = [
  { title: "International Handbook", version: "v1.3", icon: BookOpen },
  { title: "National Partner Manual", version: "v1.3", icon: FileText },
  { title: "Examination Specifications", version: "v1.3", icon: Layers },
  { title: "Global Round Host Guide", version: "v1.2", icon: Globe },
  { title: "Examiner Guide", version: "v1.3", icon: ClipboardList },
  { title: "Marketing Playbook", version: "v1.2", icon: Megaphone },
];

export default function ForPartnersContent() {
  const { t } = useI18n();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${BASE}/images/generated/hero/hero-partners.jpg')`, opacity: 0.18 }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 text-gold border border-gold/30 mb-6">
                {t.pages.forPartners.badge}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
                {t.pages.forPartners.title}
              </h1>
              <p className="mt-6 text-lg text-white/70 max-w-2xl">
                {t.pages.forPartners.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/contact" size="lg">{t.pages.forPartners.cta1}</ButtonLink>
                <a href="mailto:info@amsio.org">
                  <Button variant="outline" size="lg">
                    {t.pages.forPartners.cta2}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Operational Toolkit */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Operational Toolkit"
              subtitle="Core reference documents for National Partners. Always use the latest version."
            />
            <div className="grid md:grid-cols-2 gap-8">
              {toolkit.map((item, i) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.title} delay={i * 0.1}>
                    <div className="p-8 rounded-2xl border border-border/30 hover:shadow-lg transition-shadow h-full flex gap-5">
                      <div className="w-12 h-12 rounded-xl bg-navy-light flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-navy" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Responsibilities */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Key Responsibilities"
              subtitle="National Partners are the operational backbone of AMSIO in their country."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {responsibilities.map((resp, i) => {
                const Icon = resp.icon;
                return (
                  <ScrollReveal key={resp.title} delay={i * 0.1}>
                    <div className="bg-white p-7 rounded-2xl border border-border/20 shadow-sm h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl gradient-navy flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold font-[family-name:var(--font-display)] text-navy">
                          {resp.title}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {resp.items.map((item) => (
                          <li key={item} className="text-sm text-text-secondary flex gap-2">
                            <span className="text-orange font-bold flex-shrink-0 mt-0.5">›</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Support from HQ */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Support from AMSIO HQ"
              subtitle="What AMSIO International provides to every National Partner each cycle."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hqSupport.map((item, i) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.title} delay={i * 0.1}>
                    <div className="p-6 rounded-2xl border border-border/30 hover:border-navy/30 hover:shadow-md transition-all h-full">
                      <div className="w-10 h-10 rounded-xl bg-orange-light flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-orange" />
                      </div>
                      <h3 className="font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Key Contacts */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Key Contacts"
              subtitle="Direct lines to the right teams at AMSIO HQ."
            />
            <div className="grid sm:grid-cols-2 gap-6">
              {contacts.map((contact, i) => (
                <ScrollReveal key={contact.email} delay={i * 0.1}>
                  <div className="bg-white p-6 rounded-2xl border border-border/30 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-navy-light flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-navy" />
                      </div>
                      <div>
                        <h3 className="font-bold font-[family-name:var(--font-display)] text-navy mb-0.5">
                          {contact.label}
                        </h3>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-sm text-orange font-medium hover:underline"
                        >
                          {contact.email}
                        </a>
                        <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">
                          {contact.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Document Library */}
        <section className="py-24 gradient-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Document Library"
              subtitle="Current versions of all official AMSIO operational documents."
              light
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc, i) => {
                const Icon = doc.icon;
                return (
                  <ScrollReveal key={doc.title} delay={i * 0.1}>
                    <div className="glass rounded-2xl border border-white/10 p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-gold" />
                        </div>
                        <span className="text-xs font-mono text-white/50 bg-white/5 px-2 py-1 rounded">
                          {doc.version}
                        </span>
                      </div>
                      <h3 className="font-bold font-[family-name:var(--font-display)] text-white flex-1 mb-4">
                        {doc.title}
                      </h3>
                      <a
                        href="#"
                        className="flex items-center gap-2 text-sm text-gold font-medium hover:text-white transition-colors group"
                      >
                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        Download
                      </a>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
            <p className="mt-8 text-center text-white/50 text-sm">
              Documents are updated each cycle. Always ensure you are using the latest version.
              Contact{" "}
              <a href="mailto:info@amsio.org" className="text-gold hover:underline">
                info@amsio.org
              </a>{" "}
              if you cannot locate a required document.
            </p>
          </div>
        </section>

        {/* Portal Access */}
        <section className="py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="rounded-2xl border border-border/30 shadow-lg p-12">
                <div className="w-14 h-14 rounded-2xl gradient-navy flex items-center justify-center mx-auto mb-6">
                  <MonitorCheck className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] text-navy mb-4">
                  Partner Portal
                </h2>
                <p className="text-text-secondary mb-8 leading-relaxed">
                  Access the AMSIO Partner Portal to manage school registrations, view
                  student data, download results, generate certificates, and submit
                  reports. Portal access is provided to authorised National Partner staff
                  only.
                </p>
                <ButtonLink href="/contact" size="lg">Go to Partner Portal</ButtonLink>
                <p className="mt-6 text-sm text-text-secondary">
                  Access issues? Contact{" "}
                  <a
                    href="mailto:info@amsio.org"
                    className="text-navy font-medium hover:text-orange transition-colors"
                  >
                    info@amsio.org
                  </a>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
