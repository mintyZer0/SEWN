import { getSewerById, sewersData } from "@/data/sewers";
import { notFound } from "next/navigation";
import SewerHeader from "@/components/sewer-profile/sewer-header";
import Services from "@/components/sewer-profile/services";
import Stats from "@/components/sewer-profile/stats";
import Products from "@/components/sewer-profile/products";
import AchievementsServices from "@/components/sewer-profile/achievements-services";
import SeparatorX from "@/components/ui/separator-x";
import Map from "@/components/sewer-profile/map";
import ContactSewer from "@/components/sewer-profile/contact-sewer";
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
      <Services sewerId={sewerId} />
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
      <Map />
      <ContactSewer
        sewerName={sewer.name}
        mobileNumber={sewer.mobileNumber}
        email={sewer.email}
        location={sewer.location}
      ></ContactSewer>
    </div>
  );
}

export function generateStaticParams() {
  return sewersData.map((sewer) => ({
    sewerId: sewer.id,
  }));
}
