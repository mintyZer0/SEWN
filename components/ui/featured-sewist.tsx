import Image from "next/image";
import Link from "next/link";
import { Star } from "react-feather";

export interface FeaturedSewistProps {
  sewistName: string;
  description: string;
  rating: number;
  imageSrc: string;
  href: string;
}

export default function FeaturedSewist({
  sewistName,
  description,
  rating,
  imageSrc,
  href,
}: FeaturedSewistProps) {
  return (
    <div className="p-4 md:py-8 md:pl-8 md:pr-0 rounded-lg w-full relative clear-both">
      {/* Desktop Floated Image */}
      <div 
        className="hidden md:block float-right relative w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] -mt-16 lg:-mt-32 -mr-32 lg:-mr-48 z-20"
        style={{ shapeOutside: 'circle(50%)' }}
      >
        <Image
          src={imageSrc}
          alt={sewistName}
          fill
          className="object-cover rounded-full"
          sizes="600px"
        />
      </div>

      {/* Mobile Image (hidden on desktop) */}
      <div className="relative w-48 h-48 shrink-0 mx-auto mt-6 md:hidden">
        <Image
          src={imageSrc}
          alt={sewistName}
          fill
          className="object-cover rounded-full"
          sizes="192px"
        />
      </div>

      <div className="text-center md:text-left mt-8 md:mt-0">
        <h2 className="text-3xl md:text-5xl text-heading font-medium mb-2 md:mb-4 pt-2">
          {sewistName}
        </h2>
        <p className="text-base md:text-lg text-foreground mb-4 md:mb-6 leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-center md:justify-start gap-4">
          <div className="flex items-center gap-2 text-heading">
            <Star size={24} fill="#7b3b7b" stroke="#7b3b7b" />
            <span className="text-xl md:text-2xl font-medium">{rating}</span>
          </div>
          <Link
            href={href}
            className="px-6 py-2 md:px-8 md:py-3 bg-primary text-white rounded-full hover:opacity-90 transition-opacity text-base md:text-lg"
          >
            ABOUT
          </Link>
        </div>
      </div>
    </div>
  );
}