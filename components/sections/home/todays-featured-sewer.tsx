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
    <div className="flex h-96 flex-row w-full bg-secondary-gradient-b p-9 justify-between">
      <div className="flex w-150">
        <h2 className="text-7xl lg:text-8xl p-3 text-primary font-light">
          Today's <br /> Featured <br /> Sewer
        </h2>
      </div>
      <div className="h-full w-1 mx-4 bg-primary"></div>
      <div className="flex-1 flex justify-end">
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
