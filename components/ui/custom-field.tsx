"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomFieldProps
  extends React.InputHTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  > {
  label: string;
  isTextArea?: boolean;
  isSelect?: boolean;
  options?: { value: string; label: string }[];
  containerClassName?: string;
}

export const CustomField = ({
  label,
  placeholder,
  type = "text",
  isTextArea = false,
  isSelect = false,
  options = [],
  containerClassName,
  className,
  ...props
}: CustomFieldProps) => {
  const commonClasses = cn(
    "w-full border-2 border-third/50 px-6 py-3 outline-none focus:border-third transition-colors text-gray-700 h-[54px] appearance-none",
    isTextArea ? "rounded-[22px] py-4 h-auto resize-none" : "rounded-full",
    className
  );

  return (
    <div className={cn("relative mt-4", containerClassName)}>
      <label className="absolute -top-3 left-6 bg-white px-2 text-third font-bold text-sm z-10 whitespace-nowrap">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          placeholder={placeholder}
          rows={4}
          className={commonClasses}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : isSelect ? (
        <div className="relative flex items-center">
          <select
            className={cn(commonClasses, "bg-white cursor-pointer")}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 text-third w-6 h-6 pointer-events-none" />
        </div>
      ) : (
        <div className="relative flex items-center">
          <input
            type={type}
            placeholder={placeholder}
            className={commonClasses}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
          {(label.includes("Category") ||
            label.includes("Fabric") ||
            label.includes("Instructions")) && (
            <ChevronDown className="absolute right-4 text-third w-6 h-6 pointer-events-none" />
          )}
        </div>
      )}
    </div>
  );
};
