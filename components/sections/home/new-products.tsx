"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import NewProductCard from "@/components/ui/new-product-card";

export default function NewProducts() {
  const [newProducts, setNewProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("seller_products")
        .select("*")
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
        <h2 className="text-3xl sm:text-5xl text-heading">
          newly added products
        </h2>
      </div>

      <div className="flex justify-center h-auto w-auto lg:mx-30 m-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-x-30">
          {newProducts.map((product) => (
            <NewProductCard
              key={product.id}
              id={product.id}
              name={product.name}                 
              img_src={product.img_src}           
              seller={product.seller_name}        
              price={Number(product.price)}       
              className={"h-100 lg:h-150"}
            />
          ))}
        </div>
      </div>
    </>
  );
}