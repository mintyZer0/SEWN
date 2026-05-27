"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProfileSectionProps {
  title: string;
  description?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function ProfileSection({
  title,
  description,
  headerAction,
  children,
  className,
}: ProfileSectionProps) {
  return (
    <div
      className={cn(
        "bg-orchid rounded-[40px] p-6 sm:p-8 md:p-12 min-h-96 md:min-h-[600px] relative shadow-2xl",
        className
      )}
    >
      <header className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8 md:mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">{title}</h1>
          {description && (
            <p className="text-white/80 text-base sm:text-lg md:text-xl font-medium">{description}</p>
          )}
        </div>
        {headerAction && <div className="w-full md:w-auto">{headerAction}</div>}
      </header>

      <div className="space-y-6">{children}</div>
    </div>
  );
}
