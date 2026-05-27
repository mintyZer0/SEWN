"use client";
import { useState } from "react";
import Link from "next/link";

export default function FollowUs() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  return (
    <div className="w-full pt-30 pb-20 px-4 md:px-8 bg-gradient-to-b from-transparent to-primary">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-normal text-white mb-4">
          follow our trail
        </h2>
        <p className="text-base md:text-lg text-white/90 mb-8 px-2">
          Enter your email below and be the first to know about
          <br className="hidden md:block"/>
          our latest sews, stories and exclusive offers!
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-lg flex-col sm:flex-row gap-3 sm:gap-0 bg-white rounded-2xl p-2 sm:p-1 mb-8"
        >
          <input
            type="email"
            placeholder="enter your email address"
            className="flex-1 w-full px-6 py-3 bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-[#FF975E] to-[#FFCFB1] text-[#7B3B7B] font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Subscribe
          </button>
        </form>

        <Link
          href="/partner-with-us"
          className="inline-block px-10 py-3 bg-white text-primary font-bold text-xl md:text-2xl rounded-2xl shadow-lg hover:bg-gray-50 transition-colors uppercase tracking-tight"
        >
          PARTNER WITH US
        </Link>
      </div>
    </div>
  );
}