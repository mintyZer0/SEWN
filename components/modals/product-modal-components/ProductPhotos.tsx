import React from "react";
import { PhotoSlot } from "@/components/ui/photo-slot";

interface ProductPhotosProps {
  photos: { file: File | null; url: string | null }[];
  handlePhotoChange: (index: number) => (file: File) => void;
  handlePhotoRemove: (index: number) => () => void;
}

export const ProductPhotos = ({ photos, handlePhotoChange, handlePhotoRemove }: ProductPhotosProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-third">Add photos</h3>
      <div className="grid grid-cols-5 gap-4">
        {/* Large Main Slot (Left) */}
        <div className="col-span-2 row-span-2">
          <PhotoSlot 
            size="lg" 
            className="h-full" 
            onChange={handlePhotoChange(0)}
            onRemove={handlePhotoRemove(0)}
            defaultImage={photos[0]?.url || undefined}
          />
        </div>
        {/* 6 Small Slots (Right) */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <PhotoSlot 
            key={i} 
            onChange={handlePhotoChange(i)} 
            onRemove={handlePhotoRemove(i)}
            defaultImage={photos[i]?.url || undefined}
          />
        ))}
      </div>
      <p className="text-sm text-gray-400 italic">* Select up to 7 photos. First photo is main.</p>
    </div>
  );
};
