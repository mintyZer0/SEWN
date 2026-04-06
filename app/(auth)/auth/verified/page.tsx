"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function VerifiedPage() {
  const searchParams = useSearchParams();
  const fallbackUrl = searchParams.get("fallback") || "/";

  useEffect(() => {
    const syncSessionAndClose = async () => {
      // 1. Initialize Supabase client
      const supabase = createClient();
      
      // 2. Fetching the session manually forces the client to read the newly set cookies
      // and write them to localStorage. This triggers the 'storage' event and 'SIGNED_IN'
      // broadcast that wakes up the original tab!
      await supabase.auth.getSession();

      // 3. Attempt to close this newly opened tab after a short delay
      setTimeout(() => {
        window.close();
      }, 3000);
    };

    syncSessionAndClose();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center font-jost">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-md w-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Email Verified!</h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Your email has been confirmed successfully. If you still have your original registration tab open, it will automatically update.
          <br /><br />
          You may now safely close this window.
        </p>
        <a 
          href={fallbackUrl} 
          className="inline-block w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
        >
          Continue
        </a>
      </div>
    </div>
  );
}
