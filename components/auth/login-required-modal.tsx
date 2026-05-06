"use client";

import Link from "next/link";
import { ProfileButton } from "@/components/user-profile/profile-buttons";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  loginHref: string;
  title?: string;
  description?: string;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  loginHref,
  title = "Login Required",
  description = "Please log in first to continue.",
}: LoginRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close modal backdrop"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-3xl font-bold text-heading">{title}</h3>
        <p className="mt-2 text-base text-gray-600">{description}</p>
        <div className="mt-6 flex items-center justify-end gap-3">
          <ProfileButton
            type="button"
            onClick={onClose}
            variant="white"
            size="sm"
            className="border border-primary !text-primary"
          >
            Cancel
          </ProfileButton>
          <ProfileButton asChild variant="orange" size="sm" className="!bg-primary text-white">
            <Link href={loginHref} onClick={onClose}>
              Login
            </Link>
          </ProfileButton>
        </div>
      </div>
    </div>
  );
}
