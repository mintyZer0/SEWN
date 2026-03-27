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
  onSortChange: (sortBy: string) => void;
}

export default function ProductFilter({ onSortChange }: ProductFilterProps) {
  const [sortBy, setSortBy] = useState('most-sold');

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortBy(value);
    onSortChange(value);
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
