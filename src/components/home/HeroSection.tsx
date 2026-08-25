"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ButtonLink from "@/components/ui/ButtonLink";
import ParticleField from "@/components/shared/ParticleField";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function HeroSection() {
  const { t } = useI18n();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero">
      <ParticleField />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 items-center">
          {/* Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Link
                href="/olympiad/rounds"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 text-gold border border-gold/30 mb-6 hover:bg-white/20 hover:border-gold/60 transition-colors"
              >
                {t.home.hero.badge}
                <span aria-hidden>→</span>
              </Link>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-display)] text-white leading-[1.1] tracking-tight"
            >
              {t.home.hero.title}{" "}
              <span className="text-gradient">{t.home.hero.titleHighlight}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-6 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed"
            >
              {t.home.hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <ButtonLink href="/olympiad" size="lg">{t.home.hero.cta1}</ButtonLink>
              <ButtonLink href="/contact" variant="outline" size="lg">{t.nav.register}</ButtonLink>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="mt-12 flex items-center gap-6 text-sm text-white/50"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sci-green" />
                {t.home.hero.stat1}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-math-blue" />
                {t.home.hero.stat2}
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold" />
                {t.home.hero.stat3}
              </span>
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hidden lg:flex justify-center items-center"
          >
            <div className="relative w-full max-w-[560px]">
              {/* Outer glow ring */}
              <div className="absolute -inset-8 bg-gradient-to-br from-gold/30 via-orange/20 to-transparent rounded-full blur-3xl" />
              {/* Inner ring accent */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-gold/20 to-orange/10 blur-sm" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/hero/hero-globe-c.jpg`}
                alt="AMSIO International — Students competing globally"
                width={560}
                height={560}
                className="relative w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="flex flex-col items-center gap-2 text-white/40"
        >
          <span className="text-xs uppercase tracking-widest">{t.home.hero.scrollText}</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
