import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ButtonLink from "@/components/ui/ButtonLink";
import Flag from "@/components/ui/Flag";
import { COUNTRIES, SUBJECTS, BRAND } from "@/lib/constants";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const country = COUNTRIES.find((c) => c.slug === slug);
  if (!country) return { title: "Country Not Found" };
  return {
    title: `AMSIO ${country.name}`,
    description: `Learn about ${BRAND.name} in ${country.name}. Competition dates, registration, and partner school information.`,
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = COUNTRIES.find((c) => c.slug === slug);
  if (!country) notFound();

  return (
    <>
      <Navbar />
      <main>
        <section className="relative gradient-hero pt-32 pb-20 md:pt-40 md:pb-28">
          {/* Hero background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${BASE}/images/generated/hero/hero-countries.jpg')`, opacity: 0.18 }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Flag code={country.code} alt={country.name} className="w-28 md:w-32 mx-auto mb-6 rounded-md shadow-lg" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-display)] text-white tracking-tight">
              AMSIO {country.name}
            </h1>
            <p className="mt-4 text-lg text-white/70">
              {country.email} &bull; {BRAND.website}
            </p>
          </div>
        </section>

        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <ScrollReveal>
                <div>
                  <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] text-navy mb-6">
                    Competition Schedule
                  </h2>
                  <div className="space-y-4">
                    <div className="bg-bg-subtle rounded-xl p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-navy">Round 1 — State Qualifier</h3>
                          <p className="text-sm text-text-secondary mt-1">
                            Held at partner schools across {country.name}
                          </p>
                        </div>
                        <span className="text-orange font-bold">December 2026</span>
                      </div>
                    </div>
                    <div className="bg-bg-subtle rounded-xl p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-navy">Round 2 — National Finals</h3>
                          <p className="text-sm text-text-secondary mt-1">
                            Top performers advance to the National Finals
                          </p>
                        </div>
                        <span className="text-orange font-bold">March 2027</span>
                      </div>
                    </div>
                    <div className="bg-bg-subtle rounded-xl p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-navy">Global Round</h3>
                          <p className="text-sm text-text-secondary mt-1">
                            Represent {country.name} at the Global Round (United States)
                          </p>
                        </div>
                        <span className="text-gold font-bold">June 2027</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div>
                  <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] text-navy mb-6">
                    Available Subjects
                  </h2>
                  <div className="space-y-3">
                    {SUBJECTS.map((subject) => (
                      <div
                        key={subject.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border/30"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: subject.color }}
                        >
                          {subject.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-navy">{subject.name}</h3>
                          <p className="text-xs text-text-secondary">
                            {subject.divisions} divisions &bull; {subject.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={0.3} className="mt-16 text-center">
              <div className="inline-flex flex-wrap gap-4">
                <ButtonLink href="/for-schools/register" size="lg">Register Your School</ButtonLink>
                <ButtonLink href={`mailto:${country.email}`} variant="secondary" size="lg">
                  Contact AMSIO {country.name}
                </ButtonLink>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
