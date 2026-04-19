import Image from "next/image";
import { CheckCircle, Award } from "react-feather";

interface SewistHeaderProps {
  name: string;
  image: string;
  bio: string;
  rating: number;
  location: string;
  isVerified?: boolean;
  isTesdaCertified?: boolean;
}

export default function SewistHeader({
  name,
  image,
  bio,
  rating,
  location,
  isVerified,
  isTesdaCertified,
}: SewistHeaderProps) {
  return (
    <div className="flex flex-row gap-20 justify-center">
      <div className="relative right-20 w-170 h-170 shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-3xl"
        />
        {isTesdaCertified && (
          <div className="absolute bottom-6 left-6 bg-primary text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <Award size={24} />
            <span className="text-sm font-bold uppercase tracking-widest">TESDA Certified</span>
          </div>
        )}
      </div>
      <div className="max-w-170 flex flex-col items-start justify-center">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-7xl font-light text-heading">{name}</h1>
          {isVerified && (
            <CheckCircle size={48} className="text-blue-500 fill-blue-50 mt-2" />
          )}
        </div>
        <p className="text-xl text-gray-800 leading-relaxed mb-8">{bio}</p>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-secondary/20 px-4 py-2 rounded-2xl">
            <span className="text-2xl font-bold text-heading">{rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm uppercase font-bold tracking-tighter">Rating</span>
          </div>
          <div className="text-gray-400 text-xl font-light">
            {location}
          </div>
        </div>
      </div>
    </div>
  );
}
