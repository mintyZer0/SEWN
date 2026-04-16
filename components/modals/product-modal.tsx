"use client";

import React, { useState, useEffect } from "react";
import { Plus, ArrowLeft, Trash2, Loader2, X } from "lucide-react";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { CustomField } from "@/components/ui/custom-field";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { VariationRow } from "@/components/sewer-center/variation-row";
import { SectionItem } from "@/components/sewer-center/collapsible-product-section";
import { MARKETPLACE_FILTERS } from "@/lib/constants";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: SectionItem | null;
  onSave?: (product: Partial<SectionItem>) => Promise<void>;
}

interface VariationGroup {
  id: string;
  name: string;
  options: string[];
}

interface ProductVariant {
  id: string;
  attributes: Record<string, string>; // { "Color": "Red", "Size": "Small" }
  sku: string;
  price: string;
  stock: string;
}

export const ProductModal = ({
  isOpen,
  onClose,
  product,
  onSave,
}: ProductModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productName: "",
    description: "",
    price: "",
    category: "Men",
    location: "NCR",
    type: "Men",
    shippingTime: "",
    weight: "",
    fabric: "cotton",
    careInstructions: "hand-wash",
  });

  const [variationGroups, setVariationGroups] = useState<VariationGroup[]>([]);

  const [variants, setVariants] = useState<ProductVariant[]>([]);

  // Auto-generate variants matrix when groups or options change
  useEffect(() => {
    const generateMatrix = () => {
      if (variationGroups.length === 0) {
        setVariants([]);
        return;
      }

      // Filter groups with valid names and at least one non-empty option
      const validGroups = variationGroups.filter(g => (g.name || "").trim() !== "" && g.options.some(o => (o || "").trim() !== ""));
      
      if (validGroups.length === 0) {
        setVariants([]);
        return;
      }

      // Helper for cartesian product
      const cartesian = (sets: string[][]) => 
        sets.reduce<string[][]>((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]]);

      const optionSets = validGroups.map(g => g.options.filter(o => o.trim() !== ""));
      if (optionSets.some(set => set.length === 0)) {
        setVariants([]);
        return;
      }

      const combinations = cartesian(optionSets);
      
      const newVariants = combinations.map((combo, idx) => {
        const attributes: Record<string, string> = {};
        validGroups.forEach((group, groupIdx) => {
          attributes[group.name] = combo[groupIdx];
        });

        const nameLabel = combo.join("-").toUpperCase();

        return {
          id: `var-${idx}-${Date.now()}`,
          attributes,
          sku: nameLabel,
          price: "",
          stock: "0",
        };
      });

      setVariants(newVariants);
    };

    generateMatrix();
  }, [variationGroups, formData.productName]);

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
        category: "Men",
        location: "NCR",
        type: "Men",
        shippingTime: "",
        weight: "",
        fabric: "cotton",
        careInstructions: "hand-wash",
      });
      setVariationGroups([]);
    }
  }, [product, isOpen]);

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

  const addVariationGroup = () => {
    setVariationGroups([...variationGroups, { id: `g-${Date.now()}`, name: "Color", options: [""] }]);
  };

  const updateGroup = (id: string, updates: Partial<VariationGroup>) => {
    setVariationGroups(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const removeGroup = (id: string) => {
    setVariationGroups(prev => prev.filter(g => g.id !== id));
  };

  const updateVariant = (id: string, updates: Partial<ProductVariant>) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productName?.trim()) {
      alert("Product name is required");
      return;
    }

    if (!formData.price || isNaN(Number(formData.price))) {
      alert("Valid base price is required");
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
          variants: variants.map(v => ({
            sku: v.sku,
            price: v.price ? Number(v.price) : null,
            stock: Number(v.stock),
            attributes: v.attributes
          })),
        } as any);
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
        <div className="sticky top-0 bg-white z-20 px-10 pt-12 pb-6 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <h2 className="text-6xl font-bold text-third">
              {isEdit ? "Edit Product" : "Add Product"}
            </h2>
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

        <form onSubmit={handleSubmit} className="p-10 space-y-12">
          {/* Photos Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-third">Add photos</h3>
            <div className="grid grid-cols-5 gap-4">
              {/* Large Main Slot (Left) */}
              <div className="col-span-2 row-span-2">
                <PhotoSlot size="lg" className="h-full" />
              </div>
              {/* 6 Small Slots (Right) */}
              <PhotoSlot />
              <PhotoSlot />
              <PhotoSlot />
              <PhotoSlot />
              <PhotoSlot />
              <PhotoSlot />
            </div>
            <p className="text-sm text-gray-400 italic">* Image uploading coming soon</p>
          </div>

          {/* Core Info */}
          <div className="space-y-8">
             <h3 className="text-2xl font-bold text-third border-b border-third/10 pb-2">Basic Information</h3>
             <div className="grid grid-cols-1 gap-6">
                <CustomField
                  label="Product Name"
                  placeholder="SEWN TShirt"
                  value={formData.productName || ""}
                  onChange={(e: any) => setFormData({...formData, productName: e.target.value})}
                  required
                />
                <CustomField
                  label="Description"
                  placeholder="Tell buyers about your product..."
                  isTextArea
                  value={formData.description || ""}
                  onChange={(e: any) => setFormData({...formData, description: e.target.value})}
                />
             </div>

             <div className="grid grid-cols-2 gap-6">
                <CustomField
                  label="Base Price (PHP)"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e: any) => setFormData({...formData, price: e.target.value})}
                  required
                />
                <CustomField
                  label="Shipping Region"
                  isSelect
                  value={formData.location}
                  onChange={(e: any) => setFormData({...formData, location: e.target.value})}
                  options={[
                    { value: "NCR", label: "NCR" },
                    { value: "Luzon", label: "Luzon" },
                    { value: "Visayas", label: "Visayas" },
                    { value: "Mindanao", label: "Mindanao" },
                  ]}
                />
             </div>

             <div className="grid grid-cols-2 gap-6">
                <CustomField
                  label="Target Audience"
                  isSelect
                  value={formData.type}
                  onChange={(e: any) => setFormData({...formData, type: e.target.value})}
                  options={[
                    { value: "Men", label: "Men" },
                    { value: "Women", label: "Women" },
                    { value: "Kids", label: "Kids" },
                  ]}
                />
                <CustomField
                  label="Est. Shipping Time"
                  placeholder="e.g. 7-10 days"
                  value={formData.shippingTime}
                  onChange={(e: any) => setFormData({...formData, shippingTime: e.target.value})}
                />
             </div>

             <div className="grid grid-cols-2 gap-6">
                <CustomField
                  label="Weight in grams"
                  placeholder="0.00"
                  value={formData.weight}
                  onChange={(e: any) => setFormData({...formData, weight: e.target.value})}
                />
                <CustomField
                  label="Fabric"
                  isSelect
                  value={formData.fabric}
                  onChange={(e: any) => setFormData({...formData, fabric: e.target.value})}
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
                  onChange={(e: any) => setFormData({...formData, careInstructions: e.target.value})}
                  options={[
                    { value: "hand-wash", label: "Hand wash only" },
                    { value: "dry-clean", label: "Dry clean" },
                    { value: "machine-wash", label: "Machine wash" },
                  ]}
                />
             </div>
          </div>

          {/* Variation Groups Setup */}
          <div className="space-y-8">
            <div className="flex justify-between items-center border-b border-third/10 pb-2">
              <h3 className="text-2xl font-bold text-third">Variation Groups</h3>
              <button 
                type="button" 
                onClick={addVariationGroup}
                className="text-primary font-bold hover:underline flex items-center gap-1"
              >
                <Plus size={16} /> Add Group
              </button>
            </div>

            <div className="space-y-6">
              {variationGroups.length === 0 ? (
                <div className="p-10 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/30 flex flex-col items-center text-center">
                   <p className="text-gray-400 font-medium mb-1">No variations yet</p>
                   <p className="text-sm text-gray-400/70">Add groups like "Size" or "Color" to create product variations.</p>
                </div>
              ) : (
                variationGroups.map((group) => (
                  <div key={group.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 relative group">
                    <button 
                      type="button" 
                      onClick={() => removeGroup(group.id)}
                      className="absolute top-4 right-4 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={20} />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-4 ">
                      <CustomField
                        label="Variant Category"
                        isSelect
                        value={group.name}
                        onValueChange={(val) => updateGroup(group.id, { name: val, options: [""] })}
                        options={[
                          { value: "Color", label: "Color" },
                          { value: "Material", label: "Material" },
                          { value: "Size", label: "Size" },
                        ]}
                        containerClassName="mt-0"
                      />
                      <div className="md:col-span-2 relative">
                        <label className="absolute -top-3 left-6 bg-white px-2 text-third font-bold text-sm z-10 whitespace-nowrap uppercase tracking-tight">
                          Options
                        </label>
                        
                        {["Color", "Material", "Size"].includes(group.name) ? (
                          <div className="space-y-3">
                            <CustomField
                              label=""
                              placeholder={`Select ${group.name}`}
                              isSelect
                              value=""
                              onValueChange={(val) => {
                                if (!group.options.includes(val)) {
                                  updateGroup(group.id, { options: [...group.options.filter(o => o !== ""), val] });
                                }
                              }}
                              options={MARKETPLACE_FILTERS[group.name as keyof typeof MARKETPLACE_FILTERS].map(opt => ({ value: opt, label: opt }))}
                              containerClassName="mt-0"
                            />
                            <div className="flex flex-wrap gap-2 px-2">
                              {group.options.filter(o => o !== "").map((opt) => (
                                <span 
                                  key={opt} 
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-third/10 text-third rounded-full text-sm font-bold border border-third/20 animate-in fade-in zoom-in-95 duration-200"
                                >
                                  {opt}
                                  <button 
                                    type="button"
                                    onClick={() => updateGroup(group.id, { options: group.options.filter(o => o !== opt) })}
                                    className="hover:bg-third/20 rounded-full p-0.5 transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                </span>
                              ))}
                              {group.options.filter(o => o !== "").length === 0 && (
                                <span className="text-gray-400 text-sm italic py-1">No {group.name.toLowerCase()}s selected</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <input
                            type="text"
                            placeholder="e.g. Red, Blue, Green"
                            value={group.options.join(", ")}
                            onChange={(e) => updateGroup(group.id, { options: e.target.value.split(",").map(o => o.trim()) })}
                            className="w-full px-6 py-3 rounded-full border-2 border-third/50 focus:border-third outline-none transition-all bg-white h-14 text-gray-700"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* The Matrix (Inventory Management) */}
          {variants.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-third border-b border-third/10 pb-2">Variant Inventory Matrix</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm uppercase font-bold tracking-wider">
                      <th className="px-6 py-2">Variant</th>
                      <th className="px-6 py-2">SKU</th>
                      <th className="px-6 py-2">Stock</th>
                      <th className="px-6 py-2">Price Override</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((v) => (
                      <tr key={v.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden group">
                        <td className="px-6 py-4 font-bold text-primary bg-gray-50/50 rounded-l-2xl">
                          {Object.values(v.attributes).join(" / ")}
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="text" 
                            value={v.sku} 
                            onChange={(e) => updateVariant(v.id, { sku: e.target.value })}
                            className="w-full bg-transparent border-b border-gray-200 focus:border-third outline-none text-sm py-1"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="number" 
                            value={v.stock} 
                            onChange={(e) => updateVariant(v.id, { stock: e.target.value })}
                            className="w-32 bg-transparent border-b border-gray-200 focus:border-third outline-none text-sm py-1"
                          />
                        </td>
                        <td className="px-6 py-4 rounded-r-2xl">
                          <input 
                            type="text" 
                            placeholder="Optional"
                            value={v.price} 
                            onChange={(e) => updateVariant(v.id, { price: e.target.value })}
                            className="w-32 bg-transparent border-b border-gray-200 focus:border-third outline-none text-sm py-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
              type="submit" 
              variant="orange" 
              size="xl"
              disabled={isSubmitting}
              className="flex items-center gap-3"
            >
              {isSubmitting && <Loader2 className="w-6 h-6 animate-spin" />}
              {isEdit ? "Confirm Changes" : "Confirm Product"}
            </ProfileButton>
          </div>
        </form>
      </div>
    </div>
  );
};

