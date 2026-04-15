import React from "react";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import { CustomField } from "@/components/ui/custom-field";

interface VariationRowProps {
  label: string;
  type?: "Size" | "Color";
  showImageIcon?: boolean;
  namePrefix?: string;
  onRemove?: () => void;
  defaultValue?: {
    value?: string;
    price?: string;
    stock?: string;
    sku?: string;
  };
}

export const VariationRow = ({
  label,
  type = "Size",
  showImageIcon = false,
  namePrefix = "",
  onRemove,
  defaultValue,
}: VariationRowProps) => (
  <div className="flex flex-col gap-4 p-6 bg-gray-50/50 rounded-2xl mb-4 border border-gray-100 relative group">
    {onRemove && (
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-2 -right-2 p-2 bg-white shadow-md rounded-full text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 z-10"
      >
        <Trash2 size={16} />
      </button>
    )}
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <CustomField
        label={label}
        name={`${namePrefix}-value`}
        placeholder={type === "Size" ? "Small - 34" : "Red"}
        defaultValue={defaultValue?.value}
      />
      <div className="flex gap-2 items-center">
        <CustomField 
          label="Price Override" 
          name={`${namePrefix}-price`}
          placeholder="Optional"
          containerClassName="flex-1" 
          defaultValue={defaultValue?.price}
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

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <CustomField
        label="Stock"
        name={`${namePrefix}-stock`}
        placeholder="0"
        defaultValue={defaultValue?.stock}
      />
      <CustomField
        label="SKU"
        name={`${namePrefix}-sku`}
        placeholder="AUTO-GEN"
        defaultValue={defaultValue?.sku}
      />
    </div>
  </div>
);
