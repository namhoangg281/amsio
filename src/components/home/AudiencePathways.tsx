"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { GraduationCap, Users, School } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { useI18n } from "@/lib/i18n/context";

export default function AudiencePathways() {
  const { t } = useI18n();

  const pathways = [
    {
      icon: GraduationCap,
      title: t.home.pathways.students.title,
      subtitle: t.home.pathways.students.subtitle,
      description: t.home.pathways.students.description,
      href: "/olympiad",
      cta: t.home.pathways.students.cta,
      color: "#2563EB",
      gradient: "from-blue-500/10 to-blue-600/5",
    },
    {
      icon: Users,
      title: t.home.pathways.parents.title,
      subtitle: t.home.pathways.parents.subtitle,
      description: t.home.pathways.parents.description,
      href: "/for-parents",
      cta: t.home.pathways.parents.cta,
      color: "#7C3AED",
      gradient: "from-purple-500/10 to-purple-600/5",
    },
    {
      icon: School,
      title: t.home.pathways.schools.title,
      subtitle: t.home.pathways.schools.subtitle,
      description: t.home.pathways.schools.description,
      href: "/for-schools",
      cta: t.home.pathways.schools.cta,
      color: "#059669",
      gradient: "from-green-500/10 to-green-600/5",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={t.home.pathways.title}
          subtitle={t.home.pathways.subtitle}
        />

        <div className="grid md:grid-cols-3 gap-8">
          {pathways.map((path, i) => {
            const Icon = path.icon;
            return (
              <ScrollReveal key={path.title} delay={i * 0.1} className="h-full">
                <Link href={path.href} className="h-full block">
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`group relative bg-gradient-to-br ${path.gradient} rounded-2xl p-8 h-full border border-border/30 hover:border-transparent transition-all duration-300 hover:shadow-2xl cursor-pointer overflow-hidden`}
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${path.color}15` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: path.color }} />
                    </div>

                    <h3 className="text-2xl font-bold font-[family-name:var(--font-display)] text-navy mb-1">
                      {path.title}
                    </h3>
                    <p className="text-sm font-medium mb-4" style={{ color: path.color }}>
                      {path.subtitle}
                    </p>
                    <p className="text-text-secondary leading-relaxed mb-6">
                      {path.description}
                    </p>

                    <span
                      className="inline-flex items-center text-sm font-semibold transition-colors"
                      style={{ color: path.color }}
                    >
                      {path.cta}
                      <svg
                        className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>

                    {/* Hover gradient border effect */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 0 2px ${path.color}40`,
                      }}
                    />
                  </motion.div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
