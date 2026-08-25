import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { ACHIEVEMENT_TIERS, SHOW_CHINESE } from "@/lib/constants";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Language — AMSIO International",
  description: `Explore the AMSIO Language Olympiad — 6 English divisions, 90-minute assessment of comprehension, reasoning, and communication.`,
};

const LANGUAGE_COLOR = "#7C3AED";

const englishDivisions = [
  { division: "English Division 1", grades: "Grades 1–2", focus: "Foundational reading and vocabulary" },
  { division: "English Division 2", grades: "Grades 3–4", focus: "Comprehension and sentence reasoning" },
  { division: "English Division 3", grades: "Grades 5–6", focus: "Inference and extended comprehension" },
  { division: "English Division 4", grades: "Grades 7–8", focus: "Analytical reading and language structure" },
  { division: "English Division 5", grades: "Grades 9–10", focus: "Critical comprehension and argumentation" },
  { division: "English Division 6", grades: "Grades 11–12", focus: "Advanced literary and language analysis" },
];

const chineseDivisions = [
  { division: "Chinese Division 1", grades: "Grades 1–2", focus: "Character recognition and basic comprehension" },
  { division: "Chinese Division 2", grades: "Grades 3–4", focus: "Reading fluency and cultural context" },
  { division: "Chinese Division 3", grades: "Grades 5–6", focus: "Modern text comprehension" },
  { division: "Chinese Division 4", grades: "Grades 7–8", focus: "Classical and modern text comparison" },
  { division: "Chinese Division 5", grades: "Grades 9–10", focus: "Literary analysis and inference" },
  { division: "Chinese Division 6", grades: "Grades 11–12", focus: "Classical literature and advanced reasoning" },
];

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function LanguagePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, #0F2440 0%, #1B3A5C 60%, ${LANGUAGE_COLOR}33 100%)` }} />
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url('${BASE}/images/generated/subjects/language.jpg')` }}
          />
          <div className="absolute inset-0 bg-navy-dark/60" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div
              className="inline-flex items-center justify-center w-24 h-24 rounded-2xl text-5xl font-bold text-white mb-8 shadow-2xl"
              style={{ backgroundColor: LANGUAGE_COLOR }}
            >
              {SHOW_CHINESE ? "文" : "Aa"}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              Language
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
              {SHOW_CHINESE
                ? "12 divisions across two independent language tracks — English and Chinese. 60–90 minute assessment of comprehension, reasoning, and communication."
                : "6 English divisions. 90-minute assessment of comprehension, reasoning, and communication."}
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                {SHOW_CHINESE ? "12 Divisions" : "6 Divisions"}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                {SHOW_CHINESE ? "60–90 Minutes" : "90 Minutes"}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-semibold text-white border border-white/30 bg-white/10 backdrop-blur-sm">
                {SHOW_CHINESE ? "English + Chinese Tracks" : "English Track"}
              </span>
            </div>
          </div>
        </section>

        {/* At a Glance */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="At a Glance"
              subtitle="Key facts about the AMSIO Language Olympiad."
            />
            <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                SHOW_CHINESE
                  ? { label: "Total Divisions", value: "12", detail: "English Track (6) + Chinese Track (6)" }
                  : { label: "Divisions", value: "6", detail: "English — Grades 1–2 through 11–12" },
                { label: "Assessment Duration", value: "90 min", detail: "Per assessment" },
                SHOW_CHINESE
                  ? { label: "Track Entry", value: "Flexible", detail: "Participants may enter one or both tracks" }
                  : { label: "Competition Type", value: "Individual", detail: "Each participant competes independently" },
              ].map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.1}>
                  <div className="text-center p-8 rounded-2xl border border-border/30 hover:shadow-lg transition-shadow">
                    <div
                      className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-display)] mb-2"
                      style={{ color: LANGUAGE_COLOR }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-navy font-semibold text-lg">{stat.label}</div>
                    <div className="text-text-secondary text-sm mt-1">{stat.detail}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
            {SHOW_CHINESE && (
              <ScrollReveal delay={0.3}>
                <div className="mt-8 max-w-2xl mx-auto text-center p-5 rounded-xl bg-bg-subtle border border-border/30">
                  <p className="text-text-secondary text-sm">
                    <strong className="text-navy">Dual Entry:</strong> Participants may register for one or both language tracks. Each track is assessed and ranked independently.
                  </p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>

        {/* Division Structure — two tracks (hidden when Chinese track is off) */}
        {SHOW_CHINESE && (
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Division Structure"
              subtitle="The English and Chinese tracks are entirely separate competitions. Each has 6 divisions aligned to school grade pairs."
            />
            <div className="grid md:grid-cols-2 gap-8">
              {/* English Track */}
              <ScrollReveal>
                <div className="overflow-hidden rounded-2xl border border-border/30 shadow-sm">
                  <div className="px-6 py-4 text-white font-bold text-lg" style={{ backgroundColor: LANGUAGE_COLOR }}>
                    English Track
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-navy-light">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-navy">Division</th>
                        <th className="px-4 py-3 text-left font-semibold text-navy">Grades</th>
                      </tr>
                    </thead>
                    <tbody>
                      {englishDivisions.map((d, i) => (
                        <tr key={d.division} className={i % 2 === 0 ? "bg-white" : "bg-bg-subtle"}>
                          <td className="px-4 py-3 font-medium text-navy text-xs">{d.division}</td>
                          <td className="px-4 py-3 text-text-secondary text-xs">{d.grades}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollReveal>

              {/* Chinese Track */}
              <ScrollReveal delay={0.1}>
                <div className="overflow-hidden rounded-2xl border border-border/30 shadow-sm">
                  <div className="px-6 py-4 text-white font-bold text-lg" style={{ backgroundColor: LANGUAGE_COLOR }}>
                    Chinese Track
                  </div>
                  <table className="w-full text-sm">
                    <thead className="bg-navy-light">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-navy">Division</th>
                        <th className="px-4 py-3 text-left font-semibold text-navy">Grades</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chineseDivisions.map((d, i) => (
                        <tr key={d.division} className={i % 2 === 0 ? "bg-white" : "bg-bg-subtle"}>
                          <td className="px-4 py-3 font-medium text-navy text-xs">{d.division}</td>
                          <td className="px-4 py-3 text-text-secondary text-xs">{d.grades}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
        )}

        {/* Track Details */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Track Details"
              subtitle="Each language track has its own assessment design, reflecting the different contexts in which participants engage with each language."
            />
            <div className={`grid gap-8 ${SHOW_CHINESE ? "md:grid-cols-2" : "max-w-2xl mx-auto"}`}>
              {/* English Track Detail */}
              <ScrollReveal>
                <div className="h-full p-8 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: LANGUAGE_COLOR }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: LANGUAGE_COLOR }}>
                      En
                    </div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy">English Track</h3>
                  </div>
                  <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
                    <p>
                      The English track assesses language comprehension, reasoning, and communication — skills applicable across all academic disciplines and careers.
                    </p>
                    <div className="space-y-2">
                      {[
                        "Reading comprehension of varied text types",
                        "Language reasoning and logical inference",
                        "Vocabulary in context and word relationships",
                        "Inference from implicit and explicit information",
                        "Understanding of tone, purpose, and audience",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: LANGUAGE_COLOR }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs italic text-text-secondary border-t border-border/30 pt-4">
                      Papers are set in English. No language of instruction requirement — proficiency in English is what is assessed.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Chinese Track Detail — hidden when Chinese track is off */}
              {SHOW_CHINESE && (
              <ScrollReveal delay={0.1}>
                <div className="h-full p-8 rounded-2xl border-2 bg-white shadow-sm" style={{ borderColor: LANGUAGE_COLOR }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: LANGUAGE_COLOR }}>
                      中
                    </div>
                    <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy">Chinese Track</h3>
                  </div>
                  <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
                    <p>
                      The Chinese track is designed for heritage Chinese learners worldwide — students who speak or are learning Chinese as a language of family or heritage, regardless of their country of schooling.
                    </p>
                    <div className="space-y-2">
                      {[
                        "Reading comprehension of modern Chinese texts",
                        "Cultural knowledge and contextual understanding",
                        "Classical and modern text interpretation",
                        "Inference and analytical reading",
                        "Language reasoning in Chinese contexts",
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: LANGUAGE_COLOR }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border/30 pt-4 p-4 rounded-xl bg-bg-subtle">
                      <p className="text-xs italic text-text-secondary">
                        "The Chinese track is designed for heritage Chinese learners worldwide — assessed on comprehension and reasoning, not just writing ability."
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
              )}
            </div>
          </div>
        </section>

        {/* Achievement Tiers */}
        <section className="py-24 gradient-navy">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Achievement Recognition"
              subtitle="Each language track is ranked independently. Participants who enter both tracks receive separate certificates for each."
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
