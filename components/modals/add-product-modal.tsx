"use client";

import React, { useState, useRef } from "react";
import { Plus, Image as ImageIcon, X, ChevronDown } from "lucide-react";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { cn } from "@/lib/utils";
import { CustomField } from "@/components/ui/custom-field";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { VariationRow } from "@/components/sewer-center/variation-row";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    console.log("Form Data:", Object.fromEntries(formData.entries()));
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[30px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-10 py-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-primary">Add Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-8 h-8 text-gray-400" />
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
            />
            <CustomField
              label="Description"
              name="description"
              placeholder="Best Design"
              isTextArea
            />

            <div className="grid grid-cols-2 gap-6">
              <CustomField label="Price" name="price" placeholder="PHP67676" />
              <CustomField label="Stock" name="stock" placeholder="67" />
              <CustomField
                label="Category"
                name="category"
                isSelect
                placeholder="Tops"
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
              />
              <CustomField
                label="Weight in grams"
                name="weight"
                placeholder="Cotton"
              />
              <CustomField
                label="Fabric"
                name="fabric"
                isSelect
                placeholder="Cotton"
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
              Confirm Product
            </ProfileButton>
          </div>
        </form>
      </div>
    </div>
  );
};
