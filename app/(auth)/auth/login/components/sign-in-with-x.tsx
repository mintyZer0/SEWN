"use client";
import { signInWithGoogle } from "@/lib/auth-actions";
import Image from "next/image";
import React from "react";

export default function SignInWithX() {
  return (
    <div className="flex gap-4 justify-center">
      <button
        type="button"
        onClick={() => {
          signInWithGoogle();
        }}
        className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/10 transition-colors"
      >
        <Image
          src="/assets/login-page/facebook.png"
          alt="Facebook Icon"
          width={48}
          height={48}
        />
      </button>
    </div>
  );
}
