"use client";

import React from "react";
import { Pencil, Trash2 } from "lucide-react";
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
  <div className="bg-white rounded-2xl p-5 mb-4 flex items-center justify-between shadow-md hover:shadow-lg transition-all border border-gray-100/50">
    <div 
      className="flex items-center gap-4 text-xl text-gray-700 flex-1 cursor-pointer"
      onClick={onClick}
    >
      <span className="font-medium">{index}.</span>
      <span>{name}</span>
    </div>

    <div className="flex items-center gap-4">
      {type && (
        <span className={cn(
          "text-lg border-l border-gray-200 pl-6 h-8 min-w-24 flex items-center font-bold uppercase tracking-tighter",
          type === "pending" ? "text-orange-500" : 
          type === "accepted" ? "text-green-500" : "text-gray-400"
        )}>
          {type}
        </span>
      )}
...
      {showEdit && (
        <button
          onClick={onEdit}
          className="text-gray-600 hover:text-primary transition-colors cursor-pointer"
        >
          <Pencil className="w-6 h-6" />
        </button>
      )}
      <button
        onClick={onDelete}
        className="text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
      >
        <Trash2 className="w-6 h-6" />
      </button>
    </div>
  </div>
);
