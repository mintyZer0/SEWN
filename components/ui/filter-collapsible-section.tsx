"use client";
import React, { useState } from "react";
import FilterCheckBoxGroup from "./filter-checkbox-group";

type Section = {
  label: string;
  options: string[];
};

interface FilterCollapsibleSectionProps {
  section: Section;
}

export default function FilterCollapsibleSection({
  section,
}: FilterCollapsibleSectionProps) {
  const [openSections, toggleSection] = useState(false);

  return (
    <>
      <div className="p-4">
        <button
          className="font-light text-secondary text-3xl h-auto w-auto hover:cursor-pointer"
          onClick={() => toggleSection(!openSections)}
        >
          {section.label}
        </button>
        <div
          className={`overflow-hidden transition-all duration-400 ease-out ${
            openSections ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="pt-2">
            <FilterCheckBoxGroup filterOptions={section.options} />
          </div>
        </div>
      </div>
    </>
  );
}
