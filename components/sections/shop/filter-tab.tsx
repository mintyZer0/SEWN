"use client";

import FilterCollapsibleSection from "@/components/ui/filter-collapsible-section";
import PriceRange from "@/components/ui/price-range";
import { MARKETPLACE_FILTERS, SEWER_FILTERS } from "@/lib/constants";

const collapsibleLables = [
  {
    label: "Categories",
    options: MARKETPLACE_FILTERS.Categories,
  },

  {
    label: "Size",
    options: MARKETPLACE_FILTERS.Size,
  },

  {
    label: "Material",
    options: MARKETPLACE_FILTERS.Material,
  },

  {
    label: "Color",
    options: MARKETPLACE_FILTERS.Color,
  },

  {
    label: "Location",
    options: MARKETPLACE_FILTERS["Sewer Location"],
  },

  { label: "Type", 
    options: MARKETPLACE_FILTERS.Type
  },
];

const tailorFilters = [
  {
    label: "Experience",
    options: SEWER_FILTERS.Experience
  },

  {
    label: "Services",
    options: SEWER_FILTERS.Services
  },
];

interface FilterTabProps {
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  type: "products" | "sewers";
}

export default function FilterTab({ setFilters, type }: FilterTabProps) {

  const filtersToUse = type === "products" ? collapsibleLables : tailorFilters;

  const handleFilterChange = (section: string, values: string[]) => {
  setFilters((prev) => ({
    ...prev,
    [section]: values,
  }));
};

  const handlePriceChange = (min: number | null, max: number | null) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min !== null ? [min.toString()] : [],
      maxPrice: max !== null ? [max.toString()] : [],
    }));
  };

  return (
    <div className="flex flex-col h-auto w-60 bg-orchid-vertical-b mx-10 rounded-2xl">

      <h2 className="text-3xl text-center mt-4 font-semibold text-secondary">
        Filter
      </h2>

      <PriceRange onPriceChange={handlePriceChange} />

      {filtersToUse.map((section) => (
        <FilterCollapsibleSection
        key={section.label}
        section={section}
        onFilterChange={handleFilterChange}
      />
      ))}

    </div>
  );
}