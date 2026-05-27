"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import CategoriesCarousel from "../../ui/categories-carousel";
import { getS3PublicUrl } from "@/lib/s3-client";

type CategoryCarouselItem = {
  imageSrc: string;
  alt: string;
  category: string;
  id: string; 
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
      <div className="flex mx-4 sm:mx-8">
        <h2 className="lg:text-5xl sm:text-4xl text-3xl text-heading">
          categories
        </h2>
      </div>
      {loading ? (
        <div className="mx-4 sm:mx-8 mt-4">Loading categories...</div>
      ) : (
        <CategoriesCarousel items={itemsList}/>
      )}
    </>
  );
}
