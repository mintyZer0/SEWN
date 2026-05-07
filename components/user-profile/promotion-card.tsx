"use client";

import React from "react";
import Image from "next/image";
import { getS3PublicUrl } from "@/lib/s3-client";

interface PromotionProps {
  title: string;
  description: string;
  priceInfo?: string;
  date: string;
  imageSrc?: string;
}

export default function PromotionCard({
  title,
  description,
  priceInfo,
  date,
  imageSrc,
}: PromotionProps) {
  const imageSource = getS3PublicUrl(imageSrc || "default.jpg");

  return (
    <div className="bg-white rounded-[30px] p-6 flex gap-4 shadow-lg border border-white/20 transition-all hover:shadow-white/5 relative overflow-hidden">
      <div className="relative w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden shadow-sm">
        <Image src={imageSource} alt={title} fill sizes="(max-width: 768px) 96px, 128px" className="object-cover" />
      </div>

      <div className="flex-1 flex flex-col justify-center pr-4">
        <h3 className="text-xl md:text-2xl font-bold text-third mb-1 leading-tight uppercase">
          {title}
        </h3>
        <p className="text-gray-700 text-sm md:text-base leading-snug mb-2">
          {description}
        </p>
        {priceInfo ? <p className="text-gray-900 text-lg md:text-xl">{priceInfo}</p> : null}
      </div>

      <div className="absolute bottom-4 right-6">
        <span className="text-[10px] md:text-xs text-gray-500 font-medium italic">
          {date}
        </span>
      </div>
    </div>
  );
}
