import { useState } from "react";

interface Props {
  filterOptions: string[];
  sectionLabel: string;
  onChange: (section: string, values: string[]) => void;
}

export default function FilterCheckBoxGroup({
  filterOptions,
  sectionLabel,
  onChange,
}: Props) {

  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (option: string, checked: boolean) => {

    let updated = [...selected];

    if (checked) {
      updated.push(option);
    } else {
      updated = updated.filter((v) => v !== option);
    }

    setSelected(updated);
    onChange(sectionLabel, updated);
  };

  return (
    <div className="flex flex-col gap-2 flex = 1">

      {filterOptions.map((option) => (
        <label key={option} className="flex flex-row items-center gap-2 cursor-pointer">

          <input
            type="checkbox"
            className="checkbox bg-primary checked:border-primary rounded-sm checked:shadow-none"
            onChange={(e) => handleChange(option, e.target.checked)}
          />

          <span className="text-2xl text-secondary">{option}</span>

        </label>
      ))}

    </div>
  );
}