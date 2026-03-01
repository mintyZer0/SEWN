"use client";
import { signInWithGoogle } from "@/lib/auth-actions";
import Image from "next/image";
import React from "react";

interface SocialSignInButtonProps {
  imageSrc: string;
  altText: string;
  onSignIn?: () => void;
}

export default function SocialSignInButton({
  imageSrc,
  altText,
  onSignIn = signInWithGoogle,
}: SocialSignInButtonProps) {
  return (
    <div className="flex gap-4 justify-center">
      <button
        type="button"
        onClick={onSignIn}
        className="size-30 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/10 transition-colors"
      >
        <Image src={imageSrc} alt={altText} width={48} height={48} />
      </button>
    </div>
  );
}
