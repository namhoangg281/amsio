import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BRAND } from "@/lib/constants";
import { fetchPublicCollectionItems } from "@/lib/cms/queries";
import { FALLBACK_MISSION_BLOCKS } from "@/lib/cms/fallback-collections";
import type { CollectionItem } from "@/lib/cms/types";
import type { Metadata } from "next";
import Link from "next/link";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export const metadata: Metadata = {
  title: "Mission & Philosophy — AMSIO International",
  description: `${BRAND.philosophy} Learn about the mission and philosophy driving AMSIO International — a fair, rigorous, and globally accessible academic olympiad.`,
};

const pillars = [
  {
    icon: "🏅",
    title: "Excellence",
    description:
      "We hold every examination, process, and partnership to the highest standard. Excellence is not an outcome we reward — it is the standard we set for ourselves in everything we build.",
  },
  {
    icon: "🛡️",
    title: "Integrity",
    description:
      "Rigorous examination security, independent development by subject specialists, sealed distribution protocols, and a transparent multi-stage appeals process protect the value of every result.",
  },
  {
    icon: "💡",
    title: "Innovation",
    description:
      "Every assessment question is designed to reveal how a student reasons through a problem — not whether they have memorised a formula or fact. Contextual, novel scenarios replace drill-based recall.",
  },
  {
    icon: "🌍",
    title: "Global Collaboration",
    description:
      "A single international standard applies across 20+ member countries. Every participant is assessed on the same terms, regardless of national curriculum, school resources, or geography.",
  },
  {
    icon: "📚",
    title: "Educational Impact",
    description:
      "Beyond competition, AMSIO nurtures a generation of global citizens — students who think critically, collaborate across cultures, and carry internationally recognised credentials into their futures.",
  },
];

const whyWeExist = [
  {
    problem: "Most olympiads test memory.",
    solution: "AMSIO tests reasoning.",
    detail:
      "Traditional competitions reward students who have memorised the most facts or practised the most past papers. AMSIO questions are designed so that memorisation alone cannot produce a top score — only genuine analytical thinking can.",
  },
  {
    problem: "Most competitions are national.",
    solution: "AMSIO is truly global.",
    detail:
      "Regional olympiads produce regional results. AMSIO establishes one common standard across 20+ countries, allowing authentic cross-border comparison and creating an international credential that universities and employers recognise.",
  },
  {
    problem: "Most give one binary result.",
    solution: "AMSIO gives nuanced recognition.",
    detail:
      "A single pass/fail or rank number fails to capture the breadth of a student's achievement. Three award tiers (Gold, Silver, Bronze) plus a Certificate of Participation ensure the top 60% of participants receive formal recognition.",
  },
];

const comparisonRows = [
  {
    aspect: "Assessment type",
    traditional: "Recall-based, past-paper driven",
    amsio: "Reasoning-based, novel contextual problems",
  },
  {
    aspect: "Geographic scope",
    traditional: "Single country or region",
    amsio: "20+ member countries, one international standard",
  },
  {
    aspect: "Recognition structure",
    traditional: "Top 3–10 receive prizes",
    amsio: "Three awards: Gold (10%), Silver (30%), Bronze (60%) + Certificate",
  },
  {
    aspect: "Curriculum alignment",
    traditional: "Tied to national syllabus",
    amsio: "Curriculum-neutral international benchmark",
  },
  {
    aspect: "Subjects covered",
    traditional: "Single subject per competition",
    amsio: "4 subject groups: Mathematics, Science, Language, CI",
  },
  {
    aspect: "Feedback depth",
    traditional: "Score and rank only",
    amsio: "Achievement tier, subject certificate, international ranking",
  },
];

