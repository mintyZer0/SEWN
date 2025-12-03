import { getSewerById, sewersData } from "@/data/sewers";
import { notFound } from "next/navigation";
import SewerHeader from "@/components/seller/profile/sewer-header";
import Services from "@/components/seller/profile/services";
import Stats from "@/components/seller/profile/stats";
import Products from "@/components/seller/profile/products";
import AchievementsServices from "@/components/seller/profile/achievements-services";
import SeparatorX from "@/components/ui/separator-x";
interface PageProps {
  params: {
    sewerId: string;
  };
}

export default async function SewerPage({ params }: PageProps) {
  const { sewerId } = await params;
  const sewer = getSewerById(sewerId);

  if (!sewer) {
    console.log(sewer);
    return notFound();
  }

  return (
    <div className="py-12">
      <SewerHeader
        name={sewer.name}
        image={sewer.image}
        bio={sewer.bio}
        rating={sewer.rating}
        location={sewer.location}
      />
      <Services />
      <Stats
        yearsOfExperience={sewer.yearsOfExperience}
        rating={sewer.rating}
        productsSewed={sewer.productsSewed}
      />
      <Products />
      <SeparatorX />
      <AchievementsServices
        achievements={sewer.achievements}
        tesdaCertified={sewer.tesdaCertified}
        servicesOffered={sewer.servicesOffered}
      />
    </div>
  );
}

export function generateStaticParams() {
  return sewersData.map((sewer) => ({
    sewerId: sewer.id,
  }));
}
