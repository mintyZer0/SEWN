"use client";

import React, { useState, useEffect } from "react";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { ArrowLeft } from "lucide-react";
import { MeasurementProfile, MeasurementData } from "@/lib/measurements";

interface EditMeasurementsModalProps {
  profile: MeasurementProfile;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newData: Partial<MeasurementData>) => void;
}

export function EditMeasurementsModal({
  profile,
  isOpen,
  onClose,
  onConfirm,
}: EditMeasurementsModalProps) {
  const [formData, setFormData] = useState<Partial<MeasurementData>>({
    chest: profile.chest,
    shoulder_width: profile.shoulder_width,
    neck: profile.neck,
    sleeve_length_short: profile.sleeve_length_short,
    sleeve_length_long: profile.sleeve_length_long,
    upper_arm_bicep: profile.upper_arm_bicep,
    wrist: profile.wrist,
    shirt_length: profile.shirt_length,
    waist_shirt: profile.waist_shirt,
    waist_pants: profile.waist_pants,
    hips: profile.hips,
    inseam: profile.inseam,
    outseam: profile.outseam,
    thigh: profile.thigh,
    knee: profile.knee,
    leg_opening: profile.leg_opening,
    front_rise: profile.front_rise,
    back_rise: profile.back_rise,
  });

  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: keyof MeasurementData, value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    if (value !== "" && isNaN(numValue as number)) return;
    setFormData((prev) => ({ ...prev, [key]: numValue }));
  };

  const fieldMapping: { label: string; key: keyof MeasurementData }[] = [
    { label: "Chest", key: "chest" },
    { label: "Shoulder Width", key: "shoulder_width" },
    { label: "Neck", key: "neck" },
    { label: "Sleeve Length (Short)", key: "sleeve_length_short" },
    { label: "Sleeve Length (Long)", key: "sleeve_length_long" },
    { label: "Upper Arm (Bicep)", key: "upper_arm_bicep" },
    { label: "Wrist", key: "wrist" },
    { label: "Shirt Length", key: "shirt_length" },
    { label: "Waist (Shirt)", key: "waist_shirt" },
    { label: "Waist (Pants)", key: "waist_pants" },
    { label: "Hips", key: "hips" },
    { label: "Inseam", key: "inseam" },
    { label: "Outseam", key: "outseam" },
    { label: "Thigh", key: "thigh" },
    { label: "Knee", key: "knee" },
    { label: "Leg Opening", key: "leg_opening" },
    { label: "Front Rise", key: "front_rise" },
    { label: "Back Rise", key: "back_rise" },
  ];

  const half = Math.ceil(fieldMapping.length / 2);
  const leftColumn = fieldMapping.slice(0, half);
  const rightColumn = fieldMapping.slice(half);

  const renderField = (field: { label: string; key: keyof MeasurementData }) => (
    <div key={field.key} className="grid grid-cols-[1fr_80px] items-center gap-2">
      <label className="text-xl text-gray-800 font-medium whitespace-nowrap">
        {field.label}:
      </label>
      <input
        type="text"
        value={formData[field.key] ?? ""}
        onChange={(e) => handleChange(field.key, e.target.value)}
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

      <div className="relative z-10 w-full max-w-[900px] bg-white rounded-[40px] md:rounded-[60px] p-6 md:p-16 shadow-2xl flex flex-col gap-4 md:gap-8 max-h-[90vh] overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center shrink-0">
          <h2 className="text-4xl md:text-8xl text-primary leading-none font-bold md:font-normal">Measurements</h2>
          <button onClick={onClose} className="text-primary cursor-pointer">
            <ArrowLeft className="w-8 h-8 md:w-12 md:h-12 stroke-3" />
          </button>
        </div>

        {/* Form Container with Border - Strict height control */}
        <div className="relative border-2 border-primary rounded-[30px] md:rounded-[50px] p-4 md:p-12 flex flex-col min-h-0">
          {/* Label overlapping border */}
          <div className="absolute -top-4 md:-top-6 left-8 md:left-16 bg-white px-3 md:px-6 z-20 shrink-0">
            <span className="text-primary text-lg md:text-3xl font-medium">{profile.profile_name}</span>
          </div>

          {/* Scrollable area for fields only */}
          <div className="overflow-y-auto custom-scrollbar pr-2 md:pr-6 py-2 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-3 md:gap-y-4">
              <div className="space-y-2 md:space-y-3">{leftColumn.map(renderField)}</div>
              <div className="space-y-2 md:space-y-3">{rightColumn.map(renderField)}</div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex justify-center shrink-0">
          <ProfileButton
            variant="orange"
            size="xl"
            className="w-full max-w-xs md:max-w-md bg-orchid border-none text-xl md:text-4xl py-3 md:py-6 rounded-[15px] md:rounded-[25px]"
            onClick={() => onConfirm(formData)}
          >
            Confirm
          </ProfileButton>
        </div>
      </div>
    </div>
  );
}
