"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Package, Calendar, Bell, MessageCircle } from "lucide-react";

const navItems = [
  { name: "Profile", href: "/", icon: User },
  { name: "Products", href: "/products", icon: Package },
  { name: "Availability", href: "/appointments", icon: Calendar },
  { name: "Alerts", href: "/notifications", icon: Bell },
  { name: "Chat", href: "/chat", icon: MessageCircle },
];

export default function SewistMobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center px-2 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center min-w-[64px] gap-1 transition-colors",
              isActive ? "text-third" : "text-gray-400 hover:text-primary"
            )}
          >
            <Icon 
              className={cn("w-6 h-6 transition-all duration-200", isActive ? "scale-110" : "scale-100")} 
              strokeWidth={isActive ? 2.5 : 2} 
            />
            <span className={cn(
              "text-[10px] font-medium tracking-tight",
              isActive ? "font-bold" : ""
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
