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
        "bg-orchid rounded-[40px] p-8 md:p-12 min-h-[600px] relative shadow-2xl",
        className
      )}
    >
      <header className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2">{title}</h1>
          {description && (
            <p className="text-white/80 text-xl font-medium">{description}</p>
          )}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </header>

      <div className="space-y-6">{children}</div>
    </div>
  );
}
