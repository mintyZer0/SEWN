"use client";

import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { useState } from "react";

export default function SewistHeader() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // In production, this would be the main domain. Locally, it's the main local URL.
  const buyerModeUrl = process.env.NODE_ENV === "production" ? "https://sewn.com" : "http://sewn.local:3000";

  return (
    <header className="sticky top-0 left-0 right-0 z-[1001] shadow third-gradient">
      <div className="flex items-center justify-between py-4 px-8 w-full max-w-[100vw]">
        {/* Logo linking to Sewist Dashboard Home */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Image
            src="/assets/logo.png"
            alt="SEWN Sewist Center"
            height={60}
            width={180}
            className="w-32 md:w-48 h-auto object-contain"
            priority
          />
        </Link>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            onBlur={() => setTimeout(() => setIsProfileOpen(false), 200)}
            className="text-white hover:bg-white/10 p-2 rounded-full transition-colors flex items-center justify-center"
            aria-label="Profile Menu"
          >
            <User size={28} />
          </button>
          
          <div
            className={`absolute right-0 mt-2 w-56 bg-secondary rounded-xl shadow-xl border border-primary/10 py-2 z-10 transform transition-all duration-150 ease-out origin-top-right ${
              isProfileOpen
                ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
                : "opacity-0 scale-95 pointer-events-none -translate-y-2"
            }`}
          >
            <div className="px-2">
              <ul className="text-primary font-medium text-base text-left space-y-1">
                <li>
                  <a href={buyerModeUrl} className="block px-4 py-2.5 hover:bg-white/60 rounded-lg transition-colors">
                    Switch to Buyer Mode
                  </a>
                </li>
                <li>
                  <Link href="/auth/logout" className="block px-4 py-2.5 hover:bg-white/60 rounded-lg transition-colors text-red-600">
                    Log out
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
