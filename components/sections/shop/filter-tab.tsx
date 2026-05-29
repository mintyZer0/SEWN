"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { X } from 'lucide-react';
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
    <div className="filter-tab-container hidden md:flex flex-col h-auto w-full md:w-60 bg-orchid-vertical-b md:mx-10 rounded-2xl overflow-y-auto">
      <div className="flex justify-between items-center p-6 md:hidden bg-primary rounded-t-2xl">
        <h2 className="text-2xl font-bold text-white">Filters</h2>
        <button 
          className="p-2 text-white"
          onClick={() => {
            const container = document.querySelector('.filter-tab-container') as HTMLElement;
            if (container) {
              container.classList.add('hidden');
              container.classList.remove('fixed', 'inset-0', 'z-[1100]', 'bg-white', 'm-0', 'rounded-none');
            }
          }}
        >
          <X size={24} />
        </button>
      </div>

      <h2 className="hidden md:block text-2xl sm:text-3xl text-center mt-4 font-semibold text-secondary">
        Filter
      </h2>

      <div className="md:p-0 p-4">
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
    </div>
  );
}
