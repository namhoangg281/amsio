"use client";

import { motion } from "framer-motion";
import { ROUNDS } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useI18n } from "@/lib/i18n/context";

export default function CompetitionTimeline() {
  const { t } = useI18n();

  return (
    <section className="py-24 md:py-32 bg-bg-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t.home.timeline.title}
          subtitle={t.home.timeline.subtitle}
        />

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-navy/20 via-orange to-gold -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ROUNDS.map((round, i) => (
              <ScrollReveal key={round.id} delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/30"
                >
                  {/* Step number */}
                  <div className="absolute -top-4 left-8 w-8 h-8 rounded-full gradient-navy flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {i + 1}
                  </div>

                  <div className="text-4xl mb-4 mt-2">{round.icon}</div>

                  <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy mb-1">
                    {round.name}
                  </h3>
                  <p className="text-sm font-medium text-orange mb-3">
                    {round.subtitle}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">
                    {round.description}
                  </p>

                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-navy-light text-navy text-xs font-medium">
                    {round.date}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
