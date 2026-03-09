"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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
  description?: string;
}

export default function ShopGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      console.log('Fetching products...');
      const { data, error } = await supabase
      .from('seller_products')
      .select(`*`)
      .order('sold', { ascending: false })
      .eq('is_active', true);

      console.log('Products:', data, 'Error:', error);
      if (data) {
        setProducts(data);
        setFilteredProducts(data);
      }
    }
    fetchProducts();
  }, []);

  const handleFilterChange = (sortedProducts: Product[]) => {
    setFilteredProducts(sortedProducts);
  };

  if (products.length === 0) {
    return <div className="text-center py-20">Loading products...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <span className="text-2xl mx-5">{filteredProducts.length} Products</span>
        <ProductFilter products={products} onFilterChange={handleFilterChange} />
      </div>
      
      <div className="grid grid-cols-4 gap-4 p-4 justify-items-center">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
