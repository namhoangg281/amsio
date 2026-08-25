"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Award, BarChart3, Globe, Users, Shield, BookOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function ForSchoolsContent() {
  const { t } = useI18n();

  const benefits = [
    {
      icon: Globe,
      title: t.forSchools.benefit1.title,
      description: t.forSchools.benefit1.description,
    },
    {
      icon: Award,
      title: t.forSchools.benefit2.title,
      description: t.forSchools.benefit2.description,
    },
    {
      icon: BarChart3,
      title: t.forSchools.benefit3.title,
      description: t.forSchools.benefit3.description,
    },
    {
      icon: Users,
      title: t.forSchools.benefit4.title,
      description: t.forSchools.benefit4.description,
    },
    {
      icon: Shield,
      title: t.forSchools.benefit5.title,
      description: t.forSchools.benefit5.description,
    },
    {
      icon: BookOpen,
      title: t.forSchools.benefit6.title,
      description: t.forSchools.benefit6.description,
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        <section className="relative gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${BASE}/images/generated/hero/hero-schools.jpg')`, opacity: 0.18 }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 text-gold border border-gold/30 mb-6">
                {t.pages.forSchools.badge}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
                {t.pages.forSchools.title}
              </h1>
              <p className="mt-6 text-lg text-white/70 max-w-2xl">
                {t.forSchools.hero.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/for-schools/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full bg-orange text-white hover:bg-orange/90 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  {t.pages.forSchools.cta1}
                </Link>
                <Link
                  href="/for-schools/register#fees"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-full border-2 border-white text-white hover:bg-white hover:text-navy transition-all duration-300"
                >
                  {t.pages.forSchools.cta2}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.pages.forSchools.benefitsTitle}
              subtitle={t.pages.forSchools.benefitsSubtitle}
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <ScrollReveal key={benefit.title} delay={i * 0.1} className="h-full">
                    <div className="p-8 rounded-2xl border border-border/30 hover:shadow-lg transition-shadow h-full">
                      <div className="w-12 h-12 rounded-xl bg-navy-light flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-navy" />
                      </div>
                      <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t.pages.forSchools.howTitle}
              subtitle={t.forSchools.howItWorks.subtitle}
            />

            {[
              { step: 1, title: t.forSchools.howItWorks.step1.title, desc: t.forSchools.howItWorks.step1.desc },
              { step: 2, title: t.forSchools.howItWorks.step2.title, desc: t.forSchools.howItWorks.step2.desc },
              { step: 3, title: t.forSchools.howItWorks.step3.title, desc: t.forSchools.howItWorks.step3.desc },
              { step: 4, title: t.forSchools.howItWorks.step4.title, desc: t.forSchools.howItWorks.step4.desc },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.1}>
                <div className="flex gap-6 mb-8">
                  <div className="w-12 h-12 rounded-full gradient-navy flex items-center justify-center text-white font-bold flex-shrink-0 text-lg">
                    {item.step}
                  </div>
                  <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-border/20">
                    <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section className="py-24 gradient-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionHeading
              title={t.forSchools.cta.title}
              subtitle={t.forSchools.cta.subtitle}
              light
            />
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/for-schools/register">
                <Button size="lg">{t.pages.forSchools.registerCta}</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  {t.common.contactUs}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
