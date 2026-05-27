"use client";

import { useState } from "react";

interface PriceRangeProps {
  onPriceChange: (min: number | null, max: number | null) => void;
}

export default function PriceRange({ onPriceChange }: PriceRangeProps) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  const update = (newMin: string, newMax: string) => {
    const minNum = Number(newMin);
    const maxNum = Number(newMax);

    const minValue = newMin !== "" && !isNaN(minNum) ? minNum : null;
    const maxValue = newMax !== "" && !isNaN(maxNum) ? maxNum : null;

    onPriceChange(minValue, maxValue);
  };

  return (
    <div className="flex flex-col p-4">
      <h3 className="text-secondary text-lg sm:text-2xl">Price</h3>

      <div className="flex flex-row gap-3">
        <input
          type="number"
          placeholder="Min"
          value={min}
          min="0"
          className="h-9 sm:h-10 w-20 bg-gray-300 text-center rounded-md no-spinner text-sm sm:text-base"
          onChange={(e) => {
            const value = e.target.value;
            setMin(value);
            update(value, max);
          }}
        />

        <span className="text-secondary text-lg sm:text-2xl">-</span>

        <input
          type="number"
          placeholder="Max"
          value={max}
          min="0"
          className="h-9 sm:h-10 w-20 bg-gray-300 text-center rounded-md no-spinner text-sm sm:text-base"
          onChange={(e) => {
            const value = e.target.value;
            setMax(value);
            update(min, value);
          }}
        />
      </div>
    </div>
  );
}