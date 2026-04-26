"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "react-feather";

interface VariantImageCarouselProps {
  images: string[];
  productName: string;
  selectedImage: string;
  onImageSelect: (url: string) => void;
  className?: string;
}

export default function VariantImageCarousel({
  images,
  productName,
  selectedImage,
  onImageSelect,
  className,
}: VariantImageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Approximate width of thumbnail + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (images.length === 0) return null;

  return (
    <div className={cn("relative group w-full my-8 px-10 mx-30", className)}>
      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex flex-row gap-8 overflow-x-auto py-6 px-4 -mx-4 custom-scrollbar scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => onImageSelect(img)}
            className={cn(
              "shrink-0 w-80 h-80 rounded-[40px] overflow-hidden cursor-pointer transition-all border-4 shadow-sm",
              selectedImage === img 
                ? "border-primary scale-105 shadow-primary/20" 
                : "border-transparent opacity-80 hover:opacity-100 bg-orchid/20"
            )}
          >
            <div className="relative w-full h-full">
               <Image
                 src={img}
                 alt={`${productName} view ${idx + 1}`}
                 fill
                 sizes="320px"
                 className="object-cover"
               />
               {/* Purple Overlay matching the design pattern if no image? */}
               {!img && <div className="absolute inset-0 bg-orchid/40" />}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons (Visible on hover if multiple images) */}
      {images.length > 3 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 shadow-lg text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 shadow-lg text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}
    </div>
  );
}
