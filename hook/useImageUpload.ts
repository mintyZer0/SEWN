import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface ImageFile {
  id: number;
  file: File;
  preview: string;
  name: string;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  publicUrl?: string;
  filePath?: string;
}

export const useImageUpload = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const addImages = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') && file.size < 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const id = Date.now() + Math.random();
          setImages((prev) => [...prev, {
            id,
            file,
            preview: e.target?.result as string,
            name: file.name,
            status: 'pending'
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  }, []);

  const removeImage = useCallback((id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setImages([]);
  }, []);

  const uploadImages = useCallback(async () => {
    const pendingImages = images.filter(img => img.status === 'pending');
    if (pendingImages.length === 0) return;

    setUploading(true);

    for (const image of pendingImages) {
      try {
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'uploading' } : img
        ));

        const fileExt = image.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `public/images/${fileName}`;

        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, image.file, {
            cacheControl: '3600',
            upsert: false,
            contentType: image.file.type
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        setImages(prev => prev.map(img => 
          img.id === image.id 
            ? { ...img, status: 'complete', publicUrl, filePath }
            : img
        ));

      } catch (error) {
        console.error('Upload error:', error);
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'error' } : img
        ));
      }
    }

    setUploading(false);
  }, [images]);

  return {
    images,
    uploading,
    pendingCount: images.filter(img => img.status === 'pending').length,
    addImages,
    removeImage,
    clearAll,
    uploadImages
  };
};
