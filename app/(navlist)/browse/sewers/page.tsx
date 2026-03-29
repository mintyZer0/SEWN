"use client";

import { useState } from "react";
import SewersGrid from "@/components/sections/sewers/sewers-grid";
import FilterTab from "@/components/sections/shop/filter-tab";
import SearchBar from "@/components/ui/search-bar";

export default function Sewers() {
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: [value],
    }));
  };

  return (
    <>
      <h1 className="flex justify-center mx-20 text-9xl text-heading p-4">
        Browse Sewers
      </h1>

      <div className="flex flex-row my-20">
        <FilterTab setFilters={setFilters} />

        <div className="flex flex-1 flex-col m-4 gap-4">
          <SearchBar value={filters.search?.[0] || ""} onChange={handleSearchChange} />
          <SewersGrid filters={filters} />
        </div>
      </div>
    </>
  );
}