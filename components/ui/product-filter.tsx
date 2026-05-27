"use client";

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  type: "products" | "sewists";
}

export default function ProductFilter({ onSortChange, type }: ProductFilterProps) {
  const [sortBy, setSortBy] = useState('most-sold');

  const handleSortChange = (value: string) => {
    setSortBy(value);
    onSortChange(value);
  };

  return (
    <div className="mb-4 mx-2 sm:mx-4 w-full sm:w-auto">
      <Select variant="purple" value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-full sm:w-auto px-6 sm:px-8 py-2 bg-primary-light rounded-lg border-none text-base sm:text-lg sm:min-w-[240px]">
          <SelectValue placeholder="Filter by" />
        </SelectTrigger>
        <SelectContent>
            {type === "products" && (
              <>
              <SelectItem value="most-sold">Filter by most sold</SelectItem>
              <SelectItem value="highest-rated">Highest rated</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              </>
          )}
            {type === "sewists" && (
            <>
              <SelectItem value="highest-rated">Highest rated</SelectItem>
              <SelectItem value="most-active">Most active</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
