import FeaturedSewist from "@/components/ui/featured-sewist";
import Image from "next/image";
import Link from "next/link";
import { Star } from "react-feather";

export default function TodaysFeaturedSewist() {
  const featuredSewist = {
    sewistName: "Aling Maria",
    description:
      "a skilled local sewer known for her precise stitching, creative designs, and warm service. With years of experience, she brings every fabric to life, offering quality craftsmanship that the community trusts.",
    rating: 4.9,
    imageSrc: "/assets/placeholder-600x400.svg",
    href: "/sewists/aling-maria",
  };

  return (
    <div className="relative z-20 w-full bg-light-pink md:bg-light-pink px-0 pb-0 md:pb-10 pt-0 -mt-8 md:mt-0 lg:p-9">
      <div className="md:hidden">
        <div className="relative bg-light-pink px-8 pb-4 pt-6">
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Title Section */}
            <div className="w-full text-left">
              <h2 className="text-[32px] sm:text-4xl text-primary font-normal leading-tight tracking-normal">
                Today's Featured <br className="sm:hidden" /> Sewist
              </h2>
            </div>

            {/* Profile Info & Image Row */}
            <div className="flex w-full items-center justify-between gap-4 pl-2 mb-6">
              <div className="flex flex-col items-center justify-center pt-2">
                <p className="text-3xl sm:text-3xl font-bold text-primary tracking-tight">
                  {featuredSewist.sewistName}
                </p>
                <div className="flex items-center gap-1.5 text-primary mt-1">
                  <div className="bg-primary rounded-full p-0.5">
                     <Star size={10} fill="white" stroke="white" />
                  </div>
                  <span className="text-[13px] font-normal">{featuredSewist.rating}</span>
                </div>
              </div>
              
              <div className="relative w-32 h-32 shrink-0 bg-[#E0DFE0] rounded-full overflow-hidden">
                <Image
                  src={featuredSewist.imageSrc}
                  alt={featuredSewist.sewistName}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Description */}
            <p className="px-2 text-[13px] text-primary/80 leading-snug text-center tracking-tight font-medium max-w-sm">
              {featuredSewist.description}
            </p>

            {/* Button */}
            <div className="mt-6 flex justify-center w-full">
              <Link
                href={featuredSewist.href}
                className="inline-flex w-[200px] items-center justify-center rounded-xl bg-primary px-6 py-2 text-[15px] font-bold text-white transition-all active:scale-95"
              >
                About
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex h-auto lg:h-96 flex-col lg:flex-row w-full justify-between overflow-hidden">
        <div className="flex w-full lg:w-150 justify-center lg:justify-start text-center lg:text-left">
          <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl p-3 text-heading font-light">
            Today's <br className="hidden lg:block" /> Featured{" "}
            <br className="hidden lg:block" /> Sewist
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
    </div>
  );
}
