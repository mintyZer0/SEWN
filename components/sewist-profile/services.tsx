import ServiceCard from "@/components/ui/service-card";
import CardBentoGrid from "@/components/ui/card-bento-grid";

interface ServicesProps {
  sewistId: string;
  servicesOffered: ("repair" | "alteration" | "commission")[];
}

export default function Services({ sewistId, servicesOffered }: ServicesProps) {
  const allCardItems = [
    {
      imgSrc: "/assets/services-bento-bg/bento-shop.jpg",
      service: "Repair",
      type: "repair",
      href: `/sewists/${sewistId}/repair`,
      colSpan: 1,
      id: 1,
      isDisabled: !servicesOffered.includes("repair"),
    },
    {
      imgSrc: "/assets/services-bento-bg/bento-customize-fit.jpg",
      service: "Alteration",
      type: "alteration",
      href: `/sewists/${sewistId}/alteration`,
      colSpan: 1,
      id: 2,
      isDisabled: !servicesOffered.includes("alteration"),
    },
    {
      imgSrc: "/assets/services-bento-bg/bento-commision.jpg",
      service: "Commission",
      type: "commission",
      href: `/sewists/${sewistId}/commission`,
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
