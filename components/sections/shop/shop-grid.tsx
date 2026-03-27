"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "./product-card";
import ProductFilter from "@/components/ui/product-filter";

interface Product {
  id: string
  user_id: string
  name: string
  price: number
  img_src: string
  location: string
  type: string
  created_at: string
  is_active: boolean
  rating: number
  sold: number
  description?: string

  product_categories?: { category: string }[]
  product_colors?: { color: string }[]
  product_materials?: { material: string }[]
  product_sizes?: { size: string; }[]
  product_variants?: { stock_quantity: number }[]
}

interface Props {
  filters: Record<string, string[]>;
}

export default function ShopGrid({ filters }: Props) {
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
          .from("seller_products")
          .select(`
            *,
            product_categories (category),
            product_colors (color),
            product_materials (material),
            product_sizes (size),
            product_variants (stock_quantity)
          `)
          .eq("is_active", true)
          .order("sold", { ascending: false });

        if (error) {
          setErrorState(error.message);
          return;
        }

        if (data) {
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (err: any) {
        setErrorState(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
  let result = [...products];

  if (filters["Sewer Location"]?.length) {
    result = result.filter(p =>
      filters["Sewer Location"].includes(p.location)
    );
  }

  if (filters["Type"]?.length) {
    result = result.filter(p =>
      filters["Type"].includes(p.type)
    );
  }

  if (filters["Categories"]?.length) {
  result = result.filter((p) => {
    const categories = Array.isArray(p.product_categories)
      ? p.product_categories
      : [p.product_categories];

    return categories.some((c) => {
      if (!c?.category) return false;
      return filters["Categories"].includes(c.category);
    });
  });
}

  if (filters["Color"]?.length) {
    result = result.filter(p =>
      p.product_colors?.some(c =>
        filters["Color"].includes(c.color)
      )
    );
  }

  if (filters["Material"]?.length) {
    result = result.filter(p =>
      p.product_materials?.some(m =>
        filters["Material"].includes(m.material)
      )
    );
  }

  if (filters["Size"]?.length) {
    result = result.filter(p =>
      p.product_sizes?.some(s =>
        filters["Size"].includes(s.size)
      )
    );
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
    result = result.filter((p) => p.name.toLowerCase().includes(query));
  }

  // Sorting logic
  switch (sortBy) {
    case "most-sold":
      result.sort((a, b) => (b.sold || 0) - (a.sold || 0));
      break;
    case "highest-rated":
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
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

        <ProductFilter onSortChange={setSortBy} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 justify-items-center">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
