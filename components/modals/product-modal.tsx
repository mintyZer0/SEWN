"use client";

import React, { useState, useEffect } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { CustomField } from "@/components/ui/custom-field";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { VariationRow } from "@/components/sewer-center/variation-row";
import { SectionItem } from "@/components/sewer-center/collapsible-product-section";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: SectionItem | null;
  onSave?: (product: Partial<SectionItem>) => Promise<void>;
}

export const ProductModal = ({
  isOpen,
  onClose,
  product,
  onSave,
}: ProductModalProps) => {
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    stock: "",
    category: "tops",
    subCategory: "formal",
    shippingTime: "",
    weight: "",
    fabric: "cotton",
    careInstructions: "hand-wash",
  });

  useEffect(() => {
    if (product) {
      setFormData((prev) => ({
        ...prev,
        productName: product.name,
      }));
    } else {
      setFormData({
        productName: "",
        description: "",
        price: "",
        stock: "",
        category: "tops",
        subCategory: "formal",
        shippingTime: "",
        weight: "",
        fabric: "cotton",
        careInstructions: "hand-wash",
      });
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    const formValues = Object.fromEntries(data.entries());

    if (onSave) {
      await onSave({
        id: product?.id,
        name: formValues.productName as string,
      });
    }

  
    onClose();
  };

  const isEdit = !!product;

  return (
    <div className="fixed inset-0 z-1100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[30px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-10 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-primary">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-8 h-8 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* Photos Section */}
          <div>
            <h3 className="text-xl font-bold text-third mb-4">Add photos</h3>
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
              <div className="col-span-2 row-span-2 h-full">
                <PhotoSlot size="lg" />
              </div>
              <PhotoSlot />
              <PhotoSlot />
              <PhotoSlot />
              <PhotoSlot />
            </div>
          </div>

          {/* Core Info */}
          <div className="space-y-6">
            <CustomField
              label="Product Name"
              name="productName"
              placeholder="SEWN TShirt"
              defaultValue={formData.productName}
            />
            <CustomField
              label="Description"
              name="description"
              placeholder="Best Design"
              isTextArea
              defaultValue={formData.description}
            />

            <div className="grid grid-cols-2 gap-6">
              <CustomField
                label="Price"
                name="price"
                placeholder="PHP67676"
                defaultValue={formData.price}
              />
              <CustomField
                label="Stock"
                name="stock"
                placeholder="67"
                defaultValue={formData.stock}
              />
              <CustomField
                label="Category"
                name="category"
                isSelect
                placeholder="Tops"
                defaultValue={formData.category}
                options={[
                  { value: "tops", label: "Tops" },
                  { value: "bottoms", label: "Bottoms" },
                  { value: "dresses", label: "Dresses" },
                ]}
              />
              <CustomField
                label="Sub - Category"
                name="subCategory"
                isSelect
                placeholder="Formal"
                defaultValue={formData.subCategory}
                options={[
                  { value: "formal", label: "Formal" },
                  { value: "casual", label: "Casual" },
                  { value: "sportswear", label: "Sportswear" },
                ]}
              />
              <CustomField
                label="Est. time of shipping"
                name="shippingTime"
                placeholder="15 days"
                defaultValue={formData.shippingTime}
              />
              <CustomField
                label="Weight in grams"
                name="weight"
                placeholder="Cotton"
                defaultValue={formData.weight}
              />
              <CustomField
                label="Fabric"
                name="fabric"
                isSelect
                placeholder="Cotton"
                defaultValue={formData.fabric}
                options={[
                  { value: "cotton", label: "Cotton" },
                  { value: "linen", label: "Linen" },
                  { value: "silk", label: "Silk" },
                  { value: "denim", label: "Denim" },
                ]}
              />
              <CustomField
                label="Care Instructions"
                name="careInstructions"
                isSelect
                placeholder="Hand wash only"
                defaultValue={formData.careInstructions}
                options={[
                  { value: "hand-wash", label: "Hand wash only" },
                  { value: "dry-clean", label: "Dry clean" },
                  { value: "machine-wash", label: "Machine wash" },
                ]}
              />
            </div>
          </div>

          {/* Variations */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-third mb-6">
                Size Variations
              </h3>
              <VariationRow label="Size 1" />
              <VariationRow label="Size 2" />
              <VariationRow label="Size 3" />
              <button
                type="button"
                className="w-full py-4 border-2 border-third/50 rounded-full flex items-center justify-center hover:bg-third/5 transition-colors bg-gray-50/50"
              >
                <Plus className="text-third w-8 h-8" />
              </button>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-third mb-6">
                Color Variations
              </h3>
              <VariationRow label="Color 1" type="Color" showImageIcon />
              <VariationRow label="Color 2" type="Color" showImageIcon />
              <VariationRow label="Color 3" type="Color" showImageIcon />
              <button
                type="button"
                className="w-full py-4 border-2 border-third/50 rounded-full flex items-center justify-center hover:bg-third/5 transition-colors bg-gray-50/50"
              >
                <Plus className="text-third w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-8 flex justify-end gap-6">
            <button
              type="button"
              onClick={onClose}
              className="px-12 py-3 rounded-full text-xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Discard
            </button>
            <ProfileButton type="submit" variant="orange" size="xl">
              {isEdit ? "Confirm Changes" : "Confirm Product"}
            </ProfileButton>
          </div>
        </form>
      </div>
    </div>
  );
};
