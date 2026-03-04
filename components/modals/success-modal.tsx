"use client";

import Image from "next/image";

interface SuccessModalProps {
  title?: string;
  message?: string;
  imageSrc?: string;
}

export function SuccessModal({
  title = "Check Your Email!",
  message = "We sent a confirmation link to your email. Please verify your account before logging in.",
  imageSrc = "/assets/signup-page/success.png",
}: SuccessModalProps) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-40 w-40 items-center justify-center">
          <Image src={imageSrc} alt="Success" width={180} height={180} />
        </div>

        <h2 className="text-4xl font-bold text-heading">{title}</h2>
        <p className="mt-2 text-sm text-gray-500">{message}</p>
        <p className="mt-4 text-xs text-gray-400">
          You will be redirected automatically after confirming your email.
        </p>
      </div>
    </div>
  );
}
