"use client";

import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { useI18n } from "@/lib/i18n";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Footer() {
  const { t } = useI18n();

  const footerLinks = [
    {
      title: t.footer.sections.about,
      links: [
        { label: t.footer.links.mission, href: "/about/mission" },
        { label: t.footer.links.governance, href: "/about/governance" },
        { label: t.footer.links.team, href: "/about/team" },
        { label: t.footer.links.press, href: "/press" },
      ],
    },
    {
      title: t.footer.sections.olympiad,
      links: [
        { label: t.footer.links.mathematics, href: "/olympiad/mathematics" },
        { label: t.footer.links.science, href: "/olympiad/science" },
        { label: t.footer.links.language, href: "/olympiad/language" },
        { label: t.footer.links.ci, href: "/olympiad/ci" },
        // Sample Papers ẩn theo yêu cầu (mục 23)
      ],
    },
    {
      title: t.footer.sections.countries,
      links: [
        { label: t.footer.links.allCountries, href: "/countries" },
        { label: t.footer.links.comingSoon, href: "/countries#coming-soon" },
        { label: t.footer.links.becomePartner, href: "/countries/become-partner" },
      ],
    },
    {
      title: t.footer.sections.resources,
      links: [
        { label: t.footer.links.results, href: "/results" },
        { label: t.footer.links.forSchools, href: "/for-schools" },
        { label: t.footer.links.forParents, href: "/for-parents" },
        { label: t.footer.links.forPartners, href: "/for-partners" },
      ],
    },
  ];
  return (
    <footer className="gradient-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-12 mb-12">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-block mb-4 hover:opacity-90 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${BASE}/images/logo/Amsio_app_icon(_square_with_rounded_corners).png`}
                alt="AMSIO International"
                className="w-16 h-16 object-contain"
              />
            </Link>
            <p className="text-sm text-white/60 mb-2 leading-relaxed">
              {BRAND.fullName}
            </p>
            <a
              href={`https://${BRAND.website}`}
              className="text-xs text-white/40 hover:text-white/60 transition-colors block mb-2"
            >
              {BRAND.website}
            </a>
            <p className="text-xs text-white/50 mb-2">{BRAND.email}</p>
            <div className="flex items-center gap-3">
              {Object.entries(BRAND.social).filter(([name]) => name === "facebook" || name === "linkedin").map(([name, url]) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/40 hover:text-white/60 transition-colors capitalize"
                >
                  {name === "linkedin" ? "LinkedIn" : name}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns — evenly distributed */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerLinks.map(({ title, links }) => (
              <div key={title}>
                <h3 className="font-semibold text-sm uppercase tracking-wider text-white/40 mb-4">
                  {title}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Offices row */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pb-6 text-xs text-white/40">
          <span className="font-semibold uppercase tracking-widest text-white/25 text-[10px]">{t.footer.offices}</span>
          <span>Boston, MA 02115 — USA</span>
          <span>London WC2A — UK</span>
          <span>Warsaw — Poland</span>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/10">
          <p className="text-xs text-white/40 mb-2 md:mb-0">
            &copy; 2018–{new Date().getFullYear()} {BRAND.name}. {t.footer.rights}
          </p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <Link href="/privacy" className="hover:text-white/70 transition-colors">
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition-colors">
              {t.footer.terms}
            </Link>
            <Link href="/contact" className="hover:text-white/70 transition-colors">
              {t.footer.contact}
            </Link>
          </div>
        </div>

        {/* Academic Partner + Philosophy tagline — ẩn theo yêu cầu (mục 18) */}
      </div>
    </footer>
  );
}
