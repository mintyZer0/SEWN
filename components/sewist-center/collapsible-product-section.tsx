"use client";

import React, { useState } from "react";
import { Search, ListFilter, ChevronDown } from "lucide-react";
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
  onItemClick?: (item: SectionItem) => void;
}

export const CollapsibleProductSection = ({
  title,
  isOpen,
  onToggle,
  items,
  variant,
  onItemDelete,
  onItemEdit,
  onItemClick,
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
    <section className="mb-8 md:mb-12">
      {/* Section Header */}
      <div className="flex items-center gap-2 md:gap-4 mb-4">
        <button
          onClick={onToggle}
          className="flex items-center gap-1 text-primary hover:opacity-80 transition-opacity cursor-pointer shrink-0"
        >
          <ChevronDown
            className={cn(
              "w-6 h-6 md:w-8 md:h-8 transition-transform duration-200",
              !isOpen && "-rotate-90"
            )}
            strokeWidth={3}
          />
          <span className="text-xl md:text-3xl font-bold">{title}</span>
          <span className="text-xl md:text-3xl font-bold ml-1">({items.length})</span>
        </button>

        <div className="flex-1 relative">
          <div className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-primary">
            <Search className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
          </div>
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-9 md:pl-12 pr-4 py-1 md:py-1.5 rounded-full border-[2.5px] md:border-[3.5px] border-third-light focus:border-third outline-none bg-white text-sm md:text-lg shadow-sm placeholder:text-gray-400 transition-colors"
          />
        </div>

        <button className="p-1 hover:opacity-70 transition-all cursor-pointer text-primary shrink-0">
          <ListFilter className="w-6 h-6 md:w-9 md:h-9" strokeWidth={2.5} />
        </button>
      </div>

      {/* Section Content */}
      {isOpen && (
        <div 
          className={cn(
            "pl-4 transition-all duration-300",
            items.length > 5 && "max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
          )}
        >
          {items.map((item, index) => (
            <ProductListItem
              key={item.id}
              index={index + 1}
              name={item.name}
              type={item.type}
              showEdit={variant === "product"}
              onEdit={() => onItemEdit?.(item)}
              onDelete={() => handleDeleteClick(item)}
              onClick={() => onItemClick?.(item)}
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
