import Image from "next/image";
import Link from "next/link";

export interface ServiceCardProps {
  imgSrc: string;
  service: string;
  href: string;
  colSpan: number;
  className?: string;
}
export default function ServiceCard({
  imgSrc,
  service,
  href,
  colSpan,
  className,
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className={`relative block w-fill h-100 ${className} col-span-${colSpan}`}
    >
      <Image
        src={imgSrc}
        alt={service}
        fill
        className="object-cover rounded-4xl"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2">
        <h3 className="text-4xl text-white drop-shadow-2xl drop-shadow-black">
          {service}
        </h3>
      </div>
      <div className="absolute inset-0 w-full h-full hover:bg-white/10 transition-all duration-500"></div>
    </Link>
  );
}
