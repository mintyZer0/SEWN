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

  const searchQuery = filters.search?.[0] || "";

  return (
    <>
      <div className="md:hidden pt-8 px-6">
        <h1 className="text-[34px] font-bold text-primary leading-tight">
          Custom Made Order
        </h1>
        <div className="mt-2">
          <p className="text-[17px] font-medium text-primary/70 leading-none">
            Showing Results for: {searchQuery ? `(${searchQuery.toUpperCase()})` : "(ALL)"}
          </p>
          <div id="product-count-mobile" className="text-[15px] text-primary/50 mt-1">
            {/* Count will be injected or handled by ShopGrid */}
          </div>
        </div>
      </div>

      <h1 className="hidden md:flex justify-center mx-4 sm:mx-8 md:mx-20 text-4xl sm:text-5xl md:text-7xl lg:text-9xl text-heading p-4">
        Order
      </h1>

      <div className="flex flex-col md:flex-row gap-6 md:gap-0 my-6 md:my-20">
        <FilterTab setFilters={setFilters} type="products" />

        <div className="flex flex-1 flex-col mx-4 md:m-4 gap-4">
          <div className="hidden md:block">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          </div>
          <ShopGrid filters={filters} type="products" />
        </div>
      </div>
    </>
  );
}