export default async function MissionPage() {
  // W-094: DB-first with frozen fallback — never throws (fallback = production snapshot)
  const dbMission = await fetchPublicCollectionItems('mission_blocks').catch(() => [] as CollectionItem[]);
  const missionItems: readonly CollectionItem[] = dbMission.length > 0 ? dbMission : FALLBACK_MISSION_BLOCKS;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden gradient-hero">
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${BASE}/images/generated/hero/hero-mission.jpg')`, opacity: 0.18 }}
          />
          <div className="absolute inset-0 opacity-0" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 70%, #E8A817 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E8590C 0%, transparent 50%)",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm font-medium mb-6">
                About AMSIO International
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
                Mission &amp; Philosophy
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                Our mission:{" "}
                <span className="text-gold font-semibold italic font-[family-name:var(--font-tagline)]">
                  Empowering Global Education Leaders.
                </span>
              </p>
              <p className="mt-4 text-base text-white/50 max-w-2xl mx-auto">
                Everything we build flows from a single design conviction: measure thinking, not memory.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Core Mission Statement */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <p className="text-xs font-bold tracking-widest uppercase text-orange mb-6">
                Core Mission
              </p>
              <blockquote className="text-2xl md:text-3xl lg:text-4xl font-bold font-[family-name:var(--font-display)] text-navy leading-tight">
                &ldquo;To provide a fair, rigorous, and globally accessible platform where young minds can demonstrate genuine intellectual ability across Mathematics, Science, Language, and Computational Intelligence.&rdquo;
              </blockquote>
              <div className="mt-10 w-16 h-1 bg-gold mx-auto rounded-full" />
            </ScrollReveal>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Vision & Mission"
              subtitle="The direction that guides everything we do."
            />
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <ScrollReveal>
                <div className="h-full p-8 rounded-2xl bg-white border border-border/30 shadow-sm">
                  <div className="text-4xl mb-4">🔭</div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy mb-3">Vision</h3>
                  <p className="text-text-secondary leading-relaxed">
                    To become the world&rsquo;s leading ecosystem for the assessment of academic ability and intelligence.
                  </p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <div className="h-full p-8 rounded-2xl bg-white border border-border/30 shadow-sm">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-display)] text-navy mb-3">Mission</h3>
                  <p className="text-text-secondary leading-relaxed">
                    To nurture a generation of global citizens through modern, fair, and accessible academic competitions.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Why We Exist */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Why We Exist"
              subtitle="Academic competition at the international level needed reinventing. We built AMSIO International to fill the gaps."
            />
            <div className="grid md:grid-cols-3 gap-8 mt-4">
              {whyWeExist.map((item, i) => (
                <ScrollReveal key={item.problem} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-8 border border-border/30 h-full flex flex-col">
                    <div className="mb-5">
                      <p className="text-sm font-semibold text-text-secondary line-through decoration-orange/60">
                        {item.problem}
                      </p>
                      <p className="text-lg font-bold font-[family-name:var(--font-display)] text-navy mt-2">
                        {item.solution}
                      </p>
                    </div>
                    <p className="text-text-secondary leading-relaxed flex-1">{item.detail}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 4 Pillars */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Four Pillars"
              subtitle="Every decision AMSIO International makes is tested against these four principles."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
              {missionItems.map((item, i) => (
                <ScrollReveal key={item.id} delay={i * 0.1}>
                  <div className="text-center p-8 rounded-2xl border border-border/30 hover:border-navy/20 hover:shadow-lg transition-all duration-300 h-full flex flex-col items-center">
                    <div className="text-5xl mb-5">{item.metadata.icon ?? ''}</div>
                    <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-navy mb-3">
                      {item.translations.en?.title ?? ''}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.translations.en?.body ?? ''}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Academic Sponsorship Partner — đẩy lên sau Four Pillars (mục 10) */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Academic Sponsorship Partner"
              subtitle="Academic leadership ensuring the highest standards of assessment quality and educational excellence."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mt-12">
              <ScrollReveal>
                <div className="h-full bg-white rounded-2xl p-8 border border-border/30 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange mb-1">Academic Sponsorship Partner</p>
                  <h3 className="font-bold text-navy text-xl font-[family-name:var(--font-display)] mb-4">ABC Education Group</h3>
                  <ul className="space-y-3">
                    {[
                      "ABC Education Group serves as the Academic Sponsorship Partner — including its affiliated entities and brands such as Polaris Global Academy — providing academic leadership and ensuring the highest standards of assessment quality and educational excellence.",
                      "As the Academic Sponsorship Partner, ABC Education Group oversees the development, review, and validation of examination papers and assessment frameworks.",
                      "The competition is conducted under the academic guidance of ABC Education Group, ensuring fairness, rigor, and alignment with international educational standards.",
                      "Through its role as Academic Sponsorship Partner, ABC Education Group strengthens the credibility, integrity, and educational impact of the competition organized by AMSIO International.",
                    ].map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
                        <span className="text-orange mt-1 shrink-0">&bull;</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <div className="h-full bg-white rounded-2xl p-8 border border-border/30 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange mb-1">Assessment Unit</p>
                  <h3 className="font-bold text-navy text-xl font-[family-name:var(--font-display)] mb-4">Polaris Global Academy</h3>
                  <ul className="space-y-3">
                    {[
                      "Polaris Global Academy contributes its expertise in Advanced Placement (AP) education and American High School Diploma programs to ensure high-quality academic standards.",
                      "Drawing on internationally recognized educational practices, Polaris Global Academy supports the development and validation of assessment frameworks, examination content, and evaluation criteria.",
                      "Polaris Global Academy provides academic guidance on assessment design and quality assurance, leveraging its experience in U.S. secondary and pre-university education pathways.",
                      "Through its role as Assessment Unit, Polaris Global Academy strengthens the credibility, rigor, and educational impact of the competition while fostering excellence among participants.",
                    ].map((b, i) => (
                      <li key={i} className="flex gap-2 text-sm text-text-secondary leading-relaxed">
                        <span className="text-orange mt-1 shrink-0">&bull;</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Philosophy Deep Dive */}
        <section className="py-24 bg-navy-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal direction="left">
                <p className="text-xs font-bold tracking-widest uppercase text-gold mb-4">
                  Philosophy Deep Dive
                </p>
                <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-display)] leading-tight mb-6">
                  &ldquo;Measure Thinking, Not Memory.&rdquo;
                </h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  This is more than a tagline. It is the design brief for every examination question in every Subject Group. Here is how we operationalise it.
                </p>
                <div className="space-y-5">
                  {[
                    {
                      label: "Novel scenario design",
                      text: "Questions present unfamiliar contexts so that a student who has seen the question before holds no advantage over one encountering it fresh.",
                    },
                    {
                      label: "Contextual problem framing",
                      text: "Problems are embedded in real-world or cross-disciplinary scenarios that require students to extract, synthesise, and apply — not merely recall.",
                    },
                    {
                      label: "Anti-rote construction",
                      text: "Item writers are explicitly instructed to reject any question that can be answered correctly through memorisation alone, regardless of difficulty.",
                    },
                    {
                      label: "Multi-step reasoning",
                      text: "High-scoring questions require chains of logical inference, ensuring that even well-prepared students must think rather than retrieve.",
                    },
                  ].map((point) => (
                    <div key={point.label} className="flex gap-4">
                      <div className="w-2 h-2 rounded-full bg-gold mt-2 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-white">{point.label}:</span>{" "}
                        <span className="text-white/70">{point.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right" delay={0.2}>
                <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center">
                  <div className="text-7xl font-bold font-[family-name:var(--font-display)] text-gold mb-2">60%</div>
                  <p className="text-white/70 text-sm mb-8">of all participants receive Gold, Silver, or Bronze</p>
                  <div className="space-y-3">
                    {[
                      { tier: "Gold", pct: "Top 10%", color: "bg-gold" },
                      { tier: "Silver", pct: "Next 20%", color: "bg-gray-300" },
                      { tier: "Bronze", pct: "Next 30%", color: "bg-amber-700" },
                      { tier: "Certificate", pct: "All participants", color: "bg-navy" },
                    ].map((t) => (
                      <div key={t.tier} className="flex items-center gap-4 bg-white/5 rounded-xl px-5 py-3">
                        <div className={`w-3 h-3 rounded-full ${t.color} flex-shrink-0`} />
                        <span className="flex-1 text-left font-semibold text-white">{t.tier}</span>
                        <span className="text-white/50 text-sm">{t.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="The AMSIO Difference"
              subtitle="How AMSIO International compares to traditional olympiad models."
            />
            <ScrollReveal>
              <div className="overflow-hidden rounded-2xl border border-border/40 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="gradient-navy text-white">
                      <th className="px-6 py-4 text-left font-semibold font-[family-name:var(--font-display)]">Aspect</th>
                      <th className="px-6 py-4 text-left font-semibold font-[family-name:var(--font-display)]">Traditional Olympiad</th>
                      <th className="px-6 py-4 text-left font-semibold font-[family-name:var(--font-display)]">
                        <span className="text-gold">AMSIO International</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr
                        key={row.aspect}
                        className={i % 2 === 0 ? "bg-white" : "bg-bg-subtle"}
                      >
                        <td className="px-6 py-4 font-semibold text-navy">{row.aspect}</td>
                        <td className="px-6 py-4 text-text-secondary">{row.traditional}</td>
                        <td className="px-6 py-4 text-navy font-medium">{row.amsio}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 gradient-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionHeading
              title="Ready to Participate?"
              subtitle="Discover the subjects, rounds, and how your country can get involved."
              light
            />
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link
                href="/olympiad"
                className="px-8 py-4 rounded-full bg-orange text-white font-semibold hover:bg-orange/90 transition-colors shadow-lg hover:shadow-xl"
              >
                Explore the Olympiad
              </Link>
              <Link
                href="/countries"
                className="px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Member Countries
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
