"use client";

import React from "react";
import { ProfileButton } from "./profile-buttons";

export interface MeasurementData {
  [key: string]: string;
}

interface MeasurementCardProps {
  title: string;
  data: MeasurementData;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MeasurementCard({
  title,
  data,
  onEdit,
  onDelete,
}: MeasurementCardProps) {
  const displayData = Object.entries(data).slice(0, 3);
  const hasMore = Object.entries(data).length > 3;

  return (
    <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-lg min-h-[220px] flex flex-col justify-center border border-white/20">
      <h3 className="text-third text-2xl md:text-3xl font-bold mb-4 tracking-tight">
        {title}
      </h3>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5 ml-2">
          {displayData.map(([key, value]) => (
            <p
              key={key}
              className="text-xl md:text-2xl text-gray-800 font-medium flex items-center gap-2"
            >
              <span>{key}:</span>
              <span>{value}</span>
            </p>
          ))}
          {hasMore && (
            <p className="text-2xl text-gray-800 font-bold tracking-widest leading-none">
              ...
            </p>
          )}
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
