"use client";

import React, { useState, useEffect } from "react";
import { X, Download, Maximize2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string | null;
  type: "image" | "video";
}

export default function MediaPreviewModal({ isOpen, onClose, url, type }: MediaPreviewModalProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !url) return;

    async function fetchSignedUrl() {
      if (!url?.startsWith("s3-private://")) {
        setSignedUrl(url);
        return;
      }

      try {
        setLoading(true);
        setError(null);
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
        if (!res.ok) throw new Error(data.error || "Failed to get signed URL");
        setSignedUrl(data.url);
      } catch (err: any) {
        console.error("Preview fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSignedUrl();
  }, [isOpen, url]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-end p-6 text-white z-20 bg-linear-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-4">
          {signedUrl && (
            <a 
              href={signedUrl} 
              download 
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 hover:bg-white/10 rounded-full transition-colors"
            >
              <Download className="h-6 w-6" />
            </a>
          )}
          <button 
            onClick={onClose}
            className="p-3 hover:bg-rose-500 rounded-full transition-all active:scale-95"
          >
            <X className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-12 overflow-hidden">
        {loading && (
          <div className="flex flex-col items-center gap-4">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
             <p className="text-white/40 font-medium">Securing content...</p>
          </div>
        )}

        {error && (
          <div className="text-center space-y-4">
             <div className="bg-rose-500/20 p-6 rounded-full inline-block">
                <X className="h-12 w-12 text-rose-500" />
             </div>
             <p className="text-rose-500 text-lg font-bold">{error}</p>
             <button onClick={onClose} className="text-white/60 underline">Go back</button>
          </div>
        )}

        {!loading && !error && signedUrl && (
          <div className="w-full h-full flex items-center justify-center animate-in zoom-in-95 duration-300">
            {type === "image" ? (
              <img 
                src={signedUrl} 
                alt="Full size preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black"
              />
            ) : (
              <video 
                src={signedUrl} 
                controls 
                autoPlay
                className="max-w-full max-h-full rounded-lg shadow-2xl shadow-black"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
