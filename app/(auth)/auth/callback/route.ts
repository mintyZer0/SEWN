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
        .single();

      if (role === "sewer") {
        console.log("Sewer-intent OAuth login detected.");
        
        if (profile?.user_type === "buyer") {
          if (intent === "login") {
            // Login attempt by a buyer - show error
            console.log("Buyer trying to login as sewer. Blocking.");
            await supabase.auth.signOut();
            return NextResponse.redirect(`${origin}/login?error=must_register_as_sewer`);
          } else {
            // Signup attempt by a buyer - send to onboarding to upgrade
            console.log("Existing buyer account found during signup. Redirecting to onboarding.");
            return NextResponse.redirect(`${origin}/onboarding`);
          }
        }

        // 2. If new user or already seller, ensure seller type and go to dashboard
        // If it's a new user, they should probably go to onboarding anyway?
        if (!profile) {
          await supabase.from("users").upsert({ 
            id: authData.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            user_type: "seller" 
          }, { onConflict: 'id' });
          return NextResponse.redirect(`${origin}/onboarding`);
        }

        return NextResponse.redirect(`${origin}/`);
      } else {
        // Normal Buyer flow
        console.log("Buyer-intent OAuth login detected.");
        
        if (profile?.user_type === "seller") {
          // If a seller logs in through the buyer side, they just stay a seller
          const buyerUrl = new URL(next, origin);
          buyerUrl.host = buyerUrl.host.replace("seller.", "");
          return NextResponse.redirect(buyerUrl);
        }

        await supabase.from("users").upsert({ 
          id: authData.user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          user_type: "buyer" 
        }, { onConflict: 'id' });
        
        const buyerUrl = new URL(next, origin);
        buyerUrl.host = buyerUrl.host.replace("seller.", "");
        console.log("Redirecting buyer to:", buyerUrl.toString());
        return NextResponse.redirect(buyerUrl);
      }
    }
  }

  console.warn("OAuth Callback reached end without session. Redirecting to login.");
  return NextResponse.redirect(`${origin}/auth/login?error=no_session`);
}
