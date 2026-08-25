import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ACHIEVEMENT_TIERS } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Science — AMSIO International",
  description: `Explore the AMSIO Science Olympiad — 6 divisions spanning Grades 1–12, 60-minute integrated assessment across Physics, Chemistry, Biology, and Earth Science.`,
};

const SCIENCE_COLOR = "#059669";

const divisions = [
  { division: "Division 1", grades: "Grades 1–2", focus: "Foundational science curiosity and observation" },
  { division: "Division 2", grades: "Grades 3–4", focus: "Scientific method and basic concepts" },
  { division: "Division 3", grades: "Grades 5–6", focus: "Cross-disciplinary integration begins" },
  { division: "Division 4", grades: "Grades 7–8", focus: "Core physics, chemistry, biology" },
  { division: "Division 5", grades: "Grades 9–10", focus: "Advanced reasoning and experimental analysis" },
  { division: "Division 6", grades: "Grades 11–12", focus: "Upper secondary integrated science" },
];

const topicsByLevel = [
  {
    level: "Primary",
    grades: "Grades 1–6",
    topics: [
      "Properties and states of matter",
      "Living things and life processes",
      "Forces, motion, and energy (basic)",
      "Earth, weather, and environment",
      "Scientific observation and measurement",
    ],
  },
  {
    level: "Lower Secondary",
    grades: "Grades 7–9",
    topics: [
      "Atomic structure and chemical bonding",
      "Cell biology and genetics foundations",
      "Mechanics and energy transfer",
      "Earth systems and climate science",
      "Experimental design and data analysis",
    ],
  },
  {
    level: "Upper Secondary",
    grades: "Grades 10–12",
    topics: [
      "Thermodynamics and electromagnetism",
      "Organic chemistry and reactions",
      "Ecology, evolution, and molecular biology",
      "Geophysics and environmental science",
      "Quantitative analysis and scientific reasoning",
    ],
  },
];

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function SciencePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #0F2440 0%, #1B3A5C 60%, ${SCIENCE_COLOR}33 100%)` }} />
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url('${BASE}/images/generated/subjects/science.jpg')` }}
          />
          <div className="absolute inset-0 bg-navy-dark/60" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl text-5xl font-bold text-white mb-8 shadow-2xl"
              style={{ backgroundColor: SCIENCE_COLOR }}
            >
              ⚛
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              Science
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              6 divisions spanning all school grades. 60-minute integrated
              assessment across Physics, Chemistry, Biology, and Earth Science.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                6 Divisions
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                60 Minutes
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                Paired Grade Groups
              </span>
            </div>
          </div>
        </section>

        {/* At a Glance */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="At a Glance"
              subtitle="Key facts about the AMSIO Science Olympiad."
            />
            <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { label: "Divisions", value: "6", detail: "Paired grade groups, Grades 1–12" },
                { label: "Assessment Duration", value: "60 min", detail: "Per assessment" },
                { label: "Disciplines", value: "4", detail: "Physics, Chemistry, Biology, Earth Science" },
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.1}>
                  <div className="text-center p-8 rounded-2xl border border-border/30 hover:shadow-lg transition-shadow">
                    <div
                      className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-2"
                      style={{ color: SCIENCE_COLOR }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-navy font-semibold text-lg">{stat.label}</div>
                    <div className="text-text-secondary text-sm mt-1">{stat.detail}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Division Structure */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Division Structure"
              subtitle="Science divisions pair adjacent grades, reflecting the natural progression of scientific understanding across school years."
            />
            <ScrollReveal>
              <div className="overflow-hidden rounded-2xl border border-border/30 shadow-sm max-w-3xl mx-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: SCIENCE_COLOR }} className="text-white">
                      <th className="px-6 py-4 text-left font-semibold">Division</th>
                      <th className="px-6 py-4 text-left font-semibold">Eligible Grades</th>
                      <th className="px-6 py-4 text-left font-semibold">Focus Area</th>
                    </tr>
                  </thead>
                  <tbody>
                    {divisions.map((d, i) => (
                      <tr key={d.division} className={i % 2 === 0 ? "bg-white" : "bg-bg-subtle"}>
                        <td className="px-6 py-3 font-medium text-navy">{d.division}</td>
                        <td className="px-6 py-3 text-text-primary">{d.grades}</td>
                        <td className="px-6 py-3 text-text-secondary">{d.focus}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Assessment Philosophy */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <SectionHeading title="Assessment Philosophy" align="left" />
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    The AMSIO Science assessment is built around <strong className="text-navy">cross-disciplinary reasoning</strong>. Real science rarely respects subject boundaries — and neither do AMSIO questions.
                  </p>
                  <p>
                    A single Science question may require knowledge of both physics and chemistry, or connect biological processes to earth science phenomena. Participants who excel are those who understand science as a unified way of thinking, not a collection of separate fact sets.
                  </p>
                  <p>
                    Experimental thinking is central: students must evaluate evidence, identify variables, apply the scientific method, and reason from data — not simply recall definitions or formulae.
                  </p>
                </div>
                <div className="mt-6 p-5 rounded-xl border-l-4 bg-bg-subtle" style={{ borderColor: SCIENCE_COLOR }}>
                  <p className="text-sm text-text-secondary italic">
                    "Science questions integrate multiple disciplines — a single question may require knowledge of both physics and chemistry."
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="space-y-4">
                  {[
                    { icon: "🔬", title: "Cross-Disciplinary Integration", desc: "Questions deliberately cross subject boundaries. Understanding connections between disciplines is rewarded." },
                    { icon: "🧪", title: "Experimental Thinking", desc: "Participants analyse experimental scenarios, identify controls, interpret results, and draw evidence-based conclusions." },
                    { icon: "🌍", title: "Real-World Contexts", desc: "Science problems are grounded in real phenomena — from climate systems to cellular processes to material properties." },
                    { icon: "📊", title: "Data Interpretation", desc: "Reading graphs, tables, and diagrams is integral to the assessment. Scientific literacy includes quantitative reasoning." },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 p-5 rounded-xl border border-border/30 bg-bg-subtle">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <div className="font-semibold text-navy">{item.title}</div>
                        <div className="text-sm text-text-secondary mt-1">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Topics by Level — ẩn theo yêu cầu (mục 12). Đổi false → true để hiện lại. */}
        {false && (
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Topics by Level"
              subtitle="Indicative content areas across all four science disciplines. Questions test understanding and application, not content recall."
            />
            <div className="grid md:grid-cols-3 gap-8">
              {topicsByLevel.map((level, i) => (
                <ScrollReveal key={level.level} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/20 h-full">
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-bold mb-4"
                      style={{ backgroundColor: SCIENCE_COLOR }}
                    >
                      {level.level}
                    </div>
                    <div className="text-text-secondary text-sm font-medium mb-4">{level.grades}</div>
                    <ul className="space-y-3">
                      {level.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: SCIENCE_COLOR }}>
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
              subtitle="Every participant receives an official certificate. Achievement tiers reflect performance within each Science division."
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
                      {i === 0 ? "D" : i === 1 ? "HM" : i === 2 ? "M" : "P+"}
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
