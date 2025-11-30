import FilterCheckBoxGroup from "@/components/ui/filter-checkbox-group";
import FilterCollapsibleSection from "@/components/ui/filter-collapsible-section";
import PriceRange from "@/components/ui/price-range";
const collapsibleLables = [
  {
    label: "Categories",
    options: ["Skirts", "Shirts", "Dresses", "Pants", "Accessories", "Gowns"],
  },
  {
    label: "Size",
    options: ["Extra Small", "Small", "Medium", "Large", "XL", "2XL", "3XL"],
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
      "Pink",
    ],
  },
  {
    label: "Sewer Location",
    options: ["NCR", "Luzon", "Visayas", "Mindanao"],
  },
  { label: "Type", options: ["Kids", "Men", "Women"] },
];

export default function FilterTab() {
  return (
    <div className="flex flex-col h-auto w-60 bg-orchid-vertical mx-10 my-20">
      <div className="flex-1">
        <h2 className="text-3xl text-center mt-4 font-semibold text-secondary">
          Filter
        </h2>
        <PriceRange />
        {collapsibleLables.map((section) => (
          <FilterCollapsibleSection key={section.label} section={section} />
        ))}
      </div>
    </div>
  );
}
