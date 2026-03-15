"use client";

import { useState } from "react";
import FilterCheckBoxGroup from "./filter-checkbox-group";

type Section = {
  label: string;
  options: string[];
};

interface Props {
  section: Section;
  onFilterChange: (section: string, values: string[]) => void;
}

export default function FilterCollapsibleSection({
  section,
  onFilterChange,
}: Props) {

  const [open, setOpen] = useState(false);

  return (
    <div className="p-4">

      <button
        className="font-light text-secondary text-3xl h-auto w-auto hover:cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {section.label}
      </button>

      <div
        className={`overflow-hidden transition-all duration-400 ease-out ${
          open ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <FilterCheckBoxGroup
          filterOptions={section.options}
          sectionLabel={section.label}
          onChange={onFilterChange}
        />
      </div>

    </div>
  );
}