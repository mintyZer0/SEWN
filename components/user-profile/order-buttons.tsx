"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import Link from "next/link";

interface OrderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export const OrderActionButton = ({ className, children, asChild = false, ...props }: OrderButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "px-6 py-2 bg-third text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

export const ChatWithSewerButton = ({ className, ...props }: Omit<OrderButtonProps, "children">) => {
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
}: Omit<OrderButtonProps, "children"> & { sewerId: string }) => {
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

export const ConfirmDeliveryButton = ({ className, children, asChild = false, ...props }: OrderButtonProps) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "px-8 py-2 bg-[#69CD6D] text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

interface OrderTabButtonProps extends OrderButtonProps {
  isActive: boolean;
}

export const OrderTabButton = ({ isActive, className, children, ...props }: OrderTabButtonProps) => {
  return (
    <button
      className={cn(
        "px-6 py-2 rounded-full font-bold text-2xl transition-all",
        isActive
          ? "bg-white text-third shadow-sm"
          : "text-white hover:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
