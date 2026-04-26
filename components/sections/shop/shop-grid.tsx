"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "./product-card";
import ProductFilter from "@/components/ui/product-filter";

interface Product {
  id: string;
  user_id: string;
  name: string;
  price: number;
  img_src: string;
  location: string;
  type: string;
  created_at: string;
  is_active: boolean;
  rating: number;
  sold: number;
  verification_status: string;
  description?: string;
  users?: {
    first_name: string;
    last_name: string;
  };

  product_categories?: { category: string } | { category: string }[];
  product_variants?: {
    stock_quantity: number;
    variant_attribute_values?: {
      attribute_type: string;
      attribute_value: string;
    }[];
  }[];
}

interface Props {
  filters: Record<string, string[]>;
  type: "products" | "sewists";
}


export default function ShopGrid({ filters, type }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("most-sold");

  
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from("sewist_products")
          .select(`
            *,
            users (first_name, last_name),
            product_categories (category),
            product_variants (
              stock_quantity,
              variant_attribute_values (
                attribute_type,
                attribute_value
              )
            )
          `)
          .eq("is_active", true)
          .eq("verification_status", "approved")
          .order("sold", { ascending: false });

        console.log('✅ Products loaded:', data?.[0]); // DEBUG
        setProducts(data || []);
        setFilteredProducts(data || []);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setErrorState(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []); 

  function getAttributesByType(
    product: Product,
    type: "color" | "size" | "material"
  ): string[] {
    if (!product.product_variants) return [];

  const values = product.product_variants.flatMap((variant) =>
    (variant.variant_attribute_values?? [])
      .filter((attr: any) => attr.attribute_type === type)
      .map((attr: any) => attr.attribute_value) || []
  );

  return Array.from(new Set(values));
}

  useEffect(() => {
    let result = [...products];

    if (filters["Location"]?.length) {
      result = result.filter(p => filters["Location"].includes(p.location));
    }
 
    if (filters["Type"]?.length) {
      result = result.filter(p => filters["Type"].includes(p.type));
    }

    if (filters["Categories"]?.length) {
      result = result.filter((p) => {
        const category = (p.product_categories as any)?.category;
        return category && filters["Categories"].includes(category);
      });
    }

    if (filters["Material"]?.length) {
      result = result.filter((p) => {
        const materials = getAttributesByType(p, "material");
        return materials.some(m => filters["Material"].includes(m));
      });
    }

    if (filters["Color"]?.length) {
      result = result.filter((p) => {
        const colors = getAttributesByType(p, "color");
        return colors.some(c => filters["Color"].includes(c));
      });
    }

    if (filters["Size"]?.length) {
      result = result.filter((p) => {
        const sizes = getAttributesByType(p, "size");
        return sizes.some(s => filters["Size"].includes(s));
      });
    }

    if (filters["minPrice"]?.[0]) {
      const min = Number(filters["minPrice"][0]);
      result = result.filter(p => p.price >= min);
    }
    if (filters["maxPrice"]?.[0]) {
      const max = Number(filters["maxPrice"][0]);
      result = result.filter(p => p.price <= max);
    }

    if (filters["search"]?.[0]) {
      const query = filters["search"][0].toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    switch (sortBy) {
      case "most-sold":
        result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        break;
      case "highest-rated":
        result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case "price-low-high":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high-low":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
    }

    setFilteredProducts(result);
  }, [filters, products, sortBy]);

  if (isLoading) {
    return <div className="text-center py-20 text-3xl font-bold text-gray-500">Loading products...</div>;
  }

  if (errorState) {
    return (
      <div className="text-center py-20 text-red-500">
        <p className="text-2xl font-bold mb-4">Error loading products</p>
        <p>{errorState}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <span className="text-2xl mx-5 font-bold text-gray-700">
          {filteredProducts.length} Products
        </span>
        <ProductFilter 
          onSortChange={setSortBy} 
          type="products" 
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 justify-items-center">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
