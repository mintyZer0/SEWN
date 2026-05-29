"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, Bell, ShoppingBag, Save } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function UserProfileMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    {
      title: "My Account",
      icon: User,
      href: "/user-profile",
      subItems: [
        { name: "Profile", href: "/user-profile" },
        { name: "Banks and Card", href: "/user-profile/banks" },
        { name: "Addresses", href: "/user-profile/addresses" },
      ],
      isActive: (path: string) => ["/user-profile", "/user-profile/banks", "/user-profile/addresses"].includes(path),
    },
    {
      title: "Notification",
      icon: Bell,
      href: "/user-profile/notifications/orders",
      subItems: [
        { name: "Order Update", href: "/user-profile/notifications/orders" },
        { name: "Promotions", href: "/user-profile/notifications/promos" },
      ],
      isActive: (path: string) => path.includes("/notifications"),
    },
    {
      title: "Orders",
      icon: ShoppingBag,
      href: "/user-profile/orders",
      isActive: (path: string) => path.includes("/orders") && !path.includes("/notifications"),
    },
    {
      title: "Measurements",
      icon: Save,
      href: "/user-profile/measurements",
      isActive: (path: string) => path.includes("/measurements"),
    },
  ];

  const activeCategory = categories.find(cat => cat.isActive(pathname)) || categories[0];

  return (
    <div className="md:hidden sticky top-[60px] z-[900] bg-white border-b border-gray-200">
      <div className="flex items-center px-4 py-3 relative gap-4">
        <div ref={dropdownRef}>
          <button 
            className="shrink-0 p-2 text-primary" 
            aria-label="Menu"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Menu size={24} />
          </button>
          
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-4 mt-2 bg-white rounded-xl shadow-2xl py-4 px-6 min-w-[240px] flex flex-col gap-5 border border-gray-100">
              {categories.map((cat) => {
                const isCatActive = cat.title === activeCategory.title;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.title}
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push(cat.href);
                    }}
                    className={cn(
                      "flex items-center gap-4 text-xl font-medium tracking-wide transition-colors text-left",
                      isCatActive ? "text-third" : "text-primary"
                    )}
                  >
                    <Icon size={24} strokeWidth={isCatActive ? 2.5 : 2} />
                    {cat.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Horizontal Sub-tabs */}
        <nav className="flex gap-4 items-center overflow-x-auto hide-scrollbar">
          {activeCategory.subItems?.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-third text-white"
                    : "text-primary hover:bg-light-pink"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
