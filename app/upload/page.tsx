'use client'

import { useImageUpload, ImageFile } from '@/hooks/useImageUpload';
import React, { useCallback, DragEvent } from 'react';

const ImageUploadPage: React.FC = () => {
  const { images, uploading, pendingCount, addImages, removeImage, clearAll, uploadImages } = useImageUpload();

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addImages(e.dataTransfer.files);
  }, [addImages]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addImages(e.target.files);
      e.target.value = '';
    }
  }, [addImages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-4xl w-full">
        <div
          className="border-4 border-dashed border-gray-300 rounded-2xl p-16 text-center hover:border-indigo-500 cursor-pointer mb-8 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => (document.querySelector('.file-input') as HTMLInputElement)?.click()}
        >
          <div>
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Drop images here or click</h2>
            <p className="text-gray-500">JPG, PNG, GIF (Max 5MB each)</p>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden file-input"
            disabled={uploading}
          />
        </div>

        {images.length > 0 && (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Selected Images ({images.length})
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {images.map((image) => (
                <div key={image.id} className="relative rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition-all">
                  <img 
                    src={image.status === 'complete' ? image.publicUrl! : image.preview} 
                    alt={image.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <span className="max-w-[120px] truncate">{image.name}</span>
                    {image.status === 'uploading' && <span>⏳</span>}
                    {image.status === 'error' && <span className="text-red-400">❌</span>}
                    {image.status === 'pending' && (
                      <button
                        onClick={() => removeImage(image.id)}
                        className="hover:bg-white/20 rounded-full w-6 h-6 flex items-center justify-center"
                        disabled={uploading}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={uploadImages}
                disabled={uploading || pendingCount === 0}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : `Upload ${pendingCount} Image${pendingCount !== 1 ? 's' : ''}`}
              </button>
              <button
                onClick={clearAll}
                className="px-8 py-4 bg-gray-50 text-gray-700 font-semibold rounded-2xl border-2 border-gray-200 hover:bg-gray-100 transition-all"
                disabled={uploading}
              >
                Clear All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploadPage;