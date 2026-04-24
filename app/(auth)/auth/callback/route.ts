import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limit";
import {
  getSafeOriginFromHeaders,
  sanitizeRelativeRedirectPath,
} from "@/lib/security/request";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const nextPath = sanitizeRelativeRedirectPath(searchParams.get("next"), "/");
  const origin = getSafeOriginFromHeaders(request.headers);
  const { hostname } = new URL(origin);

  const rateLimit = checkRateLimit(
    request.headers,
    "oauth-callback",
    30,
    5 * 60_000,
  );
  if (!rateLimit.allowed) {
    return NextResponse.redirect(`${origin}/auth/login?error=rate_limited`);
  }

  if (code) {
    const supabase = await createClient();

    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      return NextResponse.redirect(`${origin}/auth/login?error=oauth_exchange_failed`);
    }

    if (authData.user) {
      const { email, user_metadata } = authData.user;
      const firstName = user_metadata?.full_name?.split(" ")[0] || user_metadata?.name?.split(" ")[0] || "";
      const lastName = user_metadata?.full_name?.split(" ").slice(1).join(" ") || user_metadata?.name?.split(" ").slice(1).join(" ") || "";

      // 1. Check for existing profile
      const { data: profile } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", authData.user.id)
        .maybeSingle();

      const isSewistDomain = hostname.startsWith("sewist.");
      const isAdminDomain = hostname.startsWith("admin.");

      if (isSewistDomain) {
        // Ensure profile exists
        if (!profile) {
          await supabase.from("users").upsert({ 
            id: authData.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            user_type: "buyer" 
          }, { onConflict: 'id' });
        }

        const currentType = profile?.user_type || "buyer";

        if (currentType === "sewist") {
          // Check verification
          const { data: verification } = await supabase
            .from("sewist_verifications")
            .select("verification_status")
            .eq("user_id", authData.user.id)
            .maybeSingle();

          if (verification?.verification_status === "verified") {
            return NextResponse.redirect(`${origin}/`);
          } else {
            await supabase.auth.signOut();
            const sewistLogin = new URL("/login", origin);
            sewistLogin.searchParams.set("error", "must_be_verified");
            return NextResponse.redirect(sewistLogin.toString());
          }
        } else {
          // Buyer on sewist domain -> onboarding
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      } else if (isAdminDomain) {
        if (profile?.user_type !== "admin") {
          await supabase.auth.signOut();
          const adminLogin = new URL("/login", origin);
          adminLogin.searchParams.set("error", "access_denied");
          return NextResponse.redirect(adminLogin.toString());
        }
        return NextResponse.redirect(`${origin}/`);
      } else {
        if (!profile) {
          await supabase.from("users").upsert({ 
            id: authData.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            user_type: "buyer" 
          }, { onConflict: 'id' });
        }
        
        const targetUrl = new URL(nextPath, origin);
        return NextResponse.redirect(targetUrl.toString());
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=no_session`);
}
