"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CategoriesCarousel from "../../ui/categories-carousel";

type CategoryCarouselItem = {
  imageSrc: string;
  alt: string;
  category: string;
  id: string; 
};

export default function Categories() {
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
        categoryRows?.map((row: any, index: number) => ({
          imageSrc: row.image_url ?? '/assets/categories-images/fallback.jpg',
          alt: `Products in ${row.category}`,
          category: row.category,
          id: row.category.toLowerCase().replace(/\s/g, '-'),
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
      <div className="flex mx-8">
        <h2 className="lg:text-5xl sm:text-4xl text-3xl text-heading">
          categories
        </h2>
      </div>
      {loading ? (
        <div className="mx-8 mt-4">Loading categories...</div>
      ) : (
        <CategoriesCarousel items={itemsList} />
      )}
    </>
  );
}
