"use client";

import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { useI18n } from "@/lib/i18n/context";

export default function StatsCounter() {
  const { t } = useI18n();

  const stats = [
    { end: 20, suffix: "+", label: t.home.stats.countries, icon: "🌍" },
    { end: 4, suffix: "", label: t.home.stats.subjects, icon: "📚" },
    { end: 500, suffix: "+", label: t.home.stats.partnerSchools, icon: "🏫" },
    { end: 29, suffix: "", label: t.home.stats.gradeDivisions, icon: "🏆" },
    { end: 50000, suffix: "+", label: t.home.stats.participants, icon: "👨‍🎓" },
    { end: 4, suffix: "", label: t.home.stats.grandFinalsCities, icon: "✈️" },
  ];

  return (
    <section className="relative py-20 gradient-navy overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-6">
          {stats.map((stat, i) => (
            <AnimatedCounter
              key={stat.label}
              end={stat.end}
              suffix={stat.suffix}
              label={stat.label}
              icon={stat.icon}
              duration={2 + i * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
