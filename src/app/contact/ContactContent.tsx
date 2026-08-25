"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { BRAND, COUNTRIES } from "@/lib/constants";
import Flag from "@/components/ui/Flag";
import { Mail, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export default function ContactContent() {
  const { t } = useI18n();

  return (
    <>
      <Navbar />
      <main>
        <section className="gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              {t.pages.contact.title}
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
              {t.pages.contact.subtitle}
            </p>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-navy mb-6">
                  {t.pages.contact.sendMessage}
                </h2>
                <form className="space-y-6" action="#">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        {t.pages.contact.firstName}
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors"
                        placeholder={t.pages.contact.firstNamePlaceholder}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy mb-2">
                        {t.pages.contact.lastName}
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors"
                        placeholder={t.pages.contact.lastNamePlaceholder}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      {t.pages.contact.email}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      {t.pages.contact.iAmA}
                    </label>
                    <select className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors bg-white">
                      <option>{t.pages.contact.roleParent}</option>
                      <option>{t.pages.contact.roleSchoolAdmin}</option>
                      <option>{t.pages.contact.roleStudent}</option>
                      <option>{t.pages.contact.rolePotentialPartner}</option>
                      <option>{t.pages.contact.roleMedia}</option>
                      <option>{t.pages.contact.roleOther}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-navy mb-2">
                      {t.pages.contact.message}
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-orange/50 focus:border-orange transition-colors resize-none"
                      placeholder={t.pages.contact.messagePlaceholder}
                    />
                  </div>
                  <Button size="lg" type="submit">
                    {t.pages.contact.send}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-display)] text-navy mb-6">
                  {t.pages.contact.hq}
                </h2>
                <div className="space-y-6 mb-12">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-navy-light flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-navy">{t.pages.contact.email}</p>
                      <a href={`mailto:${BRAND.email}`} className="text-orange hover:underline">
                        {BRAND.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-navy-light flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-navy">{t.pages.contact.websiteLabel}</p>
                      <span className="text-text-secondary">{BRAND.website}</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-navy mb-4">
                  {t.pages.contact.nationalPartnerContacts}
                </h3>
                <div className="space-y-3">
                  {COUNTRIES.slice(0, 6).map((country) => (
                    <div
                      key={country.slug}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-subtle"
                    >
                      <Flag code={country.code} alt={country.name} className="w-6 rounded-sm shadow-sm" />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-navy">
                          AMSIO {country.name}
                        </span>
                      </div>
                      <a
                        href={`mailto:${country.email}`}
                        className="text-xs text-orange hover:underline"
                      >
                        {country.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
