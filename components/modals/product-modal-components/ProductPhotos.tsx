import React from "react";
import { PhotoSlot } from "@/components/ui/photo-slot";

interface ProductPhotosProps {
  existingImages: string[];
  handlePhotoChange: (index: number) => (file: File) => void;
}

export const ProductPhotos = ({ existingImages, handlePhotoChange }: ProductPhotosProps) => {
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
            defaultImage={existingImages[0]}
          />
        </div>
        {/* 6 Small Slots (Right) */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <PhotoSlot 
            key={i} 
            onChange={handlePhotoChange(i)} 
            defaultImage={existingImages[i]}
          />
        ))}
      </div>
      <p className="text-sm text-gray-400 italic">* Select up to 7 photos. First photo is main.</p>
    </div>
  );
};
