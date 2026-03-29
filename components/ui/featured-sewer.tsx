import Image from "next/image";
import Link from "next/link";
import { Star } from "react-feather";

export interface FeaturedSewerProps {
  sewerName: string;
  description: string;
  rating: number;
  imageSrc: string;
  href: string;
}

export default function FeaturedSewer({
  sewerName,
  description,
  rating,
  imageSrc,
  href,
}: FeaturedSewerProps) {
  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-6 md:gap-8 p-4 md:p-8 rounded-lg max-w-4xl w-full">
      
      <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right w-full">
        <h2 className="text-3xl md:text-5xl text-heading font-medium mb-2 md:mb-4">
          {sewerName}
        </h2>
        <p className="text-base md:text-lg text-foreground mb-4 md:mb-6 leading-relaxed">
          {description}
        </p>
        
        <div className="flex items-center justify-center md:justify-end gap-4 w-full">
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

      <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0">
        <Image
          src={imageSrc}
          alt={sewerName}
          fill
          className="object-cover rounded-full"
          sizes="(max-width: 768px) 192px, 256px"
        />
      </div>
    </div>
  );
}