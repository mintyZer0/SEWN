"use client";

import { useState } from "react";
import FilterTab from "@/components/sections/shop/filter-tab";
import ShopGrid from "@/components/sections/shop/shop-grid";
import SearchBar from "@/components/ui/search-bar";

export default function Shop() {
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: [value],
    }));
  };

  return (
    <>
      <h1 className="flex justify-center mx-4 sm:mx-8 md:mx-20 text-4xl sm:text-5xl md:text-7xl lg:text-9xl text-heading p-4">
        Order
      </h1>

      <div className="flex flex-col md:flex-row gap-6 md:gap-0 my-10 md:my-20">
        <FilterTab setFilters={setFilters} type="products" />

        <div className="flex flex-1 flex-col mx-4 md:m-4 gap-4">
          <SearchBar value={filters.search?.[0] || ""} onChange={handleSearchChange} />
          <ShopGrid filters={filters} type="products" />
        </div>
      </div>
    </>
  );
}