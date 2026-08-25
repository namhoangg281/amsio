import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import Flag from "@/components/ui/Flag";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { BRAND, COUNTRIES, SUBJECTS, ABC_PARTNER } from "@/lib/constants";
import { fetchPublicCollectionItems } from "@/lib/cms/queries";
import { FALLBACK_TEAM } from "@/lib/cms/fallback-collections";
import type { CollectionItem } from "@/lib/cms/types";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Executive Team — AMSIO International",
  description: `Meet the secretariat, council representatives, and subject committee chairs behind ${BRAND.name} — the global academic olympiad governing body.`,
};

const secretariatRoles = [
  {
    title: "Secretary-General",
    description:
      "Leads AMSIO International, represents the organisation internationally, and is ultimately responsible for delivery of the Council's strategic mandate.",
    email: "info@amsio.org",
  },
  {
    title: "Director of Examinations",
    description:
      "Oversees the four Subject Committees, manages the examination development pipeline, and is responsible for academic quality across all Subject Groups.",
    email: "info@amsio.org",
  },
  {
    title: "Director of Operations",
    description:
      "Manages relationships with National Partners, coordinates round logistics, and leads planning for the annual Grand Finals.",
    email: "info@amsio.org",
  },
  {
    title: "Director of Finance",
    description:
      "Responsible for financial planning, budget oversight, fee allocation, and preparation of the annual financial summary presented to the Council.",
    email: "info@amsio.org",
  },
  {
    title: "Director of Communications",
    description:
      "Leads all external communications, media relations, digital presence, and brand standards across member countries.",
    email: "info@amsio.org",
  },
];

