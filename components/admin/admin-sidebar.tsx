"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Box, 
  Users, 
  LogOut 
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Products", href: "/products", icon: Box },
  { name: "Customers", href: "/customers", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-80 bg-orchid-vertical-b min-h-screen flex flex-col py-12 px-10 shadow-lg border-r border-white/20 sticky top-0">
      <div className="flex flex-col gap-6 flex-1">
        <div className="mb-8 px-4 flex justify-center">
          <Link href="/" className="hover:opacity-80 transition-opacity drop-shadow-md">
            <Image
              src="/assets/logo.png"
              alt="SEWN Logo"
              width={160}
              height={60}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        <nav className="flex flex-col gap-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <ProfileButton
                key={item.name}
                variant="white"
                size="xl"
                asChild
                className={cn(
                  "w-full rounded-full transition-all duration-300 transform flex items-center justify-start gap-4 px-8 text-primary font-bold",
                  isActive 
                    ? "opacity-100 scale-105 shadow-2xl" 
                    : "opacity-60 scale-100 hover:opacity-90 shadow-md"
                )}
              >
                <Link href={item.href}>
                  <Icon size={24} className="min-w-[24px]" />
                  <span>{item.name}</span>
                </Link>
              </ProfileButton>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto pt-8 border-t border-white/10">
        <Link 
          href="/auth/logout" 
          className="flex items-center gap-3 px-8 py-4 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 group"
        >
          <LogOut size={24} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-xl font-medium">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
