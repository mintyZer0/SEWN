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
      href: `/sewers/${sewerId}/repair`,
      colSpan: 1,
      id: 1,
      isDisabled: !servicesOffered.includes("repair"),
    },
    {
      imgSrc: "/assets/services-bento-bg/bento-customize-fit.jpg",
      service: "Alteration",
      type: "alteration",
      href: `/sewers/${sewerId}/alteration`,
      colSpan: 1,
      id: 2,
      isDisabled: !servicesOffered.includes("alteration"),
    },
    {
      imgSrc: "/assets/services-bento-bg/bento-commision.jpg",
      service: "Commision",
      type: "commission",
      href: `/sewers/${sewerId}/commission`,
      colSpan: 2,
      id: 3,
      isDisabled: !servicesOffered.includes("commission"),
    },
  ];

  if (servicesOffered.length === 0) return null;

  return (
    <>
      <CardBentoGrid items={allCardItems} header="Pick a service" />
    </>
  );
}
