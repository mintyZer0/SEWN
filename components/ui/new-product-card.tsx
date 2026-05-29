"use client";

import Image from "next/image";
import Link from "next/link";
import { getS3PublicUrl } from "@/lib/s3-client";

type NewProductProps = {
  id: string;
  name: string;
  price: number;
  img_src: string;
  sewist?: string;
  className?: string;
};

export default function NewProductCard({
  id,
  name,
  img_src,
  sewist,
  price,
  className,
}: NewProductProps) {
  const checkoutHref = `/checkout?id=${id}`;

  return (
    <Link
      href={checkoutHref}
      className={`${className} card group overflow-hidden border border-transparent hover:border-primary transition-all duration-300`}
    >
      <figure className="relative w-full aspect-3/4">
        <Image
          src={getS3PublicUrl(img_src)}
          alt={name}
          fill
          sizes="320px"
          className="object-cover rounded-md group-hover:scale-105 transition-transform duration-500"
        />
      </figure>

      <div className="flex flex-col items-center px-4 gap-2">
        <h2 className="card-title text-center text-lg sm:text-2xl md:text-3xl pt-4">
          {name}
        </h2>

        {sewist && (
          <p className="text-center text-muted text-sm sm:text-lg md:text-2xl">
            {sewist}
          </p>
        )}

        <p className="text-center font-medium text-sm sm:text-base">
          ₱{price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
