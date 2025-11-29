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
    <div className="flex items-center gap-8 bg-secondary p-8 rounded-lg max-w-4xl">
      {/* Left side - Text content */}
      <div className="flex-1 flex flex-col items-end text-right">
        <h2 className="text-5xl text-primary font-medium mb-4 text-right">
          {sewerName}
        </h2>
        <p className="text-lg text-foreground mb-6 leading-relaxed text-right">
          {description}
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <Star size={24} fill="currentColor" />
            <span className="text-2xl font-medium">{rating}</span>
          </div>
          <Link
            href={href}
            className="px-8 py-3 bg-primary text-white rounded-full hover:opacity-90 transition-opacity text-lg"
          >
            ABOUT
          </Link>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative w-64 h-64 shrink-0">
        <Image
          src={imageSrc}
          alt={sewerName}
          fill
          className="object-cover rounded-full"
          sizes="256px"
        />
      </div>
    </div>
  );
}
