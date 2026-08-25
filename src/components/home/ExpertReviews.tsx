"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { EXPERTS } from "@/lib/constants";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function ExpertReviews() {
  return (
    <section className="py-24 md:py-32 bg-bg-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Expert Reviews & Assessments"
          subtitle="Independent educators and academic leaders who review and validate AMSIO's assessment standards."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {EXPERTS.map((expert, i) => (
            <ScrollReveal key={expert.name} delay={(i % 3) * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative h-full bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-border/40 flex flex-col"
              >
                {/* Lead accent for the first expert */}
                {i === 0 && (
                  <span className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-widest text-gold">
                    Lead Reviewer
                  </span>
                )}

                <Quote className="w-7 h-7 text-gold/40 mb-3 shrink-0" />

                <p className="text-sm text-text-secondary leading-relaxed flex-1">
                  {expert.quote}
                </p>

                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border/30">
                  {/* Avatar: real photo if the file exists; otherwise an empty
                      placeholder (drop a file at expert.photo to fill it later). */}
                  <div className="relative w-12 h-12 shrink-0">
                    <div className="absolute inset-0 rounded-full bg-slate-100 border border-slate-200" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`${BASE}${expert.photo}`}
                      alt={expert.name}
                      className="absolute inset-0 w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-navy text-sm leading-tight">{expert.name}</p>
                    <p className="text-xs text-text-secondary leading-snug mt-0.5">{expert.role}</p>
                    <span
                      className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${expert.color}1a`, color: expert.color }}
                    >
                      {expert.domain}
                    </span>
                  </div>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
