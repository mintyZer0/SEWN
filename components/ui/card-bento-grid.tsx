import ServiceCard from "@/components/ui/service-card";

type CardBentoGridProps = {
  imgSrc: string;
  service: string;
  href: string;
  colSpan: number;
  id: number;
  isDisabled?: boolean;
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
      <div className="flex mx-4 sm:mx-8 mt-8 sm:mt-16 mb-4">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl text-heading">
          {header}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-3 sm:gap-6 md:gap-12 my-6 sm:my-12 mx-4 sm:mx-8 md:mx-30">
        {items.map((item) => (
          <ServiceCard
            imgSrc={item.imgSrc}
            service={item.service}
            href={item.href}
            colSpan={item.colSpan}
            isDisabled={item.isDisabled}
            key={item.id}
          />
        ))}
      </div>
    </>
  );
}
