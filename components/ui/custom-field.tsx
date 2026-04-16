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
  variant?: "orange" | "purple";
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
  variant = "orange",
  ...props
}: CustomFieldProps) => {
  const commonClasses = cn(
    "w-full border-2 px-6 py-3 outline-none transition-colors text-gray-700 h-14 appearance-none",
    variant === "orange" 
      ? "border-third/50 focus:border-third" 
      : "border-primary/50 focus:border-primary",
    isTextArea ? "rounded-3xl py-4 h-auto resize-none" : "rounded-full",
    className
  );

  return (
    <div className={cn("relative mt-4", containerClassName)}>
      <label className={cn(
        "absolute -top-3 left-6 bg-white px-2 font-bold text-sm z-10 whitespace-nowrap",
        variant === "orange" ? "text-third" : "text-primary"
      )}>
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
          variant={variant}
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
            <ChevronDown className={cn(
              "absolute right-4 w-6 h-6 pointer-events-none",
              variant === "orange" ? "text-third" : "text-primary"
            )} />
          )}
        </div>
      )}
    </div>
  );
};
