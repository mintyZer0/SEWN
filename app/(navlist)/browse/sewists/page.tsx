<<<<<<< HEAD:app/(navlist)/browse/sewers/page.tsx
=======
// app/sewists/page.tsx
>>>>>>> main:app/(navlist)/browse/sewists/page.tsx
"use client";

import { useState } from "react";
import SewistsGrid from "@/components/sections/sewists/sewists-grid";
import FilterTab from "@/components/sections/shop/filter-tab";
import SearchBar from "@/components/ui/search-bar";

export default function Sewists() {
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
        Browse Sewists
      </h1>

      <div className="flex flex-row my-20">
        <FilterTab setFilters={setFilters} type="sewists" />

        <div className="flex flex-1 flex-col m-4 gap-4">
          <SearchBar
            value={filters.search?.[0] || ""}
            onChange={handleSearchChange}
          />
          <SewistsGrid
            filters={filters}
<<<<<<< HEAD:app/(navlist)/browse/sewers/page.tsx
            type = "sewers"
=======
            type="sewists"
>>>>>>> main:app/(navlist)/browse/sewists/page.tsx
          />
        </div>
      </div>

    </>
  );
}
