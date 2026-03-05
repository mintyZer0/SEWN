"use client";

import React from "react";
import { User, Bell, ShoppingBag, Ruler } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserProfileSidebar() {
  const pathname = usePathname();

  const sidebarItems = [
    {
      title: "My Account",
      icon: <User className="w-5 h-5" />,
      subItems: [
        { name: "Profile", href: "/user-profile" },
        { name: "Banks and Card", href: "/user-profile/banks" },
        { name: "Addresses", href: "/user-profile/addresses" },
      ],
    },
    {
      title: "Notification",
      icon: <Bell className="w-5 h-5" />,
      subItems: [
        { name: "Order Update", href: "/user-profile/notifications/orders" },
        { name: "Promotions", href: "/user-profile/notifications/promos" },
      ],
    },
    {
      title: "Orders",
      icon: <ShoppingBag className="w-5 h-5" />,
      href: "/user-profile/orders",
    },
    {
      title: "Measurements",
      icon: <Ruler className="w-5 h-5" />,
      href: "/user-profile/measurements",
    },
  ];

  return (
    <aside className="w-64 p-8 border-r border-gray-100 flex-shrink-0">
      <nav className="space-y-8">
        {sidebarItems.map((item, idx) => (
          <div key={idx} className="space-y-3">
            {item.href ? (
              <Link
                href={item.href}
                className={`flex items-center gap-3 font-semibold transition-colors ${
                  pathname === item.href
                    ? "text-third"
                    : "text-gray-600 hover:text-third"
                }`}
              >
                {item.icon}
                <span className="text-lg">{item.title}</span>
              </Link>
            ) : (
              <div className="flex items-center gap-3 text-third font-semibold">
                {item.icon}
                <span className="text-lg">{item.title}</span>
              </div>
            )}

            {item.subItems && (
              <ul className="ml-8 space-y-2 border-l-2 border-third pl-4">
                {item.subItems.map((sub, sIdx) => {
                  const isActive = pathname === sub.href;
                  return (
                    <li key={sIdx}>
                      <Link
                        href={sub.href}
                        className={`text-sm block transition-all ${
                          isActive
                            ? "text-white bg-third px-2 py-1 rounded-lg w-fit"
                            : "text-gray-500 hover:text-third"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
