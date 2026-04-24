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
  folder?: string;
}

export const useImageUpload = (options: UploadOptions = {}) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();
  
  const { folder = 'public/images' } = options;

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
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
        const filePath = `${folder}/${fileName}`.replace(/\/+/g, '/');

        if (!fileName) {
          console.error("Invalid file name!");
        }

        // 1. Get presigned URL from our API
        const res = await fetch('/api/s3-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            filename: filePath, 
            contentType: image.file.type 
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Failed to get upload URL');
        }

        const { url, publicUrl } = await res.json();

        // 2. Upload file directly to S3
        const uploadRes = await fetch(url, {
          method: 'PUT',
          body: image.file,
          headers: {
            'Content-Type': image.file.type,
          },
        });

        if (!uploadRes.ok) throw new Error('Failed to upload file to S3');

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
  }, [images, folder]);

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
