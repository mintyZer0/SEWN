"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProfileButton } from "@/components/user-profile/profile-buttons";

const sidebarItems = [
  { name: "Profile", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Availability", href: "/appointments" },
  { name: "Notifications", href: "/notifications" },
  { name: "Chat", href: "/chat" },
];

export default function SewistSidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  return (
    <aside className="w-80 bg-secondary-gradient-b h-auto self-stretch flex flex-col py-12 px-10 gap-8 shadow-lg border-r border-white/20 sticky top-[92px]">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
        return (
          <ProfileButton
            key={item.name}
            variant="white"
            size="xl"
            asChild
            className={cn(
              "w-full rounded-full transition-all duration-300 transform",
              isActive 
                ? "opacity-100 scale-105 shadow-2xl ring-2 ring-white/30" 
                : "opacity-60 scale-100 hover:opacity-90 shadow-md hover:scale-[1.02]"
            )}
          >
            <Link href={item.href}>
              <span className="flex items-center justify-center gap-2">
                {item.name}
                {item.href === "/notifications" && unreadCount > 0 ? (
                  <span className="inline-flex min-w-6 h-6 items-center justify-center rounded-full bg-third px-2 text-xs font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
              </span>
            </Link>
          </ProfileButton>
        );
      })}
    </aside>
  );
}
