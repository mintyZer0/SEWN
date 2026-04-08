import ServiceCard from "@/components/ui/service-card";
import CardBentoGrid from "@/components/ui/card-bento-grid";

interface ServicesProps {
  sewerId: string;
  servicesOffered: ("repair" | "alteration" | "commission")[];
}

export default function Services({ sewerId, servicesOffered }: ServicesProps) {
  const allCardItems = [
    {
      imgSrc: "/assets/services-bento-bg/bento-shop.jpg",
      service: "Repair",
      type: "repair",
      href: `/sewer-profiles/${sewerId}/repair`,
      colSpan: 1,
      id: 1,
    },
    {
      imgSrc: "/assets/services-bento-bg/bento-customize-fit.jpg",
      service: "Alteration",
      type: "alteration",
      href: `/sewer-profiles/${sewerId}/alteration`,
      colSpan: 1,
      id: 2,
    },
    {
      imgSrc: "/assets/services-bento-bg/bento-commision.jpg",
      service: "Commision",
      type: "commission",
      href: `/sewer-profiles/${sewerId}/commission`,
      colSpan: 2,
      id: 3,
    },
  ];

  const filteredItems = allCardItems.filter(item => 
    servicesOffered.includes(item.type as any)
  );

  // If only 1 item, make it full width (colSpan 2)
  if (filteredItems.length === 1) {
    filteredItems[0].colSpan = 2;
  }

  if (filteredItems.length === 0) return null;

  return (
    <>
      <CardBentoGrid items={filteredItems} header="browse" />
    </>
  );
}
