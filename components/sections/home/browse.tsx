import ServiceCard from "@/components/ui/service-card";
import CardBentoGrid from "@/components/ui/card-bento-grid";
export default function Browse() {
  const cardItems = [
    {
      imgSrc: "/assets/services-bento-bg/bento-shop.jpg",
      service: "Products",
      href: "/browse/shop",
      colSpan: 2,
      id: 1,
    },
    {
      imgSrc: "/assets/services-bento-bg/bento-commision.jpg",
      service: "Sewers",
      href: "/browse/sewists",
      colSpan: 2,
      id: 2,
    },
  ];
  return <CardBentoGrid items={cardItems} header="browse" />;
}
