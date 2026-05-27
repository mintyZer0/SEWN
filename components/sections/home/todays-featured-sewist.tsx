import FeaturedSewist from "@/components/ui/featured-sewist";

export default function TodaysFeaturedSewist() {
  const featuredSewist = {
    sewistName: "Aling Maria",
    description:
      "a skilled local sewist known for her precise stitching, creative designs, and warm service. With years of experience, she brings every fabric to life, offering quality craftsmanship that the community trusts.",
    rating: 4.9,
    imageSrc: "/assets/placeholder-600x400.svg",
    href: "/sewists/aling-maria",
  };

  return (
    <div className="flex h-auto lg:h-96 flex-col lg:flex-row w-full bg-[#FFE5FF] p-6 lg:p-9 justify-between overflow-hidden">

      <div className="flex w-full lg:w-150 justify-center lg:justify-start text-center lg:text-left">
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl p-3 text-heading font-light">
          Today's <br className="hidden lg:block"/> Featured <br className="hidden lg:block"/> Sewist
        </h2>
      </div>
      
      <div className="h-1 w-full lg:h-full lg:w-1 my-6 lg:my-0 lg:mx-4 bg-primary rounded-full"></div>
      
      <div className="flex-1 flex justify-center lg:justify-end w-full">
        <FeaturedSewist
          sewistName={featuredSewist.sewistName}
          description={featuredSewist.description}
          rating={featuredSewist.rating}
          imageSrc={featuredSewist.imageSrc}
          href={featuredSewist.href}
        />
      </div>
    </div>
  );
}
