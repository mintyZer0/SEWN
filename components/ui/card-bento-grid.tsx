import ServiceCard from "@/components/ui/service-card";

type CardBentoGridProps = {
  imgSrc: string;
  service: string;
  href: string;
  colSpan: number;
  id: number;
};

interface CardBentoGridComponentProps {
  header: string;
  items: CardBentoGridProps[];
}

export default function CardBentoGrid({
  items,
  header,
}: CardBentoGridComponentProps) {
  return (
    <>
      <div className="flex mx-8 mt-20 mb-4">
        <h2 className="lg:text-5xl sm:text-4xl text-3xl text-primary">
          {header}
        </h2>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-12 m-20 mx-30">
        {items.map((item) => (
          <ServiceCard
            imgSrc={item.imgSrc}
            service={item.service}
            href={item.href}
            colSpan={item.colSpan}
            key={item.id}
          />
        ))}
      </div>
    </>
  );
}
