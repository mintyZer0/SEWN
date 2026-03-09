"use client";

import React, { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoSlotProps {
  size?: "sm" | "lg";
  className?: string;
  onChange?: (file: File) => void;
}

export const PhotoSlot = ({ size = "sm", className, onChange }: PhotoSlotProps) => {
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
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-full object-cover"
        />
      ) : (
        <Plus className="text-third w-10 h-10 group-hover:scale-110 transition-transform" />
      )}
    </div>
  );
};
