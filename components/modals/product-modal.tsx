"use client";

import React, { useState, useEffect } from "react";
import { Plus, ArrowLeft, Trash2, Loader2, X } from "lucide-react";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { CustomField } from "@/components/ui/custom-field";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { VariationRow } from "@/components/sewist-center/variation-row";
import { SectionItem } from "@/components/sewist-center/collapsible-product-section";
import { MARKETPLACE_FILTERS } from "@/lib/constants";
import { createClient } from "@/utils/supabase/client";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: (SectionItem & { rejectionLogId?: string }) | null;
  onSave?: (product: Partial<SectionItem> & { images?: File[] }, targetStatus: 'draft' | 'pending') => Promise<void>;
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

const CATEGORY_OPTIONS = MARKETPLACE_FILTERS.Categories.map((category) => ({
  value: category,
  label: category,
}));

const VARIATION_GROUP_OPTIONS = (["Color", "Material", "Size"] as const).map((label) => ({
  value: label,
  label,
}));

const toAttributeTypeLabel = (value: string) => {
  const normalized = value.trim().toLowerCase();
  const matched = VARIATION_GROUP_OPTIONS.find(
    (option) => option.value.toLowerCase() === normalized
  );
  return matched?.value ?? value;
};

const normalizeStockInput = (value: string) => value.replace(/\D/g, "");
const normalizeDecimalInput = (value: string) => {
  const cleaned = value.replace(/[^\d.]/g, "");
  const [whole, ...fractionParts] = cleaned.split(".");
  const fraction = fractionParts.join("").slice(0, 2);
  return fractionParts.length > 0 ? `${whole}.${fraction}` : whole;
};

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
    category: CATEGORY_OPTIONS[0].value,
    location: "NCR",
    type: "Men",
    shippingTime: "",
    weight: "",
    fabric: "cotton",
    careInstructions: "hand-wash",
  });

  const [variationGroups, setVariationGroups] = useState<VariationGroup[]>([]);

  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [selectedImages, setSelectedImages] = useState<(File | null)[]>(Array(7).fill(null));
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  const supabase = createClient();

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
      
      setVariants(prevVariants => {
        const newVariants = combinations.map((combo, idx) => {
          const attributes: Record<string, string> = {};
          validGroups.forEach((group, groupIdx) => {
            attributes[group.name] = combo[groupIdx];
          });

          // Generate a unique SKU prefix using the product name
          const productPrefix = (formData.productName || "PROD").substring(0, 5).toUpperCase().replace(/\s+/g, '');
          const nameLabel = `${productPrefix}-${combo.join("-").toUpperCase()}`;

          const existingVariant = prevVariants.find(v => {
             const existingKeys = Object.keys(v.attributes);
             
             // Lenient match for single variant: if both have 1 attribute and values match
             if (prevVariants.length === 1 && combinations.length === 1 && existingKeys.length === 1 && validGroups.length === 1) {
                const matches = String(Object.values(v.attributes)[0] || "").trim().toLowerCase() === String(combo[0] || "").trim().toLowerCase();
                return matches;
             }

             if (existingKeys.length !== validGroups.length) {
                return false;
             }
             
             const isMatch = existingKeys.every(k => {
                const targetKey = Object.keys(attributes).find(ak => ak.trim().toLowerCase() === k.trim().toLowerCase());
                if (!targetKey) {
                   return false;
                }
                const vValue = String(v.attributes[k] || "").trim().toLowerCase();
                const aValue = String(attributes[targetKey] || "").trim().toLowerCase();
                const matches = vValue === aValue;
                return matches;
             });

             return isMatch;
          });

          if (existingVariant) {
            return {
              ...existingVariant,
              attributes // Update attributes to match the current group names exactly
            };
          }

          // Add a short random suffix to new SKUs to ensure global uniqueness
          const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
          const uniqueSku = `${nameLabel}-${randomSuffix}`;

          return {
            id: `var-${idx}-${Date.now()}`,
            attributes,
            sku: uniqueSku,
            price: "",
            stock: "0",
          };
        });
        return newVariants;
      });
    };

    generateMatrix();
  }, [variationGroups, formData.productName]);

  useEffect(() => {
    async function fetchFullProduct() {
      if (product && isOpen) {
        const { data, error } = await supabase
          .from('sewist_products')
          .select(`
            *,
            product_categories (category),
            product_images (image_url, is_main, display_order),
            product_variants (
              id,
              sku,
              stock_quantity,
              price_override,
              variant_attribute_values (
                attribute_type,
                attribute_value
              )
            )
          `)
          .eq('id', product.id)
          .single();

        if (data) {
          const rawCategoryValue = Array.isArray(data.product_categories)
            ? data.product_categories[0]?.category
            : data.product_categories?.category;
          
          const categoryValue = CATEGORY_OPTIONS.some((option) => option.value === rawCategoryValue)
            ? rawCategoryValue
            : CATEGORY_OPTIONS[0].value;

          setFormData((prev) => ({
            ...prev,
            productName: data.name || product.name || "",
            description: data.description || "",
            price: data.price ? String(data.price) : "",
            category: categoryValue,
            location: data.location || "NCR",
            type: data.type || "Men",
            weight: data.weight ? String(data.weight) : "",
            fabric: data.fabric || "cotton",
            careInstructions: data.care_instructions || "hand-wash",
            shippingTime: data.shipping_time || "",
          }));

          // Set existing images
          if (data.product_images && data.product_images.length > 0) {
            const sortedImages = [...data.product_images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setExistingImages(sortedImages.map(img => img.image_url));
          } else {
            setExistingImages([]);
          }

          if (data.product_variants && data.product_variants.length > 0) {
            const fetchedVariants: ProductVariant[] = data.product_variants.map((v: any) => {
              const attributes: Record<string, string> = {};
              v.variant_attribute_values?.forEach((attr: any) => {
                const label = toAttributeTypeLabel(String(attr.attribute_type ?? ""));
                attributes[label] = attr.attribute_value;
              });
              return {
                id: v.id,
                sku: v.sku || "",
                stock: v.stock_quantity !== undefined && v.stock_quantity !== null ? String(v.stock_quantity) : "0",
                price: v.price_override !== undefined && v.price_override !== null ? String(v.price_override) : "",
                attributes
              };
            });
            setVariants(fetchedVariants);

            const groupsMap: Record<string, Set<string>> = {};
            data.product_variants.forEach((v: any) => {
              v.variant_attribute_values?.forEach((attr: any) => {
                const label = toAttributeTypeLabel(String(attr.attribute_type ?? ""));
                if (!groupsMap[label]) {
                  groupsMap[label] = new Set();
                }
                groupsMap[label].add(attr.attribute_value);
              });
            });

            const fetchedGroups: VariationGroup[] = Object.entries(groupsMap).map(([name, optionsSet], idx) => ({
              id: `g-fetch-${idx}-${Date.now()}`,
              name,
              options: Array.from(optionsSet as Set<string>)
            }));
            
            setVariationGroups(fetchedGroups);
          } else {
            setVariationGroups([]);
            setVariants([]);
          }
        } else {
          setFormData((prev) => ({ ...prev, productName: product.name }));
        }
      } else if (!product && isOpen) {
        setFormData({
          productName: "",
          description: "",
          price: "",
          category: CATEGORY_OPTIONS[0].value,
          location: "NCR",
          type: "Men",
          shippingTime: "",
          weight: "",
          fabric: "cotton",
          careInstructions: "hand-wash",
        });
        setVariationGroups([]);
        setVariants([]);
        setExistingImages([]);
        setSelectedImages(Array(7).fill(null));
      }
    }
    fetchFullProduct();
  }, [product, isOpen, supabase]);

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

  const handlePhotoChange = (index: number) => (file: File) => {
    setSelectedImages(prev => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const [rejectionReason, setRejectionReason] = useState<{ reason: string, comment: string } | null>(null);

  useEffect(() => {
    async function fetchRejectionReason() {
      if (product?.rejectionLogId && product?.type === 'rejected') {
        const { data } = await supabase
          .from('product_rejection_logs')
          .select('reason_code, custom_comment')
          .eq('id', product.rejectionLogId)
          .single();
        
        if (data) {
          setRejectionReason({ reason: data.reason_code, comment: data.custom_comment });
        }
      } else {
        setRejectionReason(null);
      }
    }

    if (isOpen) {
      fetchRejectionReason();
    }
  }, [product, isOpen, supabase]);

  if (!isOpen) return null;

  const addVariationGroup = () => {
    const usedNames = variationGroups.map(g => g.name);
    const availableNames = ["Color", "Material", "Size"].filter(name => !usedNames.includes(name));
    
    if (availableNames.length === 0) {
      alert("All variation categories have been added.");
      return;
    }
    
    setVariationGroups([...variationGroups, { id: `g-${Date.now()}`, name: availableNames[0], options: [""] }]);
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

    const hasImages = existingImages.length > 0 || selectedImages.some(img => img !== null);
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
          variants: variants.map(v => ({
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
          {/* Photos Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-third">Add photos</h3>
            <div className="grid grid-cols-5 gap-4">
              {/* Large Main Slot (Left) */}
              <div className="col-span-2 row-span-2">
                <PhotoSlot 
                  size="lg" 
                  className="h-full" 
                  onChange={handlePhotoChange(0)}
                  defaultImage={existingImages[0]}
                />
              </div>
              {/* 6 Small Slots (Right) */}
              {[1, 2, 3, 4, 5, 6].map(i => (
                <PhotoSlot 
                  key={i} 
                  onChange={handlePhotoChange(i)} 
                  defaultImage={existingImages[i]}
                />
              ))}
            </div>
            <p className="text-sm text-gray-400 italic">* Select up to 7 photos. First photo is main.</p>
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
                  onChange={(e: any) => setFormData({...formData, price: normalizeDecimalInput(e.target.value)})}
                  inputMode="decimal"
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

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  label="Category"
                  isSelect
                  value={formData.category}
                  onChange={(e: any) => setFormData({...formData, category: e.target.value})}
                  options={CATEGORY_OPTIONS}
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
                  onChange={(e: any) => setFormData({...formData, weight: normalizeDecimalInput(e.target.value)})}
                  inputMode="decimal"
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
                      <div className="flex flex-col gap-1">
                        <CustomField
                          label="Variant Category"
                          isSelect
                          value={group.name}
                          onValueChange={(val) => updateGroup(group.id, { name: val, options: [""] })}
                          options={VARIATION_GROUP_OPTIONS.map((option) => ({
                            ...option,
                            disabled: variationGroups.some(
                              (g) => g.id !== group.id && g.name === option.value
                            ),
                          }))}
                          containerClassName="mt-0"
                        />
                        {variationGroups.some(g => g.id !== group.id && g.name === group.name) && (
                          <span className="text-[10px] text-rose-500 font-bold uppercase ml-4">Already selected</span>
                        )}
                      </div>
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
                            readOnly
                            className="w-full bg-transparent border-b border-gray-200 outline-none text-sm py-1 text-gray-400 cursor-not-allowed"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={v.stock} 
                            onChange={(e) => {
                              updateVariant(v.id, { stock: normalizeStockInput(e.target.value) });
                            }}
                            className="w-32 bg-transparent border-b border-gray-200 focus:border-third outline-none text-sm py-1"
                          />
                        </td>
                        <td className="px-6 py-4 rounded-r-2xl">
                          <input 
                            type="text" 
                            placeholder="Optional"
                            value={v.price} 
                            onChange={(e) => updateVariant(v.id, { price: normalizeDecimalInput(e.target.value) })}
                            inputMode="decimal"
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
