"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  message?: string;
  imageSrc?: string;
  variant?: "product" | "signup";
}

export function SuccessModal({
  isOpen = true,
  onClose,
  title,
  message,
  imageSrc = "/assets/signup-page/success.png",
  variant = "signup",
}: SuccessModalProps) {
  if (!isOpen) return null;

  // Defaults based on variant
  const displayTitle = title || (variant === "product" ? "Processing your Product" : "Check Your Email!");
  const displayMessage = message || (variant === "product" ? "This will take 1-3 business days" : "We sent a confirmation link to your email. Please verify your account before logging in.");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className={cn(
        "relative z-10 w-full transform overflow-hidden bg-white p-12 text-center shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-300",
        variant === "product" ? "max-w-2xl rounded-[40px]" : "max-w-md rounded-2xl"
      )}>
        
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-8 top-8 rounded-full p-2 text-third/40 hover:bg-gray-100 hover:text-third transition-all"
          >
            <X className={cn(variant === "product" ? "h-10 w-10" : "h-6 w-6")} />
          </button>
        )}

        {/* Illustration */}
        <div className={cn(
          "mx-auto mb-10 flex items-center justify-center relative",
          variant === "product" ? "h-64 w-full" : "h-40 w-40"
        )}>
          <Image 
            src={imageSrc} 
            alt="Success Illustration" 
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className={cn(
            "font-extrabold tracking-tight text-third leading-tight",
            variant === "product" ? "text-6xl" : "text-4xl font-bold text-heading"
          )}>
            {displayTitle}
          </h2>
          <p className={cn(
            "font-medium",
            variant === "product" ? "text-2xl text-third/80" : "mt-2 text-sm text-gray-500"
          )}>
            {displayMessage}
          </p>
          
          {variant === "signup" && (
            <p className="mt-4 text-xs text-gray-400">
              You will be redirected automatically after confirming your email.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
