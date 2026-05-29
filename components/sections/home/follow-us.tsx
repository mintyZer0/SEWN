"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail } from "react-feather";

export default function FollowUs() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  return (
    <div className="w-full py-16 md:pt-30 md:pb-20 px-4 md:px-8 bg-white md:bg-transparent md:bg-gradient-to-b md:from-transparent md:to-primary">
      <div className="max-w-lg md:max-w-4xl mx-auto text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-normal text-primary md:text-white mb-3 md:mb-4">
          follow our trail
        </h2>
        <p className="text-sm md:text-lg text-primary/80 md:text-white/90 mb-8 px-2 leading-relaxed">
          <span className="md:hidden">
            Enter your email below and be the first
            <br />
            to know about our latest sews, stories
            <br />
            and exclusive offers!
          </span>
          <span className="hidden md:inline">
            Enter your email below and be the first to know about
            <br />
            our latest sews, stories and exclusive offers!
          </span>
        </p>

        <form
          onSubmit={handleSubmit}
          className="w-full md:max-w-lg md:flex md:flex-row md:gap-0 md:bg-white md:rounded-2xl md:p-1 md:mb-8"
        >
          {/* Mobile input */}
          <label className="md:hidden flex items-center w-full rounded-2xl border border-primary/40 px-4 py-3 gap-3 text-primary/70">
            <Mail size={18} className="text-primary/60" />
            <input
              type="email"
              placeholder="Your Email"
              className="flex-1 bg-transparent placeholder:text-primary/50 focus:outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Desktop input */}
          <div className="hidden md:flex flex-1 w-full">
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
              className="w-auto px-8 py-3 bg-gradient-to-r from-[#FF975E] to-[#FFCFB1] text-[#7B3B7B] font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </div>
        </form>

        <Link
          href="/partner-with-us"
          className="hidden md:inline-block px-10 py-3 bg-white text-primary font-bold text-xl md:text-2xl rounded-2xl shadow-lg hover:bg-gray-50 transition-colors uppercase tracking-tight"
        >
          PARTNER WITH US
        </Link>
      </div>
    </div>
  );
}