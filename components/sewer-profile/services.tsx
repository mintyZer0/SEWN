import ServiceCard from "@/components/ui/service-card";
import CardBentoGrid from "@/components/ui/card-bento-grid";

interface ServicesProps {
  sewerId: string;
}

export default function Services({ sewerId }: ServicesProps) {
  const cardItems = [
    {
      imgSrc: "/assets/services-bento-bg/bento-shop.jpg",
      service: "Repair",
      href: `/sewer-profiles/${sewerId}/repair`,
      colSpan: 1,
      id: 1,
    },
    {
      imgSrc: "/assets/services-bento-bg/bento-customize-fit.jpg",
      service: "Alteration",
      href: `/sewer-profiles/${sewerId}/alteration`,
      colSpan: 1,
      id: 2,
    },
    {
      imgSrc: "/assets/services-bento-bg/bento-commision.jpg",
      service: "Commision",
      href: `/sewer-profiles/${sewerId}/commission`,
      colSpan: 2,
      id: 3,
    },
  ];
  return (
    <>
      <CardBentoGrid items={cardItems} header="browse" />
    </>
  );
}
