"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { CustomCheckbox } from "@/components/ui/custom-checkbox";

interface CommissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommissionsModal = ({ isOpen, onClose }: CommissionsModalProps) => {
  if (!isOpen) return null;

  const services = [
    { id: "commissions", label: "Accepting Commissions" },
    { id: "alterations", label: "Accepting Alterations" },
    { id: "repairs", label: "Accepting Repairs" },
    { id: "appointments", label: "Accepting Appointments" },
  ];

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[40px] p-12 max-w-2xl w-full shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-[80px] font-bold text-third leading-tight">
              Commissions
            </h2>
            <p className="text-2xl text-third mt-1">Enable services</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-12 h-12 text-third" strokeWidth={2.5} />
          </button>
        </div>

        {/* Checkbox List */}
        <div className="mt-8 space-y-6">
          {services.map((service) => (
            <CustomCheckbox
              key={service.id}
              label={service.label}
              size="lg"
              labelClassName="text-3xl text-third"
              containerClassName="gap-6"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
