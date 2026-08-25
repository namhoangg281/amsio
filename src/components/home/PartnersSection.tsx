"use client";

import { ABC_PARTNER } from "@/lib/constants";
import type { CollectionItem } from "@/lib/cms/types";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

const PARTNERS = [
  {
    key: "abc",
    name: ABC_PARTNER.name,
    role: "Academic Sponsorship Partner",
    description: "Providing academic leadership and ensuring the highest standards of assessment quality and educational excellence across all Subject Groups.",
    logo: `${BASE}/images/logo/abc-logo-horizontal.png`,
    logoAlt: "ABC Education Group",
    website: "https://www.abceducationgroup.com/",
    logoClass: "h-10 w-auto",
  },
  {
    key: "polaris",
    name: "Polaris Global Academy",
    role: "Assessment Unit",
    description: "Supporting the development and validation of assessment frameworks, examination content, and evaluation criteria, drawing on AP and U.S. high-school expertise.",
    logo: `${BASE}/images/logo/polaris-logo.png`,
    logoAlt: "Polaris Global Academy",
    website: "https://www.polarisglobalacademy.com/",
    logoClass: "h-10 w-auto",
  },
];

interface PartnersSectionProps {
  /** W-094: DB-sourced partners from Server Component. Falls back to PARTNERS constant when omitted. */
  partners?: readonly CollectionItem[];
}

export default function PartnersSection({ partners }: PartnersSectionProps) {
  // Normalise DB items or fall through to hardcoded PARTNERS constant
  const cards = partners && partners.length > 0
    ? partners.map((item) => ({
        key: item.id,
        name: item.translations.en?.name ?? '',
        role: item.metadata.role ?? '',
        description: item.translations.en?.body ?? '',
        logo: item.metadata.logo_url ?? '',
        logoAlt: item.translations.en?.name ?? '',
        logoClass: 'h-10 w-auto',
        website: item.metadata.website_url ?? '#',
      }))
    : PARTNERS;

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange mb-3">
            Trusted Partners
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy font-[family-name:var(--font-display)] tracking-tight">
            Academic &amp; Strategic Partners
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto text-base leading-relaxed">
            AMSIO International collaborates with leading educational organisations worldwide to ensure rigorous standards and broad access.
          </p>
        </div>

        {/* Partner cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {cards.map((p) => (
            <a
              key={p.key}
              href={p.website}
              target={p.website !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 p-8 flex flex-col gap-4"
            >
              {/* Logo */}
              <div className="h-12 flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.logo}
                  alt={p.logoAlt}
                  className={`${p.logoClass} object-contain`}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              {/* Info */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange mb-1">
                  {p.role}
                </p>
                <h3 className="font-bold text-navy text-lg leading-snug mb-2 font-[family-name:var(--font-display)]">
                  {p.name}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Become a partner CTA */}
        <div className="text-center mt-12">
          <a
            href="/countries/become-partner"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy/60 hover:text-navy transition-colors"
          >
            Interested in becoming a partner?
            <span className="text-orange">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
