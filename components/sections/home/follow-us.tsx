"use client";
import { useState } from "react";

export default function FollowUs() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  return (
    <div className="w-full py-12 md:py-16 px-4 md:px-8 bg-linear-to-t from-5% from-[#FFE063] to-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-normal text-heading mb-4">
          follow our trail
        </h2>
        <p className="text-base md:text-lg text-gray-700 mb-8 px-2">
          Enter your email below and be the first to know about
          <br className="hidden md:block"/>
          our latest sews, stories and exclusive offers!
        </p>

        {/* Stacks on mobile, overlaps side by side on desktop */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row relative items-center justify-center w-full max-w-3xl mx-auto gap-4 sm:gap-0"
        >
          <input
            type="email"
            placeholder="enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:flex-1 px-6 py-4 rounded-full bg-white text-gray-600 placeholder:text-heading/60 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm sm:shadow-none"
            required
          />
          <button
            type="submit"
            className="w-full sm:w-auto static sm:absolute sm:right-0 px-12 py-4 bg-[#F8E597] text-heading font-semibold rounded-full hover:cursor-pointer hover:bg-opacity/90 transition-colors shadow-md sm:shadow-none"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}