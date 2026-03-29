"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MessageCircle, MapPin, Award, Briefcase, TrendingUp } from "react-feather";


export type Sewer = {
  id: string;
  name: string;
  location: string;
  img_src?: string;
  rating: number;
  completed_orders?: number;
  services?: string[];
  years_of_experience?: number;
};

export interface SewerCardProps {
  sewer: Sewer;
}

export default function SewerCard({ sewer }: SewerCardProps) {

  const getImageUrl = (path: string | undefined) => {
    if (!path) return "/assets/sewer-photos/1.jpg"; // Fallback
    if (path.startsWith("http") || path.startsWith("/")) return path;
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
    if (!projectUrl) return path;
    return `${projectUrl}/storage/v1/object/public/${path}`;
  };

  return (
    <div className="bg-orchid-vertical-b rounded-3xl overflow-hidden px-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 w-full max-w-xl h-150">
      <Link href={`/sewer-profiles/${sewer.id}`}>
        <div className="relative w-full aspect-video bg-white rounded-b-3xl mt-6">
          <Image
            src={getImageUrl(sewer.img_src)}
            alt={sewer.name || "Sewer"}
            fill
            className="object-cover rounded-b-3xl"
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Future: Open chat
            }}
            className="absolute top-2 right-2 bg-secondary hover:bg-primary hover:text-white text-heading p-2 rounded-full shadow-lg transition-colors z-10"
            aria-label="Message sewer"
          >
            <MessageCircle size={20} />
          </button>
        </div>

        <div className="p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-white">
                <Image
                  src={getImageUrl(sewer.img_src)}
                  alt={sewer.name || "Sewer"}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">{sewer.name}</h3>
            </div>

            <div className="flex items-center gap-1 bg-white text-heading px-3 py-1 rounded-full">
              <Star size={16} fill="currentColor" />
              <span className="font-semibold">{sewer.rating}</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <MapPin size={20} className="shrink-0 mt-0.5" />
              <span>{sewer.location}</span>
            </div>

            <div className="flex items-start gap-2">
              <Award size={20} className="shrink-0 mt-0.5" />
              <span>{sewer.years_of_experience ?? 0}+ years experience</span>
            </div>

            <div className="flex items-start gap-2">
              <Briefcase size={20} className="shrink-0 mt-0.5" />
              <span>{sewer.services?.join(", ") || "No services listed"}</span>
            </div>

            <div className="flex items-start gap-2">
              <TrendingUp size={20} className="shrink-0 mt-0.5" />
              <span>{sewer.completed_orders ?? 0} orders completed</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}