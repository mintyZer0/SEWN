"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface ProductVariant {
  id: string;
  sku: string;
  stock_quantity: number;
  price_override: number | null;
  variant_attribute_values: {
    attribute_type: string;
    attribute_value: string;
  }[];
}

interface VariantSelectorProps {
  variants: ProductVariant[];
  onVariantSelect: (variant: ProductVariant | null) => void;
}

export default function VariantSelector({
  variants,
  onVariantSelect,
}: VariantSelectorProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});

  // Group attributes by type for the selector UI
  const attributeGroups: Record<string, string[]> = {};
  variants.forEach((v) => {
    v.variant_attribute_values.forEach((attr) => {
      if (!attributeGroups[attr.attribute_type]) {
        attributeGroups[attr.attribute_type] = [];
      }
      if (!attributeGroups[attr.attribute_type].includes(attr.attribute_value)) {
        attributeGroups[attr.attribute_type].push(attr.attribute_value);
      }
    });
  });

  const attributeTypes = Object.keys(attributeGroups);

  // Automatically find the variant that matches the selected attributes
  useEffect(() => {
    if (attributeTypes.length === 0) return;

    // Check if we have a value for every required attribute type
    const allSelected = attributeTypes.every((type) => selectedAttributes[type]);
    
    if (allSelected) {
      const matchingVariant = variants.find((v) => {
        return attributeTypes.every((type) => {
          return v.variant_attribute_values.some(
            (attr) => attr.attribute_type === type && attr.attribute_value === selectedAttributes[type]
          );
        });
      });
      onVariantSelect(matchingVariant || null);
    } else {
      onVariantSelect(null);
    }
  }, [selectedAttributes, variants]);

  const handleAttributeSelect = (type: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [type]: prev[type] === value ? "" : value,
    }));
  };

  if (attributeTypes.length === 0) return null;

  return (
    <div className="space-y-10">
      {attributeTypes.map((type) => (
        <div key={type} className="space-y-3">
          <h4 className="text-2xl font-bold text-heading">
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </h4>
          <div className="flex flex-wrap gap-4">
            {attributeGroups[type].map((value) => {
              const isSelected = selectedAttributes[type] === value;
              return (
                <button
                  key={value}
                  onClick={() => handleAttributeSelect(type, value)}
                  className={cn(
                    "min-w-[100px] py-2 rounded-full text-lg font-medium transition-all border-2",
                    isSelected 
                      ? "bg-primary border-primary text-white" 
                      : "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
                  )}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