export default async function TeamPage() {
  // W-094: DB-first with frozen fallback — never throws (fallback = production snapshot)
  const dbTeam = await fetchPublicCollectionItems('team').catch(() => [] as CollectionItem[]);
  const teamItems: readonly CollectionItem[] = dbTeam.length > 0 ? dbTeam : FALLBACK_TEAM;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden gradient-hero">
          <div className="absolute inset-0 opacity-0" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 60% 20%, #E8A817 0%, transparent 50%), radial-gradient(circle at 10% 80%, #E8590C 0%, transparent 50%)",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/70 text-sm font-medium mb-6">
                About AMSIO International
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
                Executive Team
              </h1>
              <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                AMSIO International is governed by representatives from all 12 member countries, supported by a dedicated secretariat and specialist subject committees.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Governance Note */}
        <section className="py-12 bg-gold/10 border-b border-gold/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex gap-4 items-start">
                <div className="text-2xl flex-shrink-0">🏛️</div>
                <p className="text-text-secondary leading-relaxed">
                  <span className="font-semibold text-navy">Governance model:</span>{" "}
                  AMSIO International is governed by its International Council, composed of one representative from each of the 12 National Partner countries. The secretariat manages day-to-day operations under Council direction. Team member profiles are updated as appointments are confirmed.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Secretariat */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Secretariat"
              subtitle="The operational leadership team responsible for day-to-day management of AMSIO International."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {teamItems.map((item, i) => {
                const title = item.translations.en?.title ?? '';
                const body = item.translations.en?.body ?? '';
                const email = item.metadata.email ?? 'info@amsio.org';
                return (
                  <ScrollReveal key={item.id} delay={i * 0.1}>
                    <div className="bg-bg-subtle rounded-2xl p-8 border border-border/30 h-full flex flex-col hover:border-navy/20 hover:shadow-md transition-all duration-300">
                      <div className="w-12 h-12 rounded-xl gradient-navy flex items-center justify-center text-white text-lg font-bold font-[family-name:var(--font-display)] mb-5 flex-shrink-0">
                        {title.charAt(0)}
                      </div>
                      <h3 className="text-lg font-bold font-[family-name:var(--font-display)] text-navy mb-2">
                        {title}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-5">
                        {body}
                      </p>
                      <a
                        href={`mailto:${email}`}
                        className="text-sm text-orange hover:text-orange/80 font-medium transition-colors"
                      >
                        {email}
                      </a>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Council Representatives */}
        <section className="py-24 bg-bg-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Council Representatives"
              subtitle="One representative per National Partner country. All 12 member countries hold equal voting rights in the AMSIO International Council."
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
              {COUNTRIES.map((country, i) => (
                <ScrollReveal key={country.slug} delay={(i % 6) * 0.06}>
                  <div className="bg-white rounded-2xl p-5 border border-border/30 text-center hover:border-navy/20 hover:shadow-md transition-all duration-300 h-full flex flex-col items-center">
                    <Flag code={country.code} alt={country.name} className="w-11 mb-3 rounded-sm shadow-sm" />
                    <h3 className="font-bold font-[family-name:var(--font-display)] text-navy text-sm leading-tight mb-1">
                      {country.name}
                    </h3>
                    <p className="text-xs text-text-secondary">National Partner Representative</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Subject Committee Chairs */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title="Subject Committee Chairs"
              subtitle="Each of the four Subject Groups is led by an independent Subject Committee responsible for examination quality and academic standards."
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              {SUBJECTS.map((subject, i) => (
                <ScrollReveal key={subject.id} delay={i * 0.1}>
                  <div className="bg-bg-subtle rounded-2xl p-8 border border-border/30 text-center h-full flex flex-col items-center hover:border-navy/20 hover:shadow-md transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl gradient-navy flex items-center justify-center text-white text-2xl font-bold font-[family-name:var(--font-display)] mb-5">
                      {subject.icon}
                    </div>
                    <h3 className="font-bold font-[family-name:var(--font-display)] text-navy text-base mb-1">
                      {subject.name}
                    </h3>
                    <p className="text-orange text-sm font-semibold mb-3">Subject Committee Chair</p>
                    <p className="text-text-secondary text-xs leading-relaxed flex-1">
                      Leads the {subject.name} Subject Committee. Responsible for examination design, item moderation, and academic quality across {subject.divisions} division{subject.divisions > 1 ? "s" : ""}.
                    </p>
                    <div className="mt-5 px-4 py-2 rounded-full bg-white border border-border/40 text-xs text-text-secondary">
                      Appointment pending
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Academic Sponsorship Partner */}
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
                  <div className="flex flex-wrap gap-6 mt-6 text-sm text-text-secondary">
                    <div>
                      <span className="font-semibold text-navy">Headquarters</span>
                      <p>{ABC_PARTNER.headquarters}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-navy">Established</span>
                      <p>{ABC_PARTNER.established}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-navy">Presence</span>
                      <p>{ABC_PARTNER.countries}+ countries</p>
                    </div>
                  </div>
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

        {/* Pending appointments note */}
        <section className="py-12 bg-white border-t border-border/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="flex gap-4 items-start bg-bg-subtle rounded-xl p-6 border border-border/30">
                <div className="text-xl flex-shrink-0">ℹ️</div>
                <p className="text-text-secondary text-sm leading-relaxed">
                  <span className="font-semibold text-navy">Team member profiles are updated as appointments are confirmed.</span>{" "}
                  AMSIO International launched its inaugural international cycle in 2026, building on a competition program established since 2018. Secretariat appointments and Subject Committee compositions will be published as they are formally confirmed by the Council. For enquiries, contact{" "}
                  <a href="mailto:info@amsio.org" className="text-orange hover:underline">
                    info@amsio.org
                  </a>
                  .
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 gradient-navy">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <SectionHeading
              title="Get Involved"
              subtitle="Whether you represent a school, a country, or an academic institution — we would like to hear from you."
              light
            />
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link
                href="/about/governance"
                className="px-8 py-4 rounded-full bg-orange text-white font-semibold hover:bg-orange/90 transition-colors shadow-lg"
              >
                Governance Structure
              </Link>
              <Link
                href="/for-schools"
                className="px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors"
              >
                For Schools
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
