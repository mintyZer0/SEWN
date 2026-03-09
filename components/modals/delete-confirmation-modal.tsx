"use client";

import React from "react";
import { ProfileButton } from "@/components/user-profile/profile-buttons";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
  isDeleting?: boolean;
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  isDeleting = false,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
        <h3 className="text-3xl font-bold text-primary mb-4">{title}</h3>
        <p className="text-xl text-gray-600 mb-8">
          Are you sure you want to delete <span className="font-bold text-third">"{itemName}"</span>? This action cannot be undone.
        </p>
        
        <div className="flex gap-4 justify-end">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-8 py-3 rounded-2xl text-xl font-bold text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <ProfileButton
            variant="orange"
            size="md"
            onClick={onConfirm}
            disabled={isDeleting}
            className="min-w-[140px]"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </ProfileButton>
        </div>
      </div>
    </div>
  );
};
