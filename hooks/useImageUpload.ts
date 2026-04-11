import { useState, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface ImageFile {
  id: number;
  file: File;
  preview: string;
  name: string;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  publicUrl?: string;
  filePath?: string;
}

interface UploadOptions {
  bucket?: string;
  folder?: string;
}

export const useImageUpload = (options: UploadOptions = {}) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();
  
  const { bucket = 'product-images', folder = 'public/images' } = options;

  const addImages = useCallback(async (files: FileList) => {
  const newImages: ImageFile[] = [];
  
  for (const file of Array.from(files)) {
    if (file.type.startsWith('image/') && file.size < 5 * 1024 * 1024) {
      const preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
      
      const id = Date.now() + Math.random();
      setImages((prev) => [...prev, {
        id, file, preview, name: file.name, status: 'pending'
      }]);
      newImages.push({id, file, preview, name: file.name, status: 'pending'});
    }
  }
  
  return newImages;
}, []);

  const removeImage = useCallback((id: number) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setImages([]);
  }, []);

  const uploadImages = useCallback(async (imagesToUpload?: ImageFile[]) => {
    const pendingImages = imagesToUpload || images.filter(img => img.status === 'pending' || img.status === 'uploading');
    if (pendingImages.length === 0) return null;

    setUploading(true);
    let lastUploaded = null;

    for (const image of pendingImages) {
      try {
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'uploading' } : img
        ));

        const fileExt = image.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `${folder}/${fileName}`.replace(/\/+/g, '/');
        if (!fileName) {
            console.error("Invalid file name!");
          }
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, image.file, {
            cacheControl: '3600',
            upsert: false,
            contentType: image.file.type
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        lastUploaded = { publicUrl, filePath };

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
    return lastUploaded;
  }, [images, bucket, folder, supabase]);

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
