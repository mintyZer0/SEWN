"use client";

import { useState } from 'react';

type Product = {
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
};

interface ProductFilterProps {
  products: Product[]; 
  onFilterChange: (sortedProducts: Product[]) => void;
}

export default function ProductFilter({ products, onFilterChange }: ProductFilterProps) {
  const [sortBy, setSortBy] = useState('most-sold');

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value); 
    let sortedProducts = [...products];

    switch (value) {
      case 'most-sold':
        // Use created_at since no 'sold' field
        sortedProducts.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case 'highest-rated':
        sortedProducts.sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        });
    break;
      case 'price-low-high':
        sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high-low':
        sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
    }
    onFilterChange(sortedProducts);
  };

  return (
    <div className="mb-4 mx-4">
      <select 
        value={sortBy}
        onChange={handleSortChange}
        className="px-8 py-2 bg-primary-light rounded-lg border-none text-lg appearance-none bg-no-repeat bg-right cursor-pointer hover:shadow-md transition-all"
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <option value="most-sold">Filter by most sold</option>
        <option value="highest-rated">Highest rated</option>
        <option value="price-low-high">Price: Low to High</option>
        <option value="price-high-low">Price: High to Low</option>
      </select>
    </div>
  );
}
