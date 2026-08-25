import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ACHIEVEMENT_TIERS, BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mathematics — AMSIO International",
  description: `Explore the AMSIO Mathematics Olympiad — 12 grade divisions, 90-minute individual assessment. Questions test reasoning, not memorisation.`,
};

const MATH_COLOR = "#2563EB";

const divisions = [
  { grade: "Grade 1", division: "Division 1" },
  { grade: "Grade 2", division: "Division 2" },
  { grade: "Grade 3", division: "Division 3" },
  { grade: "Grade 4", division: "Division 4" },
  { grade: "Grade 5", division: "Division 5" },
  { grade: "Grade 6", division: "Division 6" },
  { grade: "Grade 7", division: "Division 7" },
  { grade: "Grade 8", division: "Division 8" },
  { grade: "Grade 9", division: "Division 9" },
  { grade: "Grade 10", division: "Division 10" },
  { grade: "Grade 11", division: "Division 11" },
  { grade: "Grade 12", division: "Division 12" },
];

const topicsByLevel = [
  {
    level: "Primary",
    grades: "Grades 1–6",
    topics: [
      "Number sense and place value",
      "Arithmetic patterns and sequences",
      "Basic geometry and spatial reasoning",
      "Logical reasoning and deduction",
      "Measurement and data interpretation",
    ],
  },
  {
    level: "Lower Secondary",
    grades: "Grades 7–9",
    topics: [
      "Algebra and linear equations",
      "Plane and coordinate geometry",
      "Probability and statistics",
      "Combinatorics and counting",
      "Number theory fundamentals",
    ],
  },
  {
    level: "Upper Secondary",
    grades: "Grades 10–12",
    topics: [
      "Advanced algebra and functions",
      "Number theory and divisibility",
      "Coordinate and analytic geometry",
      "Statistics and data analysis",
      "Proof-based and competition mathematics",
    ],
  },
];

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function MathematicsPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #0F2440 0%, #1B3A5C 60%, ${MATH_COLOR}33 100%)` }} />
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url('${BASE}/images/generated/subjects/math.jpg')` }}
          />
          <div className="absolute inset-0 bg-navy-dark/60" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl text-5xl font-bold text-white mb-8 shadow-2xl"
              style={{ backgroundColor: MATH_COLOR }}
            >
              ∑
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              Mathematics
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              12 grade divisions. Individual competition. Questions
              designed to reveal how students think — not what they have memorised.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                12 Grade-Level Divisions
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                60–90 Minutes
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                Individual Competition
              </span>
            </div>
          </div>
        </section>

        {/* At a Glance */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="At a Glance"
              subtitle="Key facts about the AMSIO Mathematics Olympiad."
            />
            <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { label: "Grade-Level Divisions", value: "12", detail: "One per grade, Grades 1–12" },
                { label: "Assessment Duration", value: "60–90 min", detail: "Varies by grade level" },
                { label: "Competition Type", value: "Individual", detail: "Each participant competes independently" },
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.1}>
                  <div className="text-center p-8 rounded-2xl border border-border/30 hover:shadow-lg transition-shadow">
                    <div
                      className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-2"
                      style={{ color: MATH_COLOR }}
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

        {/* Division Structure — ẩn theo yêu cầu (mục 5). Đổi false → true để hiện lại. */}
        {false && (
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Division Structure"
              subtitle="Each of the 12 grades competes independently. Participants are assessed against peers at the same grade level — ensuring fair and meaningful comparison."
            />
            <ScrollReveal>
              <div className="overflow-hidden rounded-2xl border border-border/30 shadow-sm max-w-3xl mx-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: MATH_COLOR }} className="text-white">
                      <th className="px-6 py-4 text-left font-semibold">Division</th>
                      <th className="px-6 py-4 text-left font-semibold">Eligible Grade</th>
                      <th className="px-6 py-4 text-left font-semibold">Competition Format</th>
                    </tr>
                  </thead>
                  <tbody>
                    {divisions.map((d, i) => (
                      <tr key={d.grade} className={i % 2 === 0 ? "bg-white" : "bg-bg-subtle"}>
                        <td className="px-6 py-3 font-medium text-navy">{d.division}</td>
                        <td className="px-6 py-3 text-text-primary">{d.grade}</td>
                        <td className="px-6 py-3 text-text-secondary">Individual assessment</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </div>
        </section>
        )}

        {/* Assessment Philosophy */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <SectionHeading title="Assessment Philosophy" align="left" />
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    The AMSIO Mathematics assessment is built on a core principle: <strong className="text-navy">measure thinking, not memory</strong>. Questions are designed to reveal how a student approaches an unfamiliar problem — not whether they have memorised a specific formula or procedure.
                  </p>
                  <p>
                    Every question demands genuine mathematical reasoning. Multi-step problems, novel contexts, and logical deduction are central to the assessment design. Drill-and-practice preparation alone will not produce strong results.
                  </p>
                  <p>
                    Students who succeed at AMSIO Mathematics demonstrate the ability to connect concepts, reason under uncertainty, and construct sound mathematical arguments — skills that matter far beyond examinations.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="space-y-4">
                  {[
                    { icon: "🔍", title: "Novel Scenarios", desc: "Questions place mathematical principles in unfamiliar real-world contexts. Students cannot rely on pattern-matching alone." },
                    { icon: "🔗", title: "Multi-Step Reasoning", desc: "Problems require chaining logical steps together — each dependent on the last. There are no single-operation shortcuts." },
                    { icon: "🧩", title: "Conceptual Depth", desc: "Rather than testing procedure execution, questions test whether students understand why a method works — not just how." },
                    { icon: "⚖️", title: "Logical Deduction", desc: "Students must identify what can and cannot be concluded from given information — a skill central to mathematical maturity." },
                  ].map((item, i) => (
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

        {/* Topics by Level — ẩn theo yêu cầu (mục 6). Đổi false → true để hiện lại. */}
        {false && (
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Topics by Level"
              subtitle="Indicative content areas. Not a syllabus — questions test understanding, not coverage."
            />
            <div className="grid md:grid-cols-3 gap-8">
              {topicsByLevel.map((level, i) => (
                <ScrollReveal key={level.level} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/20 h-full">
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-bold mb-4"
                      style={{ backgroundColor: MATH_COLOR }}
                    >
                      {level.level}
                    </div>
                    <div className="text-text-secondary text-sm font-medium mb-4">{level.grades}</div>
                    <ul className="space-y-3">
                      {level.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-2 text-sm text-text-secondary">
                          <span className="mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: MATH_COLOR }}>
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

        {/* Question Style — ẩn theo yêu cầu (mục 7). Đổi false → true để hiện lại. */}
        {false && (
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Question Style"
              subtitle="What to expect — and how to prepare."
            />
            <ScrollReveal>
              <div className="bg-bg-subtle rounded-2xl p-8 md:p-12 border border-border/30">
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: MATH_COLOR }}
                  >
                    Q
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy">Unfamiliar Scenarios, Familiar Principles</h3>
                    <p className="text-text-secondary mt-2 leading-relaxed">
                      Questions present real-world or abstract contexts that students are unlikely to have encountered before. The mathematical principles needed to solve them are grade-appropriate — but the application is always novel.
                    </p>
                  </div>
                </div>
                <div className="pl-14 space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    <strong className="text-navy">Example approach:</strong> A multi-step word problem might describe a scenario involving rates, ratios, and logical constraints simultaneously. Students must identify which information is relevant, construct a solution pathway, and verify their reasoning — not apply a memorised procedure.
                  </p>
                  <p>
                    The best preparation for AMSIO Mathematics is developing strong mathematical reasoning habits: reading problems carefully, working systematically, and checking conclusions against the original conditions.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        )}

        {/* Achievement Tiers */}
        <section className="py-24 gradient-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Achievement Recognition"
              subtitle="Every participant receives an official certificate. Achievement tiers reflect performance within each grade division."
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
