import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/";

  // Use headers to get the correct origin
  const host = request.headers.get("host") || "sewn.local:3000";
  const protocol = host.includes(".local") || host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const redirectTo = new URL(next, origin);

  if (token_hash && type) {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && user) {
      // Check user type to decide where to send them after confirmation
      const { data: profile } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", user.id)
        .single();

      const isSewistDomain = host.startsWith("sewist.");

      if (type === "signup") {
        const fallbackUrl = isSewistDomain && profile?.user_type !== "sewist" 
          ? new URL("/onboarding", origin).toString() 
          : (profile?.user_type === "sewist" ? (isSewistDomain ? new URL("/", origin).toString() : new URL("/", `sewist.${origin.replace(/^https?:\/\//, "")}`).toString()) : redirectTo.toString());

        const verifiedUrl = new URL("/auth/verified", origin);
        verifiedUrl.searchParams.set("fallback", fallbackUrl);
        return NextResponse.redirect(verifiedUrl);
      }

      // Fallback for non-signup OTPs
      if (isSewistDomain && profile?.user_type !== "sewist") {
        const onboardingUrl = new URL("/onboarding", origin);
        return NextResponse.redirect(onboardingUrl);
      }

      if (profile?.user_type === "sewist") {
        // If it's a sewist, make sure they end up on the sewist subdomain dashboard
        const sewistUrl = new URL("/", origin);
        if (!isSewistDomain) {
          sewistUrl.host = `sewist.${host}`;
        }
        return NextResponse.redirect(sewistUrl);
      }

      return NextResponse.redirect(redirectTo);
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/error`);
}
