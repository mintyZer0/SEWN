"use client";
import Image from "next/image";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";

export interface CategoryItem {
  imageSrc: string;
  alt: string;
  category: string;
  id: string;
}

interface CarouselItemProps {
  items: CategoryItem[];
}

export default function CategoriesCarousel({ items }: CarouselItemProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const card = scrollRef.current.firstElementChild as HTMLElement;
      const scrollAmount = card ? card.offsetWidth + 16 : 600;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="rounded-box relative w-full py-2">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div className="relative shrink-0 w-155 group" key={item.id}>
            <div className="relative w-full h-96">
              <Image
                className="w-full h-full object-cover rounded-lg group-hover:scale-102 transform transition-transform duration-500 "
                src={item.imageSrc}
                alt={item.alt}
                fill
                sizes="600px"
              />
              <div className="absolute left-1/2 bottom-4 -translate-x-1/2 z-10">
                <p className="text-3xl text-white drop-shadow-lg">
                  {item.category}
                </p>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/70 from-5% via-40% via-gray-300/30 to-100% to-white/5 "></div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute inset-0 z-20 flex items-center justify-between px-4 pointer-events-none">
        <button
          onClick={() => scroll("left")}
          className="hover:cursor-pointer p-1 rounded-full bg-white opacity-70 text-gray-800 hover:opacity-100 transition-opacity pointer-events-auto"
        >
          <ChevronLeft size={30} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hover:cursor-pointer p-1 rounded-full bg-white opacity-70 text-gray-800 hover:opacity-100 transition-opacity pointer-events-auto"
        >
          <ChevronRight size={30} />
        </button>
      </div>
    </div>
  );
}
