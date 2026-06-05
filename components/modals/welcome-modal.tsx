"use client";

import { useState } from "react";
import Image from "next/image";
import { markWelcomeSeen } from "@/lib/auth-actions";

interface WelcomeModalProps {
  firstName: string;
}

export function WelcomeModal({ firstName }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = async () => {
    setIsLoading(true);
    const result = await markWelcomeSeen();
    if (result.success) {
      setIsOpen(false);
    } else {
      // In a real app, maybe show a toast. Here we just close it anyway to not block the user.
      setIsOpen(false); 
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl">
        
        {/* Logo */}
        <div className="mx-auto mb-6 flex justify-center">
           {/* Assuming logo exists at /assets/sewn-logo.png or similar. Update src if needed based on project structure */}
           {/* We use text to simulate logo for now if asset missing, but let's assume an image tag */}
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black tracking-widest text-[#3b1c4a]">
              SEWN
            </span>
          </div>
        </div>

        {/* Welcome Text */}
        <h2 className="mb-1 text-4xl font-black text-[#a65d93]">
          Mabuhay!
        </h2>
        <h3 className="mb-2 text-2xl font-bold text-[#a65d93]">
          Welcome to SEWN!
        </h3>
        <h4 className="mb-6 text-3xl font-black text-[#a65d93]">
          {firstName || "Friend"}
        </h4>

        {/* Change Dialect Link */}
        <button className="mb-6 text-sm italic text-gray-500 underline hover:text-gray-700">
          Change Dialect
        </button>

        {/* CTA Button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="w-full rounded-2xl bg-gradient-to-r from-[#a65d93] to-[#c786b9] py-4 text-xl font-medium text-white shadow-md transition-transform hover:scale-[0.98] active:scale-95 disabled:opacity-70"
        >
          {isLoading ? "Loading..." : "Let's go"}
        </button>

        {/* Footer */}
        <p className="mt-8 text-sm text-gray-600">
          © 2025, SEWNTUKAN
        </p>
      </div>
    </div>
  );
}
