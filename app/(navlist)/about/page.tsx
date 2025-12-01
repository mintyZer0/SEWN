import AboutHero from "@/components/sections/about/about-hero";
import LogoSection from "@/components/sections/about/logo-section";
import CulturalSignificance from "@/components/sections/about/cultural-significance";
import VisionMission from "@/components/ui/vision-mission";
import SDGSection from "@/components/sections/about/sdg-section";
import ManagementTeam from "@/components/sections/about/management-team";

export default function About() {
  return (
    <main className="w-full">
      <AboutHero />
      <LogoSection />
      <VisionMission />
      <CulturalSignificance />
      <SDGSection />
      <ManagementTeam />
    </main>
  );
}
