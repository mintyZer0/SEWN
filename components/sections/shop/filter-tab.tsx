"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import FilterCollapsibleSection from "@/components/ui/filter-collapsible-section";
import PriceRange from "@/components/ui/price-range";
import { MARKETPLACE_FILTERS, SEWIST_FILTERS } from "@/lib/constants";
import Categories from '../home/categories';

interface FilterTabProps {
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  type: "products" | "sewists";
  currentFilters?: Record<string, string[]>;
}

export default function FilterTab({ setFilters, type, currentFilters = {} }: FilterTabProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const productFilters = [
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
      options: MARKETPLACE_FILTERS["Sewist Location"],
    },

    { label: "Type", 
      options: MARKETPLACE_FILTERS.Type
    },
  ];

  const sewistFilters = [
    {
      label: "Experience",
      options: SEWIST_FILTERS.Experience
    },

    {
      label: "Services",
      options: SEWIST_FILTERS.Services
    },
  ];
  
  const filtersToUse = type === "products" ? productFilters : sewistFilters;
  
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl && type === "products") {
      const decodedCategory = decodeURIComponent(categoryFromUrl);
      setFilters((prev) => ({
        ...prev,
        Categories: [decodedCategory],
      }));
    }
  }, []);
  
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
        selectedValues={currentFilters[section.label] || []}
      />
      ))}

    </div>
  );
}
