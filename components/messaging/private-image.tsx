"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPrivateMediaUrl } from "@/lib/s3-client";

interface PrivateImageProps {
  url: string;
  alt?: string;
  className?: string;
}

export default function PrivateImage({ url, alt = "Shared image", className }: PrivateImageProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSignedUrl() {
      try {
        setLoading(true);
        setError(null);
        const resolvedUrl = await getPrivateMediaUrl(url);
        setSignedUrl(resolvedUrl);
      } catch (err: any) {
        console.error("Image fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSignedUrl();
  }, [url]);

  const showLoading = loading || (signedUrl && !imageLoaded);

  if (error) {
    return (
      <div className="flex h-48 w-full max-w-[320px] items-center justify-center bg-rose-50 border-2 border-rose-100 rounded-2xl p-4 text-center text-rose-500">
        <ImageIcon className="h-8 w-8 mb-2 opacity-20" />
        <p className="text-xs font-medium text-rose-500">Failed to load image</p>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full max-w-[400px] rounded-2xl overflow-hidden bg-gray-50 shadow-sm border border-black/5 min-h-[100px]", className)}>
      {showLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-100 animate-pulse">
          <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
        </div>
      )}
      
      {signedUrl && (
        <img 
          src={signedUrl} 
          alt={alt}
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "w-full h-auto object-contain transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
}
