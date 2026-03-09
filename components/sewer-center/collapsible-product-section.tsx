"use client";

import React, { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { ProductListItem } from "./product-list-item";
import { cn } from "@/lib/utils";
import { DeleteConfirmationModal } from "@/components/modals/delete-confirmation-modal";

export interface SectionItem {
  id: string;
  name: string;
  type?: string;
}

interface CollapsibleProductSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  items: SectionItem[];
  variant: "product" | "order" | "commission" | "appointment";
  onItemDelete?: (id: string) => Promise<void>;
  onItemEdit?: (item: SectionItem) => void;
}

export const CollapsibleProductSection = ({
  title,
  isOpen,
  onToggle,
  items,
  variant,
  onItemDelete,
  onItemEdit,
}: CollapsibleProductSectionProps) => {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item?: SectionItem }>({
    isOpen: false,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (item: SectionItem) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.item || !onItemDelete) return;
    
    try {
      setIsDeleting(true);
      await onItemDelete(deleteModal.item.id);
      setDeleteModal({ isOpen: false });
    } catch (error) {
      console.error(`Failed to delete ${variant}:`, error);
      alert("Failed to delete item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-primary text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer whitespace-nowrap"
        >
          <ChevronDown
            className={cn(
              "w-8 h-8 transition-transform duration-200",
              !isOpen && "-rotate-90"
            )}
          />
          {title} ({items.length})
        </button>

        <div className="flex-1 relative max-w-xl ml-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-12 pr-4 py-2 rounded-full border-[3px] border-third focus:border-third outline-none bg-white text-lg shadow-sm"
          />
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-primary">
          <Filter className="w-8 h-8" />
        </button>
      </div>

      {/* Section Content */}
      {isOpen && (
        <div 
          className={cn(
            "pl-4 transition-all duration-300",
            items.length > 5 && "max-h-[500px] overflow-y-auto pr-2 custom-scrollbar"
          )}
        >
          {items.map((item, index) => (
            <ProductListItem
              key={item.id}
              index={index + 1}
              name={item.name}
              type={variant === "commission" ? item.type : undefined}
              showEdit={variant === "product"}
              onEdit={() => onItemEdit?.(item)}
              onDelete={() => handleDeleteClick(item)}
            />
          ))}
        </div>
      )}

      {/* Reusable Delete Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        title={`Delete ${variant}`}
        itemName={deleteModal.item?.name || ""}
        isDeleting={isDeleting}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
};
