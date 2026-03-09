"use client";

import React, { useState } from "react";
import { Plus, Image as ImageIcon, X, ChevronDown } from "lucide-react";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { cn } from "@/lib/utils";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CustomField = ({
  label,
  placeholder,
  type = "text",
  isTextArea = false,
  className,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  isTextArea?: boolean;
  className?: string;
}) => (
  <div className={cn("relative mt-4", className)}>
    <label className="absolute -top-3 left-6 bg-white px-2 text-third font-bold text-sm z-10">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        placeholder={placeholder}
        rows={4}
        className="w-full border-2 border-third/50 rounded-[22px] px-6 py-4 outline-none focus:border-third transition-colors text-gray-700 resize-none"
      />
    ) : (
      <div className="relative flex items-center">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full border-2 border-third/50 rounded-full px-6 py-3 outline-none focus:border-third transition-colors text-gray-700 h-[54px]"
        />
        {(label.includes("Category") ||
          label.includes("Fabric") ||
          label.includes("Instructions")) && (
          <ChevronDown className="absolute right-4 text-third w-6 h-6" />
        )}
      </div>
    )}
  </div>
);

const PhotoSlot = ({ size = "sm" }: { size?: "sm" | "lg" }) => (
  <div
    className={cn(
      "border-2 border-third/50 rounded-3xl flex items-center justify-center cursor-pointer hover:bg-third/5 transition-colors group",
      size === "lg" ? "w-full h-full" : "w-full aspect-square",
    )}
  >
    <Plus className="text-third w-10 h-10 group-hover:scale-110 transition-transform" />
  </div>
);

const VariationRow = ({
  label,
  type = "Size",
  showImageIcon = false,
}: {
  label: string;
  type?: string;
  showImageIcon?: boolean;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mb-4">
    <CustomField
      label={label}
      placeholder={type === "Size" ? "Small - 34" : "Red"}
    />
    <div className="flex gap-2 items-center">
      <CustomField label="Price" className="flex-1" />
      {showImageIcon && (
        <button className="p-3 border-2 border-third/50 rounded-2xl text-third hover:bg-third/5 transition-colors mt-4">
          <ImageIcon className="w-8 h-8" />
        </button>
      )}
    </div>
  </div>
);

export const AddProductModal = ({ isOpen, onClose }: AddProductModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-[40px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar">
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

        <div className="p-10 space-y-8">
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
            <CustomField label="Product Name" placeholder="SEWN TShirt" />
            <CustomField
              label="Description"
              placeholder="Best Design"
              isTextArea
            />

            <div className="grid grid-cols-2 gap-6">
              <CustomField label="Price" placeholder="PHP67676" />
              <CustomField label="Stock" placeholder="67" />
              <CustomField label="Category" placeholder="Tops" />
              <CustomField label="Sub - Category" placeholder="Formal" />
              <CustomField
                label="Est. time of shipping"
                placeholder="15 days"
              />
              <CustomField label="Weight in grams" placeholder="Cotton" />
              <CustomField label="Fabric" placeholder="Cotton" />
              <CustomField
                label="Care Instructions"
                placeholder="Hand wash only"
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
              <button className="w-full py-4 border-2 border-third/50 rounded-full flex items-center justify-center hover:bg-third/5 transition-colors bg-gray-50/50">
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
              <button className="w-full py-4 border-2 border-third/50 rounded-full flex items-center justify-center hover:bg-third/5 transition-colors bg-gray-50/50">
                <Plus className="text-third w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-8 flex justify-end gap-6">
            <button
              onClick={onClose}
              className="px-12 py-3 rounded-full text-xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Discard
            </button>
            <ProfileButton variant="orange" size="xl">
              Confirm Product
            </ProfileButton>
          </div>
        </div>
      </div>
    </div>
  );
};
