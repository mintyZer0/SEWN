"use client";

import React from "react";
import Image from "next/image";
import { getS3PublicUrl } from "@/lib/s3-client";

interface OrderUpdateProps {
  productName: string;
  sewistName?: string;
  statusMessage: string;
  date: string;
  imageSrc?: string;
}

export default function OrderUpdateCard({
  productName,
  sewistName,
  statusMessage,
  date,
  imageSrc,
}: OrderUpdateProps) {
  const imageSource = getS3PublicUrl(imageSrc || "default.jpg");
  const heading = sewistName ? `${productName}, ${sewistName}` : productName;

  return (
    <div className="bg-white rounded-[30px] p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 shadow-lg border border-white/20 transition-all hover:shadow-xl relative overflow-hidden">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden shadow-sm">
        <Image src={imageSource} alt={productName} fill sizes="(max-width: 768px) 96px, 128px" className="object-cover" />
      </div>

      <div className="flex-1 flex flex-col justify-center pr-4">
        <h3 className="text-xl md:text-2xl font-bold text-third mb-1">
          {heading}
        </h3>
        <p className="text-gray-700 text-base md:text-lg leading-snug">
          {statusMessage}
        </p>
      </div>

      <div className="self-end sm:self-auto sm:absolute sm:bottom-4 sm:right-6 mt-2 sm:mt-0">
        <span className="text-xs md:text-sm text-gray-500 font-medium italic">
          {date}
        </span>
      </div>
    </div>
  );
}
