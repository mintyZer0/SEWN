import Image from "next/image";
import Link from "next/link";
import { MapPin, Award, Briefcase, TrendingUp, Star } from "react-feather";

interface SewerCardProps {
  id: string;
  name: string;
  image: string;
  location: string;
  yearsOfExperience: number;
  servicesOffered: string[];
  priceRange: number[];
  rating: number;
}

export default function SewerCard({
  id,
  name,
  image,
  location,
  yearsOfExperience,
  servicesOffered,
  priceRange = [1000, 10000],
  rating,
}: SewerCardProps) {
  return (
    <Link href={`/sewer-profiles/${id}`}>
      <div className="bg-orchid-vertical-b rounded-3xl overflow-hidden px-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full max-w-xl h-150">
        <div className="relative w-full aspect-video bg-white rounded-b-3xl mt-6">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover rounded-b-3xl"
          />
        </div>

        <div className="p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-white">
                <Image
                  src={image}
                  alt={name}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{name}</h3>
            </div>
            <div className="flex items-center gap-1 bg-white text-primary px-3 py-1 rounded-full">
              <Star size={16} fill="currentColor" />
              <span className="font-semibold">{rating}</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin size={20} className="shrink-0 mt-0.5" />
              <span>{location}</span>
            </div>

            <div className="flex items-start gap-2">
              <Award size={20} className="shrink-0 mt-0.5" />
              <span>{yearsOfExperience}+ years experience</span>
            </div>

            <div className="flex items-start gap-2">
              <Briefcase size={20} className="shrink-0 mt-0.5" />
              <span>{servicesOffered.join(", ")}</span>
            </div>

            <div className="flex items-start gap-2">
              <TrendingUp size={20} className="shrink-0 mt-0.5" />
              <span>
                {priceRange[0]} {" - "} {priceRange[1]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
