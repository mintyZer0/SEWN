"use client";

import React from "react";
import { ProfileButton } from "./profile-buttons";
import { MeasurementProfile } from "@/lib/measurements";

interface MeasurementCardProps {
  profile: MeasurementProfile;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MeasurementCard({
  profile,
  onEdit,
  onDelete,
}: MeasurementCardProps) {
  // Define display mapping for the card preview
  const displayFields = [
    { label: "Chest", value: profile.chest },
    { label: "Shoulder Width", value: profile.shoulder_width },
    { label: "Neck", value: profile.neck },
  ];

  const unit = profile.unit || "in";

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-lg min-h-[220px] flex flex-col justify-center border border-white/20">
      <h3 className="text-third text-2xl md:text-3xl font-bold mb-4 tracking-tight">
        {profile.profile_name}
      </h3>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5 ml-2">
          {displayFields.map((field) => (
            <p
              key={field.label}
              className="text-xl md:text-2xl text-gray-800 font-medium flex items-center gap-2"
            >
              <span>{field.label}:</span>
              <span>{field.value !== null ? `${field.value} ${unit}` : "N/A"}</span>
            </p>
          ))}
          <p className="text-2xl text-gray-800 font-bold tracking-widest leading-none">
            ...
          </p>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
          <ProfileButton
            variant="orange"
            size="lg"
            className="px-12"
            onClick={onEdit}
          >
            Edit
          </ProfileButton>
          <ProfileButton
            variant="orange"
            size="lg"
            className="px-12"
            onClick={onDelete}
          >
            Delete
          </ProfileButton>
        </div>
      </div>
    </div>
  );
}
