import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import StatsCounter from "@/components/home/StatsCounter";
import SubjectCards from "@/components/home/SubjectCards";
// import CountriesGlobe from "@/components/home/CountriesGlobe"; // hidden — "A Truly Global Olympiad / National Partners"
import CompetitionTimeline from "@/components/home/CompetitionTimeline";
import GrandFinalsShowcase from "@/components/home/GrandFinalsShowcase";
import AudiencePathways from "@/components/home/AudiencePathways";
import PartnersSection from "@/components/home/PartnersSection";
// import CTABanner from "@/components/home/CTABanner"; // hidden — section "Learn More"
import { fetchPublicCollectionItems } from "@/lib/cms/queries";
import { FALLBACK_PARTNERS } from "@/lib/cms/fallback-collections";

export default async function HomePage() {
  // W-094: DB-first partners with frozen fallback — never throws, page never voids
  const dbPartners = await fetchPublicCollectionItems('partners').catch(() => []);
  const partnerItems = dbPartners.length > 0 ? dbPartners : FALLBACK_PARTNERS;

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsCounter />
        <SubjectCards />
        {/* <CountriesGlobe /> — hidden per requirement (item 8) */}
        <CompetitionTimeline />
        <GrandFinalsShowcase />
        <AudiencePathways />
        <PartnersSection partners={partnerItems} />
        {/* <CTABanner /> — hidden per requirement (item 16) */}
      </main>
      <Footer />
    </>
  );
}
