"use client";

import React from "react";
import { Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PendingProduct {
  id: string;
  name: string;
}

interface ViewPendingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items?: PendingProduct[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<void>;
}

export const ViewPendingsModal = ({
  isOpen,
  onClose,
  items = [],
  loading = false,
  onDelete,
}: ViewPendingsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Main White Modal Container */}
      <div className="relative bg-white rounded-[40px] p-12 w-full max-w-2xl transform transition-all animate-in fade-in zoom-in duration-300 shadow-2xl">
        
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-[80px] font-bold text-third leading-tight">
            View Pendings
          </h2>
          <p className="text-xl text-third/80 mt-1">
            Updated as of {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date().toLocaleDateString('en-GB')}
          </p>
        </div>

        {/* Inner Orange Container */}
        <div className="bg-third rounded-[50px] p-8 pb-0 overflow-hidden flex flex-col items-center min-h-[300px]">
          <div className="w-full space-y-4 mb-10 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-white gap-4">
                <Loader2 className="w-12 h-12 animate-spin" />
                <span className="text-2xl font-medium">Fetching items...</span>
              </div>
            ) : items.length > 0 ? (
              items.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-[20px] py-4 px-8 flex justify-between items-center shadow-sm shrink-0"
                >
                  <div className="flex items-center gap-2 text-2xl text-third font-medium truncate pr-4">
                    <span>{index + 1}.</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <button 
                    onClick={() => onDelete?.(item.id)}
                    className="text-third/40 hover:text-third transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-8 h-8" strokeWidth={2.5} />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-white/60">
                <span className="text-2xl font-medium italic text-center">No pending items found</span>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="bg-white text-third px-16 py-3 rounded-t-[25px] text-2xl font-bold hover:bg-gray-50 transition-colors cursor-pointer shadow-md mt-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
