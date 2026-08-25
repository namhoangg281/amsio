"use client";

import Image from "next/image";
import { BRAND, SHOW_STUDENT_REGISTRATION } from "@/lib/constants";
import ButtonLink from "@/components/ui/ButtonLink";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useI18n } from "@/lib/i18n/context";

export default function CTABanner() {
  const { t } = useI18n();

  return (
    <section className="relative py-24 md:py-32 gradient-navy overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal>
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-display)] text-white leading-tight">
                {t.home.cta.title}
                <br />
                <span className="text-gradient">{t.home.cta.titleHighlight}</span>
              </h2>
              <p className="mt-6 text-lg text-white/70 max-w-lg leading-relaxed">
                {t.home.cta.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                {SHOW_STUDENT_REGISTRATION && (
                  <ButtonLink href="/for-schools/register" size="lg">{t.home.cta.cta1}</ButtonLink>
                )}
                <ButtonLink href="/countries/become-partner" variant="outline" size="lg">
                  {t.home.cta.cta2}
                </ButtonLink>
              </div>

              <p className="mt-12 text-sm italic text-white/30 font-[family-name:var(--font-tagline)]">
                &ldquo;{BRAND.philosophy}&rdquo;
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2} className="hidden lg:flex justify-center">
            <Image
              src="/images/mascot/amsifox.png"
              alt="AMSIFOX"
              width={350}
              height={418}
              className="animate-float drop-shadow-2xl"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
