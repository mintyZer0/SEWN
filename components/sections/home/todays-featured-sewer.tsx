import FeaturedSewer from "@/components/ui/featured-sewer";

export default function TodaysFeaturedSewer() {
  const featuredSewer = {
    sewerName: "Aling Maria",
    description:
      "a skilled local sewer known for her precise stitching, creative designs, and warm service. With years of experience, she brings every fabric to life, offering quality craftsmanship that the community trusts.",
    rating: 4.9,
    imageSrc: "/assets/placeholder-600x400.svg",
    href: "/sewers/aling-maria",
  };

  return (
    <div className="flex h-auto lg:h-96 flex-col lg:flex-row w-full bg-secondary-gradient-b p-6 lg:p-9 justify-between overflow-hidden">

      <div className="flex w-full lg:w-150 justify-center lg:justify-start text-center lg:text-left">
        <h2 className="text-5xl md:text-7xl lg:text-8xl p-3 text-heading font-light">
          Today's <br className="hidden lg:block"/> Featured <br className="hidden lg:block"/> Sewer
        </h2>
      </div>
      
      <div className="h-1 w-full lg:h-full lg:w-1 my-6 lg:my-0 lg:mx-4 bg-primary rounded-full"></div>
      
      <div className="flex-1 flex justify-center lg:justify-end w-full">
        <FeaturedSewer
          sewerName={featuredSewer.sewerName}
          description={featuredSewer.description}
          rating={featuredSewer.rating}
          imageSrc={featuredSewer.imageSrc}
          href={featuredSewer.href}
        />
      </div>
    </div>
  );
}