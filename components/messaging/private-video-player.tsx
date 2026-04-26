"use client";

import React, { useState, useEffect } from "react";
import { Loader2, PlayCircle } from "lucide-react";

interface PrivateVideoPlayerProps {
  url: string;
  className?: string;
}

export default function PrivateVideoPlayer({ url, className }: PrivateVideoPlayerProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSignedUrl() {
      // Check if it's a private S3 marker
      if (!url.startsWith("s3-private://")) {
        setSignedUrl(url);
        return;
      }

      try {
        setLoading(true);
        const filename = url.replace("s3-private://", "").replace(/^\/+/, "");
        
        const res = await fetch("/api/s3-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            filename, 
            action: "fetch", 
            bucketType: "private" 
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to get signed URL");
        }

        setSignedUrl(data.url);
      } catch (err: any) {
        console.error("Video fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSignedUrl();
  }, [url]);

  if (loading) {
    return (
      <div className="flex h-48 w-full items-center justify-center bg-gray-100 rounded-2xl animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin text-primary/40" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-48 w-full items-center justify-center bg-rose-50 border-2 border-rose-100 rounded-2xl p-4 text-center">
        <p className="text-sm text-rose-500 font-medium">Failed to load video</p>
      </div>
    );
  }

  if (!signedUrl) return null;

  return (
    <div className={className}>
      <video 
        src={signedUrl} 
        controls 
        className="w-full rounded-2xl shadow-sm border border-black/5 bg-black"
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
