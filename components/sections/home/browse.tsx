import ServiceCard from "@/components/ui/service-card";
export default function Browse() {
  const cardItems = [
    {
      imgSrc: "/assets/services-bento-bg/bento-shop.jpg",
      service: "Shop",
      href: "",
      span: "col-span-2",
      id: 1,
    },
    {
      imgSrc: "/assets/services-bento-bg/bento-commision.jpg",
      service: "Commision a Sewer",
      href: "",
      span: "col-span-2",
      id: 2,
    },
  ];
  return (
    <>
      <div className="flex mx-8 mt-20 mb-4">
        <h2 className="lg:text-5xl sm:text-4xl text-3xl text-primary">
          browse
        </h2>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-12 m-20 mx-30">
        {cardItems.map((items) => (
          <ServiceCard
            imgSrc={items.imgSrc}
            service={items.service}
            href={items.href}
            span={items.span}
            key={items.id}
          />
        ))}
      </div>
    </>
  );
}
