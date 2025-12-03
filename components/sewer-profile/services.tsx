import ServiceCard from "@/components/ui/service-card";
import CardBentoGrid from "@/components/ui/card-bento-grid";
export default function Browse() {
  const cardItems = [
    {
      imgSrc: "/assets/services-bento-bg/bento-shop.jpg",
      service: "Repair",
      href: "",
      colSpan: 1,
      id: 1,
    },
    {
      imgSrc: "/assets/services-bento-bg/bento-customize-fit.jpg",
      service: "Alteration",
      href: "",
      colSpan: 1,
      id: 2,
    },
    {
      imgSrc: "/assets/services-bento-bg/bento-commision.jpg",
      service: "Commision",
      href: "",
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
