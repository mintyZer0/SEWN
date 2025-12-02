"use client";

import { useState } from "react";

export default function FollowUs() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
  };

  return (
    <div className="w-full py-16 px-8 bg-linear-to-t from-5% from-[#FFE063] to-transparent">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl font-normal text-primary mb-4">
          follow our trail
        </h2>
        <p className="text-lg text-gray-700 mb-8">
          Enter your email below and be the first to know about
          <br />
          our latest sews, stories and exclusive offers!
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex relative items-center justify-center max-w-3xl mx-auto"
        >
          <input
            type="email"
            placeholder="enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-4 rounded-full bg-white text-gray-600 placeholder:text-primary/60 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button
            type="submit"
            className="absolute right-0 px-12 py-4 bg-[#F8E597] text-primary font-semibold rounded-full hover:cursor-pointer hover:bg-opacity/90 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
}
