"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CustomFieldProps
  extends Omit<React.InputHTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >, 'onChange'> {
  label: string;
  isTextArea?: boolean;
  isSelect?: boolean;
  options?: { value: string; label: string }[];
  containerClassName?: string;
  onChange?: (e: any) => void;
  onValueChange?: (value: string) => void;
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
  value,
  onChange,
  onValueChange,
  ...props
}: CustomFieldProps) => {
  const commonClasses = cn(
    "w-full border-2 border-third/50 px-6 py-3 outline-none focus:border-third transition-colors text-gray-700 h-14 appearance-none",
    isTextArea ? "rounded-3xl py-4 h-auto resize-none" : "rounded-full",
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
          value={value as string}
          onChange={onChange}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : isSelect ? (
        <Select
          value={value as string}
          onValueChange={(val) => {
            if (onValueChange) onValueChange(val);
            if (onChange) onChange({ target: { value: val, name: props.name } } as any);
          }}
          disabled={props.disabled}
        >
          <SelectTrigger className={className}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="relative flex items-center">
          <input
            type={type}
            placeholder={placeholder}
            className={commonClasses}
            value={value as string}
            onChange={onChange}
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
