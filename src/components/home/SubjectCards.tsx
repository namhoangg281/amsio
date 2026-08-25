"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SUBJECTS } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useI18n } from "@/lib/i18n/context";

export default function SubjectCards() {
  const { t } = useI18n();

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t.home.subjects.title}
          subtitle={t.home.subjects.subtitle}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUBJECTS.map((subject, i) => (
            <ScrollReveal key={subject.id} delay={i * 0.1}>
              <Link href={`/olympiad/${subject.id}`}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="group relative bg-white rounded-2xl p-8 h-full border border-border/50 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-2xl cursor-pointer overflow-hidden"
                >
                  {/* Top accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                    style={{ backgroundColor: subject.color }}
                  />

                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-6 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: subject.color }}
                  >
                    {subject.icon}
                  </div>

                  <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                    {subject.name}
                  </h3>

                  <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                    {subject.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-border/30">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">{t.home.subjects.divisions}</span>
                      <span className="font-semibold text-navy">{subject.divisions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">{t.home.subjects.duration}</span>
                      <span className="font-semibold text-navy">{subject.duration}</span>
                    </div>
                    <div className="text-xs text-text-secondary mt-2">
                      {subject.divisionLabel}
                    </div>
                  </div>

                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl"
                    style={{ backgroundColor: subject.color }}
                  />
                </motion.div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
