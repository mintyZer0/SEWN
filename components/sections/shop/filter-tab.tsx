"use client";

import FilterCollapsibleSection from "@/components/ui/filter-collapsible-section";
import PriceRange from "@/components/ui/price-range";



const collapsibleLables = [
  {
    label: "Categories",
    options: ["Skirts", "Shirts", "Dresses", "Pants", "Accessories", "Gowns"],
  },
  {
    label: "Size",
    options: ["XSmall", "Small", "Medium", "Large", "XL", "2XL", "3XL"],
  },
  {
    label: "Material",
    options: ["Linen", "Cotton", "Silk", "Polyester", "Denim", "Bamboo"],
  },
  {
    label: "Color",
    options: [
      "Black",
      "Beige",
      "Red",
      "Blue",
      "Yellow",
      "Green",
      "Purple",
      "White",
      "Orange",
      "Brown",
      "Gray",
      "Pink"
    ],
  },
  {
    label: "Sewer Location",
    options: ["NCR", "Luzon", "Visayas", "Mindanao"],
  },
  { label: "Type", options: ["Kids", "Men", "Women"] },
];

interface FilterTabProps {
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

export default function FilterTab({ setFilters }: FilterTabProps) {

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

      {collapsibleLables.map((section) => (
        <FilterCollapsibleSection
        key={section.label}
        section={section}
        onFilterChange={handleFilterChange}
      />
      ))}

    </div>
  );
}