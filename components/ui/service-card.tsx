"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import LoginRequiredModal from "@/components/auth/login-required-modal";

export interface ServiceCardProps {
  imgSrc: string;
  service: string;
  href: string;
  colSpan: number;
  className?: string;
  isDisabled?: boolean;
}
export default function ServiceCard({
  imgSrc,
  service,
  href,
  colSpan,
  className,
  isDisabled,
}: ServiceCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleProtectedNavigation = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (isDisabled) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    router.push(href);
  };

  return (
    <>
    <Link
      href={isDisabled ? "#" : href}
      onClick={handleProtectedNavigation}
      className={`relative block w-full h-44 sm:h-56 md:h-100 ${className} ${colSpan === 2 ? "md:col-span-2 col-span-1" : "col-span-1"} ${isDisabled ? "grayscale opacity-50 cursor-not-allowed" : ""}`}
    >
      <Image
        src={imgSrc}
        alt={service}
        fill
        sizes="(max-width: 768px) 100vw, 800px"
        className="object-cover rounded-4xl"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl text-white drop-shadow-2xl drop-shadow-black">
          {service}
        </h3>
      </div>
      {!isDisabled && <div className="absolute inset-0 w-full h-full hover:bg-white/10 transition-all duration-500"></div>}
      {isDisabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-4xl">
           <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">Unavailable</span>
        </div>
      )}
    </Link>
    <LoginRequiredModal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      loginHref={`/auth/login?redirect=${encodeURIComponent(href)}`}
      description="Please login first before requesting this service."
    />
    </>
  );
}
