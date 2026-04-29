import { SectionItem } from "@/components/sewist-center/collapsible-product-section";

export interface VariationGroup {
  id: string;
  name: string;
  options: string[];
}

export interface ProductVariant {
  id: string;
  attributes: Record<string, string>; // { "Color": "Red", "Size": "Small" }
  sku: string;
  price: string;
  stock: string;
}

export interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: (SectionItem & { rejectionLogId?: string }) | null;
  onSave?: (product: Partial<SectionItem> & { images?: File[] }, targetStatus: 'draft' | 'pending') => Promise<void>;
}
