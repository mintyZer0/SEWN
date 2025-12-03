import Image from "next/image";

interface SewerHeaderProps {
  name: string;
  image: string;
  bio: string;
  rating: number;
  location: string;
}

export default function SewerHeader({
  name,
  image,
  bio,
  rating,
  location,
}: SewerHeaderProps) {
  return (
    <div className="flex flex-row gap-20 justify-center">
      <div className="relative right-20 w-170 h-170 shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover rounded-3xl"
        />
      </div>
      <div className="max-w-170  flex flex-col items-start justify-center">
        <h1 className="text-7xl font-light text-primary mb-6">{name}</h1>
        <p className="text-xl text-gray-800 leading-relaxed">{bio}</p>
      </div>
    </div>
  );
}
