import React from "react";
import { CustomField } from "@/components/ui/custom-field";
import { CATEGORY_OPTIONS } from "./constants";
import { normalizeDecimalInput } from "./utils";

interface ProductBasicInfoProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const ProductBasicInfo = ({ formData, setFormData }: ProductBasicInfoProps) => {
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-bold text-third border-b border-third/10 pb-2">Basic Information</h3>
      <div className="grid grid-cols-1 gap-6">
        <CustomField
          label="Product Name"
          placeholder="SEWN TShirt"
          value={formData.productName || ""}
          onChange={(e: any) => setFormData({ ...formData, productName: e.target.value })}
          required
        />
        <CustomField
          label="Description"
          placeholder="Tell buyers about your product..."
          isTextArea
          value={formData.description || ""}
          onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <CustomField
          label="Base Price (PHP)"
          placeholder="0.00"
          value={formData.price}
          onChange={(e: any) => setFormData({ ...formData, price: normalizeDecimalInput(e.target.value) })}
          inputMode="decimal"
          required
        />
        <CustomField
          label="Shipping Region"
          isSelect
          value={formData.location}
          onChange={(e: any) => setFormData({ ...formData, location: e.target.value })}
          options={[
            { value: "NCR", label: "NCR" },
            { value: "Luzon", label: "Luzon" },
            { value: "Visayas", label: "Visayas" },
            { value: "Mindanao", label: "Mindanao" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CustomField
          label="Target Audience"
          isSelect
          value={formData.type}
          onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
          options={[
            { value: "Men", label: "Men" },
            { value: "Women", label: "Women" },
            { value: "Kids", label: "Kids" },
          ]}
        />
        <CustomField
          label="Category"
          isSelect
          value={formData.category}
          onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
          options={CATEGORY_OPTIONS}
        />
        <CustomField
          label="Est. Shipping Time"
          placeholder="e.g. 7-10 days"
          value={formData.shippingTime}
          onChange={(e: any) => setFormData({ ...formData, shippingTime: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <CustomField
          label="Weight in grams"
          placeholder="0.00"
          value={formData.weight}
          onChange={(e: any) => setFormData({ ...formData, weight: normalizeDecimalInput(e.target.value) })}
          inputMode="decimal"
        />
        <CustomField
          label="Fabric"
          isSelect
          value={formData.fabric}
          onChange={(e: any) => setFormData({ ...formData, fabric: e.target.value })}
          options={[
            { value: "cotton", label: "Cotton" },
            { value: "linen", label: "Linen" },
            { value: "silk", label: "Silk" },
            { value: "denim", label: "Denim" },
          ]}
        />
      </div>

      <div className="grid grid-cols-1">
        <CustomField
          label="Care Instructions"
          isSelect
          value={formData.careInstructions}
          onChange={(e: any) => setFormData({ ...formData, careInstructions: e.target.value })}
          options={[
            { value: "hand-wash", label: "Hand wash only" },
            { value: "dry-clean", label: "Dry clean" },
            { value: "machine-wash", label: "Machine wash" },
          ]}
        />
      </div>
    </div>
  );
};
