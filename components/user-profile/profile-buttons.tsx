"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";

interface ProfileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
  variant?: "orange" | "white" | "green" | "ghost" | "tab";
  size?: "sm" | "md" | "lg" | "xl";
  isActive?: boolean;
}

export const ProfileButton = ({ 
  className, 
  children, 
  asChild = false, 
  variant = "orange",
  size = "md",
  isActive,
  ...props 
}: ProfileButtonProps) => {
  const Comp = asChild ? Slot : "button";
  
  const variants = {
    orange: "bg-third text-white hover:opacity-90 shadow-md",
    white: "bg-white text-third shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0",
    green: "bg-[#69CD6D] text-white hover:opacity-90 shadow-md",
    ghost: "text-third hover:underline font-semibold px-0 py-0 shadow-none active:scale-100",
    tab: cn(
      "rounded-full font-bold text-2xl transition-all shadow-none active:scale-95",
      isActive ? "bg-white text-third shadow-sm" : "text-white hover:bg-white/10"
    ),
  };

  const sizes = {
    sm: "px-6 py-2 rounded-xl text-sm font-semibold",
    md: "px-8 py-2.5 rounded-xl text-lg font-bold",
    lg: "px-12 py-2.5 rounded-2xl text-xl font-bold",
    xl: "px-12 py-3.5 rounded-[22px] text-2xl font-black",
  };

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
        variants[variant],
        variant !== "tab" && variant !== "ghost" && sizes[size],
        variant === "tab" && "px-6 py-2",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

export const OrderActionButton = ({ className, children, asChild = false, ...props }: ProfileButtonProps) => {
  return (
    <ProfileButton
      variant="orange"
      size="sm"
      asChild={asChild}
      className={className}
      {...props}
    >
      {children}
    </ProfileButton>
  );
};

export const ChatWithSewerButton = ({ className, ...props }: Omit<ProfileButtonProps, "children">) => {
  return (
    <OrderActionButton
      className={className}
      onClick={() => {
        // Future: Open chat logic
        console.log("Opening chat with sewer...");
      }}
      {...props}
    >
      Chat with Sewer
    </OrderActionButton>
  );
};

export const ViewSewerButton = ({ 
  sewerId, 
  className, 
  ...props 
}: Omit<ProfileButtonProps, "children"> & { sewerId: string }) => {
  return (
    <OrderActionButton
      asChild
      className={className}
      {...props}
    >
      <Link href={`/sewer-profiles/${sewerId}`}>
        View Sewer
      </Link>
    </OrderActionButton>
  );
};

export const ConfirmDeliveryButton = ({ className, children, asChild = false, ...props }: ProfileButtonProps) => {
  return (
    <ProfileButton
      variant="green"
      size="md"
      asChild={asChild}
      className={className}
      {...props}
    >
      {children}
    </ProfileButton>
  );
};

export const OrderTabButton = ({ isActive, className, children, ...props }: ProfileButtonProps) => {
  return (
    <ProfileButton
      variant="tab"
      isActive={isActive}
      className={className}
      {...props}
    >
      {children}
    </ProfileButton>
  );
};
