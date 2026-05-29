"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { createClient } from "@/utils/supabase/client";
import NewProductCard from "@/components/ui/new-product-card";

export default function NewProducts() {
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("sewist_products")
        .select("*, users(first_name, last_name)")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching products:", error);
        setNewProducts([]);
      } else {
        setNewProducts(data);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [supabase]);

  useEffect(() => {
    if (activeIndex > 0 && activeIndex >= newProducts.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, newProducts.length]);

  const hasProducts = newProducts.length > 0;
  const activeProduct = hasProducts ? newProducts[activeIndex] : null;
  const isCarouselDisabled = newProducts.length < 2;

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-gray-500">
        Loading products...
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center p-4 m-4">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl text-heading">
          newly added products
        </h2>
      </div>
      <div className="md:hidden px-4">
        {activeProduct && (
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={() =>
                setActiveIndex(
                  (index) => (index - 1 + newProducts.length) % newProducts.length
                )
              }
              disabled={isCarouselDisabled}
              className="absolute left-0 z-10 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-primary disabled:opacity-40"
              aria-label="Previous product"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="w-full max-w-xs">
              <NewProductCard
                key={activeProduct.id}
                id={activeProduct.id}
                name={activeProduct.name}
                img_src={activeProduct.img_src}
                sewist={
                  activeProduct.users
                    ? `${activeProduct.users.first_name} ${activeProduct.users.last_name}`.trim()
                    : "Unknown Sewist"
                }
                price={Number(activeProduct.price)}
                className="h-auto bg-white rounded-3xl shadow-md"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                setActiveIndex((index) => (index + 1) % newProducts.length)
              }
              disabled={isCarouselDisabled}
              className="absolute right-0 z-10 w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-primary disabled:opacity-40"
              aria-label="Next product"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="hidden md:flex justify-center h-auto w-auto lg:mx-30 m-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-x-30">
          {newProducts.map((product) => (
            <NewProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              img_src={product.img_src}
              sewist={
                product.users
                  ? `${product.users.first_name} ${product.users.last_name}`.trim()
                  : "Unknown Sewist"
              }
              price={Number(product.price)}
              className={"h-100 lg:h-150"}
            />
          ))}
        </div>
      </div>
    </>
  );
}
