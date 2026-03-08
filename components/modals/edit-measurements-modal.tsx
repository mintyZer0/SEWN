"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { X, ArrowLeft } from "lucide-react";
import { MeasurementData } from "@/components/user-profile/measurement-card";

interface EditMeasurementsModalProps {
  title: string;
  data: MeasurementData;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newData: MeasurementData) => void;
}

export function EditMeasurementsModal({
  title,
  data,
  isOpen,
  onClose,
  onConfirm,
}: EditMeasurementsModalProps) {
  const [formData, setFormData] = useState<MeasurementData>(data);

  if (!isOpen) return null;

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleConfirm = () => {
    onConfirm(formData);
    onClose();
  };

  const leftColumnFields = [
    "Chest",
    "Shoulder Width",
    "Neck",
    "Sleeve Length (Short)",
    "Sleeve Length (Long)",
    "Upper Arm (Bicep)",
    "Wrist",
    "Shirt Length",
    "Waist (Shirt Slim Fit)",
    "Waist (Pants)",
  ];

  const rightColumnFields = [
    "Hips",
    "Inseam",
    "Outseam",
    "Thigh",
    "Knee",
    "Leg Opening",
    "Front Rise",
    "Back Rise",
  ];

  const renderField = (field: string) => (
    <div key={field} className="grid grid-cols-[1fr_80px] items-center gap-2">
      <label className="text-xl text-gray-800 font-medium whitespace-nowrap">
        {field}:
      </label>
      <input
        type="text"
        value={formData[field] || ""}
        onChange={(e) => handleChange(field, e.target.value)}
        className="w-full bg-gray-100 rounded-lg px-2 py-1 text-lg text-gray-800 focus:outline-none border-b-2 border-transparent focus:border-third transition-all"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[900px] bg-white rounded-[60px] p-10 md:p-16 shadow-2xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-8xl text-primary">Measurements</h2>
          <button onClick={onClose} className="text-primary  cursor-pointer">
            <ArrowLeft className="w-12 h-12 stroke-3" />
          </button>
        </div>

        {/* Form Container */}
        <div className="relative border-2 border-primary rounded-[50px] p-8 pt-12 md:p-12 md:pt-16">
          {/* Label overlapping border */}
          <div className="absolute -top-6 left-16 bg-white px-6">
            <span className="text-primary text-3xl font-medium">{title}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
            <div className="space-y-3">{leftColumnFields.map(renderField)}</div>
            <div className="space-y-3">
              {rightColumnFields.map(renderField)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-center mt-4">
          <ProfileButton
            variant="orange"
            size="xl"
            className="w-full max-w-md bg-orchid border-none text-4xl py-6 rounded-[25px]"
            onClick={handleConfirm}
          >
            Confirm
          </ProfileButton>
        </div>
      </div>
    </div>
  );
}
