"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ProfileButton } from "@/components/user-profile/profile-buttons";

import { ProductModalProps } from "./product-modal-components/types";
import { useProductModalState } from "./product-modal-components/useProductModalState";
import { ProductPhotos } from "./product-modal-components/ProductPhotos";
import { ProductBasicInfo } from "./product-modal-components/ProductBasicInfo";
import { ProductVariationGroups } from "./product-modal-components/ProductVariationGroups";
import { ProductInventoryMatrix } from "./product-modal-components/ProductInventoryMatrix";

export const ProductModal = ({
  isOpen,
  onClose,
  product,
  onSave,
}: ProductModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    formData,
    setFormData,
    variationGroups,
    variants,
    selectedImages,
    existingImages,
    rejectionReason,
    handlePhotoChange,
    addVariationGroup,
    updateGroup,
    removeGroup,
    updateVariant,
  } = useProductModalState(isOpen, product);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent, targetStatus: 'draft' | 'pending' = 'pending') => {
    if (e) e.preventDefault();
    const decimalPattern = /^\d+(\.\d{1,2})?$/;

    if (!formData.productName?.trim()) {
      alert("Product name is required");
      return;
    }

    if (!formData.price || !decimalPattern.test(formData.price) || Number(formData.price) <= 0) {
      alert("Valid base price is required");
      return;
    }

    if (!formData.category?.trim()) {
      alert("Product category is required");
      return;
    }

    if (variants.length === 0) {
      alert("At least one product variant is required. Please add variation groups (e.g., Size or Color).");
      return;
    }

    const hasInvalidStock = variants.some((variant) => {
      const stock = variant.stock?.trim() ?? "";
      return stock === "" || !/^\d+$/.test(stock);
    });

    if (hasInvalidStock) {
      alert("Stock must be a whole number (0 or greater) for every variant.");
      return;
    }

    const hasInvalidVariantPrice = variants.some((variant) => {
      const variantPrice = variant.price?.trim() ?? "";
      return variantPrice !== "" && !decimalPattern.test(variantPrice);
    });

    if (hasInvalidVariantPrice) {
      alert("Price override must be a valid number with up to 2 decimal places.");
      return;
    }

    if (formData.weight?.trim() && !decimalPattern.test(formData.weight.trim())) {
      alert("Weight must be a valid number with up to 2 decimal places.");
      return;
    }

    const hasImages = existingImages.length > 0 || selectedImages.some((img) => img !== null);
    if (!hasImages) {
      alert("At least one product image is required.");
      return;
    }
    
    if (onSave) {
      try {
        setIsSubmitting(true);
        await onSave({
          id: product?.id,
          ...formData,
          name: formData.productName, // Map productName to name for DB
          price: Number(formData.price),
          img_src: existingImages[0],
          images: selectedImages.filter((img): img is File => img !== null),
          variants: variants.map((v) => ({
            id: v.id,
            sku: v.sku,
            price: v.price ? Number(v.price) : null,
            stock: Number(v.stock),
            attributes: v.attributes
          })),
        } as any, targetStatus);
        onClose();
      } catch (error) {
        console.error("Failed to save product:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isEdit = !!product;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl w-full max-w-4xl max-h-full overflow-y-auto shadow-2xl custom-scrollbar">
        {/* Header */}
        <div className="sticky top-0 bg-white z-20 px-10 pt-12 pb-6 flex justify-between items-start border-b border-gray-100">
          <div className="flex flex-col gap-2">
            <h2 className="text-6xl font-bold text-third">
              {isEdit ? "Edit Product" : "Add Product"}
            </h2>
            {product?.type === 'rejected' && rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mt-2">
                <p className="text-red-700 font-bold text-sm uppercase">Rejection Feedback:</p>
                <p className="text-red-600 font-medium text-sm">Reason: {rejectionReason.reason}</p>
                {rejectionReason.comment && <p className="text-red-500 text-xs mt-1 italic">"{rejectionReason.comment}"</p>}
              </div>
            )}
            <p className="text-third font-medium">
              Adding new products will be inspected first by SEWN
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-12 h-12 text-third" />
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'pending')} className="p-10 space-y-12">
          <ProductPhotos 
            existingImages={existingImages} 
            handlePhotoChange={handlePhotoChange} 
          />

          <ProductBasicInfo 
            formData={formData} 
            setFormData={setFormData} 
          />

          <ProductVariationGroups 
            variationGroups={variationGroups}
            addVariationGroup={addVariationGroup}
            removeGroup={removeGroup}
            updateGroup={updateGroup}
          />

          <ProductInventoryMatrix 
            variants={variants}
            updateVariant={updateVariant}
          />

          {/* Footer Actions */}
          <div className="pt-8 flex justify-end gap-6 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-12 py-3 rounded-full text-xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
            >
              Discard
            </button>
            <ProfileButton 
              type="button"
              variant="white"
              size="xl"
              onClick={(e: any) => handleSubmit(e, 'draft')}
              disabled={isSubmitting || product?.type === 'pending'}
            >
              Save as Draft
            </ProfileButton>
            <ProfileButton 
              type="submit" 
              variant="orange" 
              size="xl"
              disabled={isSubmitting || product?.type === 'pending'}
              className="flex items-center gap-3"
            >
              {isSubmitting && <Loader2 className="w-6 h-6 animate-spin" />}
              {product?.type === 'pending' ? "Under Review" : (product?.type === 'rejected' ? "Resubmit for Review" : "Submit for Review")}
            </ProfileButton>
          </div>
        </form>
      </div>
    </div>
  );
};
