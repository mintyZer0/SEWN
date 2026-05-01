"use client";

import React from "react";
import { SquarePen, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductListItemProps {
  index: number;
  name: string;
  type?: string;
  showEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
}

export const ProductListItem = ({
  index,
  name,
  type,
  showEdit = false,
  onEdit,
  onDelete,
  onClick,
}: ProductListItemProps) => (
  <div className="bg-white rounded-full md:rounded-2xl py-2 px-6 md:py-4 md:px-8 mb-2 flex items-center justify-between shadow-sm border border-gray-100/50 group hover:border-third-light/30 transition-colors">
    <div 
      className="flex items-center gap-2 md:gap-4 text-base md:text-xl text-primary-dark font-medium flex-1 cursor-pointer min-w-0"
      onClick={onClick}
    >
      <span className="shrink-0">{index}.</span>
      <span className="truncate">({name})</span>
    </div>

    <div className="flex items-center gap-2 md:gap-6 shrink-0">
      {showEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit?.();
          }}
          className="text-primary hover:text-third transition-colors cursor-pointer p-1"
        >
          <SquarePen className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
        </button>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className="text-primary hover:text-red-500 transition-all cursor-pointer p-1"
      >
        <Trash2 className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
      </button>
    </div>
  </div>
);
