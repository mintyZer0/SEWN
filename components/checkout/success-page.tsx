"use client";

import Image from "next/image";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-100 h-100 bg-white rounded-full flex items-center justify-center mb-8 shadow-lg">
          <Image
            src="/assets/logo.png"
            alt="SEWN Logo"
            width={300}
            height={300}
          />
        </div>

        <p className="text-primary text-2xl mb-2">Success!</p>
        <h1 className="text-5xl md:text-6xl font-light text-primary text-center mb-8">
          Product is on the way!
        </h1>

        <Link href="/shop">
          <button className="bg-orchid text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
            Browse more Products
          </button>
        </Link>
      </div>
    </div>
  );
}
