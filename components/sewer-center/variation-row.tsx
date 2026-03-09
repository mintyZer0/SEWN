"use client";

import React from "react";
import { Image as ImageIcon } from "lucide-react";
import { CustomField } from "@/components/ui/custom-field";

interface VariationRowProps {
  label: string;
  type?: "Size" | "Color";
  showImageIcon?: boolean;
  namePrefix?: string;
}

export const VariationRow = ({
  label,
  type = "Size",
  showImageIcon = false,
  namePrefix = "",
}: VariationRowProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-4">
    <CustomField
      label={label}
      name={`${namePrefix}${label.toLowerCase().replace(/\s+/g, "-")}`}
      placeholder={type === "Size" ? "Small - 34" : "Red"}
    />
    <div className="flex gap-2 items-center">
      <CustomField 
        label="Price" 
        name={`${namePrefix}${label.toLowerCase().replace(/\s+/g, "-")}-price`}
        containerClassName="flex-1" 
      />
      {showImageIcon && (
        <button
          type="button"
          className="p-3 border-2 border-third/50 rounded-2xl text-third hover:bg-third/5 transition-colors mt-4"
        >
          <ImageIcon className="w-8 h-8" />
        </button>
      )}
    </div>
  </div>
);
