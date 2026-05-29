"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import ProductCard from "@/components/sections/shop/product-card";
import { createClient } from "@/utils/supabase/client";

interface ProductsProps {
  sewistId: string;
}

export default function Products({ sewistId }: ProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data } = await supabase
        .from("sewist_products")
        .select("*")
        .eq("user_id", sewistId)
        .eq("is_active", true)
        .limit(3);
      
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, [sewistId, supabase]);

  if (loading) return <div className="text-center py-20 text-xl text-gray-500">Loading products...</div>;
  if (products.length === 0) return null;

  const activeProduct = products[activeIndex];
  const isCarouselDisabled = products.length < 2;

  return (
    <div className="flex flex-col items-center py-10 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <h2 className="text-3xl sm:text-4xl md:text-6xl text-heading font-light mb-6 sm:mb-8 md:mb-12">Products</h2>
      
      {/* Mobile Carousel */}
      <div className="md:hidden w-full px-4 mb-6">
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => setActiveIndex((index) => (index - 1 + products.length) % products.length)}
            disabled={isCarouselDisabled}
            className="absolute left-0 z-10 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-primary disabled:opacity-40"
            aria-label="Previous product"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="w-full max-w-xs">
            <ProductCard key={activeProduct.id} product={activeProduct} />
          </div>
          <button
            type="button"
            onClick={() => setActiveIndex((index) => (index + 1) % products.length)}
            disabled={isCarouselDisabled}
            className="absolute right-0 z-10 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-primary disabled:opacity-40"
            aria-label="Next product"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-x-20 mb-6 sm:mb-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <button className="text-base sm:text-lg md:text-2xl text-heading hover:underline">
        See more
      </button>
    </div>
  );
}
