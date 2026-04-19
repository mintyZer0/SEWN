import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const role = searchParams.get("role");
  const intent = searchParams.get("intent") || "login";
  
  const host = request.headers.get("host") || "sewn.local:3000";
  const protocol = host.includes(".local") || host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  console.log("OAuth Callback Triggered:", { role, intent, origin, next, hasCode: !!code });

  if (code) {
    const supabase = await createClient();

    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error("OAuth Exchange Error:", error.message);
      return NextResponse.redirect(`${origin}/auth/login?error=oauth_exchange_failed`);
    }

    if (authData.user) {
      console.log("OAuth User Authenticated:", authData.user.id);
      
      const { email, user_metadata } = authData.user;
      const firstName = user_metadata?.full_name?.split(" ")[0] || user_metadata?.name?.split(" ")[0] || "";
      const lastName = user_metadata?.full_name?.split(" ").slice(1).join(" ") || user_metadata?.name?.split(" ").slice(1).join(" ") || "";

      // 1. Check for existing profile
      const { data: profile } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", authData.user.id)
        .maybeSingle();

      const isSewistDomain = host.startsWith("sewist.");
      const isAdminDomain = host.startsWith("admin.");

      if (isSewistDomain) {
        console.log("Login from Sewist subdomain.");
        
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
            const mainLogin = new URL("/login", origin.replace("sewist.", ""));
            mainLogin.searchParams.set("error", "must_be_verified");
            return NextResponse.redirect(mainLogin.toString());
          }
        } else {
          // Buyer on sewist domain -> onboarding
          return NextResponse.redirect(`${origin}/onboarding`);
        }
      } else if (isAdminDomain) {
        console.log("Login from Admin subdomain.");
        
        if (profile?.user_type !== "admin") {
          await supabase.auth.signOut();
          const adminLogin = new URL("/login", origin);
          adminLogin.searchParams.set("error", "access_denied");
          return NextResponse.redirect(adminLogin.toString());
        }
        return NextResponse.redirect(`${origin}/`);
      } else {
        // Main domain login
        console.log("Login from main domain.");
        
        if (!profile) {
          await supabase.from("users").upsert({ 
            id: authData.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            user_type: "buyer" 
          }, { onConflict: 'id' });
        }
        
        const targetUrl = new URL(next, origin);
        return NextResponse.redirect(targetUrl.toString());
      }
    }
  }

  console.warn("OAuth Callback reached end without session. Redirecting to login.");
  return NextResponse.redirect(`${origin}/auth/login?error=no_session`);
}
