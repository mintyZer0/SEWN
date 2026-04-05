"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CustomCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  className?: string;
  containerClassName?: string;
  labelClassName?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const CustomCheckbox = ({
  label,
  className,
  containerClassName,
  labelClassName,
  size = "md",
  ...props
}: CustomCheckboxProps) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  const checkmarkSizes = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  return (
    <label
      className={cn(
        "flex items-center gap-3 cursor-pointer group select-none",
        containerClassName
      )}
    >
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className={cn(
            "peer appearance-none border-2 border-third rounded-lg checked:bg-third transition-all cursor-pointer",
            sizeClasses[size],
            className
          )}
          {...props}
        />
        <svg
          className={cn(
            "absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity",
            checkmarkSizes[size]
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={4}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      {label && (
        <span className={cn("transition-opacity group-hover:opacity-80", labelClassName)}>
          {label}
        </span>
      )}
    </label>
  );
};
