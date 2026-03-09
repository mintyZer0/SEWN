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
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        setErrorState(null);
        console.log('Fetching products...');
        
        const { data, error } = await supabase
          .from('seller_products')
          .select('*')
          .eq('is_active', true)
          .order('sold', { ascending: false });

        console.log('Products:', data, 'Error:', error);

        if (error) {
          console.error('Error fetching products:', error);
          setErrorState(error.message);
          return;
        }

        if (data) {
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (err: any) {
        console.error('Unexpected error:', err);
        setErrorState(err.message || 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleFilterChange = (sortedProducts: Product[]) => {
    setFilteredProducts(sortedProducts);
  };

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

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-3xl font-bold text-gray-400">No products found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <span className="text-2xl mx-5 font-bold text-gray-700">{filteredProducts.length} Products</span>
        <ProductFilter products={products} onFilterChange={handleFilterChange} />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 justify-items-center">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
