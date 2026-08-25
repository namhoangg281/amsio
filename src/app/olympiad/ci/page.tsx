import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ACHIEVEMENT_TIERS } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Computational Intelligence — AMSIO International",
  description: `Explore the AMSIO Computational Intelligence Olympiad — 3 divisions spanning Grades 3–12, 120-minute assessment of algorithmic thinking, logic, and AI concepts.`,
};

const CI_COLOR = "#E8590C";

const divisions = [
  {
    division: "Division 1",
    eligible: "Grades 3–5",
    focus: "Algorithmic thinking, pattern recognition, logical puzzles",
  },
  {
    division: "Division 2",
    eligible: "Grades 6–9",
    focus: "Data structures, flow logic, computational problem-solving",
  },
  {
    division: "Division 3",
    eligible: "Grades 10–12+",
    focus: "Algorithm design, AI foundations, computational modelling",
  },
];

const topicsByLevel = [
  {
    level: "Grades 3–5",
    label: "Foundation",
    topics: [
      "Algorithmic thinking and step-by-step logic",
      "Pattern recognition and sequence analysis",
      "Boolean logic and truth tables",
      "Basic data structures (lists, grids, trees)",
      "Logic puzzles and constraint satisfaction",
    ],
  },
  {
    level: "Grades 6–9",
    label: "Intermediate",
    topics: [
      "Algorithm design and complexity",
      "Sorting, searching, and graph traversal",
      "Artificial intelligence foundations",
      "Machine learning concepts and decision trees",
      "Data analysis and computational modelling",
    ],
  },
  {
    level: "Grades 10–12+",
    label: "Advanced",
    topics: [
      "Advanced AI and machine learning reasoning",
      "Optimisation algorithms and heuristics",
      "Neural network concepts and applications",
      "Computational complexity and problem classes",
      "Complex systems and emergent behaviour",
    ],
  },
];

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function CIPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #0F2440 0%, #1B3A5C 60%, ${CI_COLOR}33 100%)` }} />
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url('${BASE}/images/generated/subjects/ci.jpg')` }}
          />
          <div className="absolute inset-0 bg-navy-dark/60" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl text-4xl font-bold text-white mb-8 shadow-2xl font-mono"
              style={{ backgroundColor: CI_COLOR }}
            >
              {"{"}
              {"}"}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              Computational Intelligence
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              3 divisions spanning Grades 3 through 12+. 120-minute assessment of
              algorithmic thinking, data reasoning, and AI concepts.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                3 Divisions
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                120 Minutes
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                Algorithmic Thinking
              </span>
            </div>
          </div>
        </section>

        {/* At a Glance */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="At a Glance"
              subtitle="Key facts about the AMSIO Computational Intelligence Olympiad."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { label: "Divisions", value: "3", detail: "Grades 3–5, 6–9, 10–12+" },
                { label: "Duration", value: "120 min", detail: "Per assessment" },
                { label: "Disciplines", value: "AI · Logic", detail: "Algorithms, data reasoning, AI concepts" },
                { label: "Competition Type", value: "Individual", detail: "Each participant competes independently" },
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.1}>
                  <div className="text-center p-6 rounded-2xl border border-border/30 hover:shadow-lg transition-shadow">
                    <div
                      className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] mb-2"
                      style={{ color: CI_COLOR }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-navy font-semibold">{stat.label}</div>
                    <div className="text-text-secondary text-xs mt-1">{stat.detail}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Unique CI Feature — cross-level */}
        <section className="py-16 bg-bg-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="rounded-2xl border-2 p-8 md:p-10 bg-white shadow-sm" style={{ borderColor: CI_COLOR }}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                    style={{ backgroundColor: CI_COLOR }}
                  >
                    ↑
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                      Cross-Level Participation — CI Only
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      Computational Intelligence is the <strong className="text-navy">only AMSIO subject</strong> where participants may compete in any higher division than their enrolled grade. A Grade 7 student may choose to enter Division 3 (Grades 10–12+) if they have the skills and wish to challenge themselves at the highest level.
                    </p>
                    <p className="text-text-secondary leading-relaxed mt-3">
                      This rule reflects the nature of computational thinking — a discipline where individual ability and self-study often advance students well beyond their year group. Upward entry only; participants cannot enter a lower division than their grade.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Division Structure */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Division Structure"
              subtitle="Three divisions spanning Grades 3 through 12+. Each is independently assessed and ranked."
            />
            <ScrollReveal>
              <div className="overflow-hidden rounded-2xl border border-border/30 shadow-sm max-w-4xl mx-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: CI_COLOR }} className="text-white">
                      <th className="px-6 py-4 text-left font-semibold">Division</th>
                      <th className="px-6 py-4 text-left font-semibold">Standard Eligible Grades</th>
                      <th className="px-6 py-4 text-left font-semibold">Focus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {divisions.map((d, i) => (
                      <tr key={d.division} className={i % 2 === 0 ? "bg-white" : "bg-bg-subtle"}>
                        <td className="px-6 py-3 font-medium text-navy">{d.division}</td>
                        <td className="px-6 py-3 text-text-primary">{d.eligible}</td>
                        <td className="px-6 py-3 text-text-secondary text-xs">{d.focus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* No Programming Language — ẩn theo yêu cầu (mục 16). Đổi false → true để hiện lại. */}
        {false && (
        <section className="py-16 bg-bg-subtle">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="rounded-2xl border border-border/30 bg-white p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">💡</div>
                  <div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                      No Programming Language Required
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      AMSIO CI problems are entirely language-agnostic. Participants are never asked to write code in a specific syntax. Instead, they reason about algorithms, analyse data patterns, evaluate logical structures, and apply computational thinking principles.
                    </p>
                    <p className="text-text-secondary leading-relaxed mt-3">
                      This ensures the assessment measures <strong className="text-navy">computational intelligence</strong> — the ability to think algorithmically — not familiarity with a particular programming environment. A student who has never written a line of Python can compete on equal terms with someone who has.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        )}

        {/* Topics by Level — ẩn theo yêu cầu (mục 18). Đổi false → true để hiện lại. */}
        {false && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Topics by Level"
              subtitle="Indicative content areas. Questions test computational reasoning and problem-solving, not technical recall."
            />
            <div className="grid md:grid-cols-3 gap-8">
              {topicsByLevel.map((level, i) => (
                <ScrollReveal key={level.label} delay={i * 0.1}>
                  <div className="bg-bg-subtle rounded-2xl p-8 shadow-sm border border-border/20 h-full">
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-bold mb-2"
                      style={{ backgroundColor: CI_COLOR }}
                    >
                      {level.label}
                    </div>
                    <div className="text-text-secondary text-sm font-medium mb-4">{level.level}</div>
                    <ul className="space-y-3">
                      {level.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span
                            className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: CI_COLOR }}
                          >
                            ✓
                          </span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        )}

        {/* Achievement Tiers */}
        <section className="py-24 gradient-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Achievement Recognition"
              subtitle="Every participant receives an official certificate. Achievement tiers reflect performance within each CI division."
              light
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {ACHIEVEMENT_TIERS.map((tier, i) => (
                <ScrollReveal key={tier.name} delay={i * 0.1}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-sm">
                    <div
                      className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: tier.color }}
                    >
                      {i === 0 ? "G" : i === 1 ? "S" : i === 2 ? "B" : "C"}
                    </div>
                    <h3 className="text-white font-bold">{tier.name}</h3>
                    <p className="text-white/60 text-sm mt-1">{tier.percentage}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.4} className="text-center">
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/olympiad/rounds"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-orange text-white font-semibold hover:bg-orange/90 transition-colors shadow-lg"
                >
                  Competition Rounds
                </Link>
                <Link
                  href="/for-schools/register"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 border border-white/30 text-white font-semibold hover:bg-white/20 transition-colors"
                >
                  Register Now
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
