import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { VariationGroup, ProductVariant } from "./types";
import { CATEGORY_OPTIONS } from "./constants";
import { toAttributeTypeLabel } from "./utils";
import { SectionItem } from "@/components/sewist-center/collapsible-product-section";

export const useProductModalState = (
  isOpen: boolean,
  product?: (SectionItem & { rejectionLogId?: string }) | null
) => {
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
  const [rejectionReason, setRejectionReason] = useState<{ reason: string, comment: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const generateMatrix = () => {
      if (variationGroups.length === 0) {
        setVariants([]);
        return;
      }

      const validGroups = variationGroups.filter(
        (g) => (g.name || "").trim() !== "" && g.options.some((o) => (o || "").trim() !== "")
      );
      
      if (validGroups.length === 0) {
        setVariants([]);
        return;
      }

      const cartesian = (sets: string[][]) => 
        sets.reduce<string[][]>((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]]);

      const optionSets = validGroups.map((g) => g.options.filter((o) => o.trim() !== ""));
      if (optionSets.some((set) => set.length === 0)) {
        setVariants([]);
        return;
      }

      const combinations = cartesian(optionSets);
      
      setVariants((prevVariants) => {
        return combinations.map((combo, idx) => {
          const attributes: Record<string, string> = {};
          validGroups.forEach((group, groupIdx) => {
            attributes[group.name] = combo[groupIdx];
          });

          const productPrefix = (formData.productName || "PROD").substring(0, 5).toUpperCase().replace(/\s+/g, '');
          const nameLabel = `${productPrefix}-${combo.join("-").toUpperCase()}`;

          const existingVariant = prevVariants.find((v) => {
             const existingKeys = Object.keys(v.attributes);
             
             if (prevVariants.length === 1 && combinations.length === 1 && existingKeys.length === 1 && validGroups.length === 1) {
                return String(Object.values(v.attributes)[0] || "").trim().toLowerCase() === String(combo[0] || "").trim().toLowerCase();
             }

             if (existingKeys.length !== validGroups.length) return false;
             
             return existingKeys.every((k) => {
                const targetKey = Object.keys(attributes).find(ak => ak.trim().toLowerCase() === k.trim().toLowerCase());
                if (!targetKey) return false;
                const vValue = String(v.attributes[k] || "").trim().toLowerCase();
                const aValue = String(attributes[targetKey] || "").trim().toLowerCase();
                return vValue === aValue;
             });
          });

          if (existingVariant) {
            return {
              ...existingVariant,
              attributes
            };
          }

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

          if (data.product_images && data.product_images.length > 0) {
            const sortedImages = [...data.product_images].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            setExistingImages(sortedImages.map((img: any) => img.image_url));
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

  const handlePhotoChange = (index: number) => (file: File) => {
    setSelectedImages((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  const addVariationGroup = () => {
    const usedNames = variationGroups.map((g) => g.name);
    const availableNames = ["Color", "Material", "Size"].filter((name) => !usedNames.includes(name));
    
    if (availableNames.length === 0) {
      alert("All variation categories have been added.");
      return;
    }
    
    setVariationGroups([...variationGroups, { id: `g-${Date.now()}`, name: availableNames[0], options: [""] }]);
  };

  const updateGroup = (id: string, updates: Partial<VariationGroup>) => {
    setVariationGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const removeGroup = (id: string) => {
    setVariationGroups((prev) => prev.filter((g) => g.id !== id));
  };

  const updateVariant = (id: string, updates: Partial<ProductVariant>) => {
    setVariants((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  return {
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
  };
};
