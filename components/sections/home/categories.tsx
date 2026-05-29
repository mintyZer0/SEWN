"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import CategoriesCarousel from "../../ui/categories-carousel";
import { getS3PublicUrl } from "@/lib/s3-client";

type CategoryCarouselItem = {
  imageSrc: string;
  alt: string;
  category: string;
  id: string; 
  href?: string;
};

export default function Categories() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [itemsList, setItemsList] = useState<CategoryCarouselItem[]>([]);
  
  useEffect(() => { const loadCategories = async () => {
    try{    
    setLoading(true);
        
        const{data: categoryRows, error} = await supabase.rpc(
        'get_categories_with_images');

        if (error) {
          console.error("Error fetching categories:", error?.message, error);
          setItemsList([]);
        }
        
        const itemsList: CategoryCarouselItem[] =
        categoryRows?.map((row: any) => ({
          imageSrc: getS3PublicUrl(row.image_url) || '/assets/categories-images/def_Clothes.png',
          alt: `Products in ${row.category}`,
          category: row.category,
          id: row.category.toLowerCase().replace(/\s/g, '-'),
          href: `browse/shop?category=${encodeURIComponent(row.category)}`,
        })) || [];

        setItemsList(itemsList);
    }
    catch (error) {
      console.error("Unexpected error loading categories:", error);
      setItemsList([]);
    } finally {
      setLoading(false);
    }
  };
    loadCategories();
  }, []);

  return (
    <>
      {/* Mobile Title */}
      <div className="flex md:hidden justify-center mb-6 mt-4">
        <h2 className="text-3xl text-heading">
          Categories
        </h2>
      </div>
      
      {/* Desktop Title */}
      <div className="hidden md:flex mx-4 sm:mx-8">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl text-heading">
          categories
        </h2>
      </div>

      {loading ? (
        <div className="mx-4 sm:mx-8 mt-4">Loading categories...</div>
      ) : (
        <>
          {/* Desktop Carousel */}
          <div className="hidden md:block">
            <CategoriesCarousel items={itemsList}/>
          </div>
          
          {/* Mobile Vertical List */}
          <div className="md:hidden flex flex-col gap-4 px-6 mb-8">
            {itemsList.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={item.href || "/store?category=" + encodeURIComponent(item.category)}
                className="relative w-full h-[100px] rounded-[16px] overflow-hidden shadow-sm transition-transform active:scale-95"
              >
                <Image
                  src={item.imageSrc}
                  alt={item.alt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-3xl text-white drop-shadow-lg">
                    {item.category}
                  </h3>
                </div>
              </Link>
            ))}
            <Link
              href="/browse/shop"
              className="relative w-full h-[100px] rounded-[16px] overflow-hidden shadow-sm transition-transform active:scale-95 bg-gradient-to-br from-[#A881AA] to-[#7B3B7B]"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-2xl text-white drop-shadow-lg">
                  More Categories
                </h3>
              </div>
            </Link>
          </div>
        </>
      )}

      {/* Desktop More Button */}
      {!loading && (
        <div className="hidden md:flex justify-center mt-4">
          <Link
            href="/browse/shop"
            className="rounded-full bg-primary text-white px-6 py-2 text-sm font-semibold transition-all active:scale-95"
          >
            More Categories
          </Link>
        </div>
      )}
    </>
  );
}
