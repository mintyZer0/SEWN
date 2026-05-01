"use client";

import React, { useState, useRef } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoSlotProps {
  size?: "sm" | "lg";
  name?: string;
  className?: string;
  onChange?: (file: File) => void;
  onRemove?: () => void;
  defaultImage?: string;
}

export const PhotoSlot = ({ size = "sm", name, className, onChange, onRemove, defaultImage }: PhotoSlotProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onChange) onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (onRemove) onRemove();
  };

  const hasImage = !!(preview || defaultImage);

  return (
    <div
      onClick={handleClick}
      className={cn(
        "border-2 border-third/50 rounded-3xl flex items-center justify-center cursor-pointer hover:bg-third/5 transition-colors group overflow-hidden relative",
        size === "lg" ? "w-full h-full" : "w-full aspect-square",
        className
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        name={name}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      {hasImage ? (
        <>
          <img
            src={preview || defaultImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600 shadow-md"
          >
            <X className="w-4 h-4" />
          </button>
        </>
      ) : (
        <Plus className="text-third w-10 h-10 group-hover:scale-110 transition-transform" />
      )}
    </div>
  );
};
