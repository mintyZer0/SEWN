import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const role = searchParams.get("role");
  
  const host = request.headers.get("host") || "sewn.local:3000";
  const protocol = host.includes(".local") || host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  console.log("OAuth Callback Triggered:", { role, origin, next, hasCode: !!code });

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

      if (role === "sewer") {
        console.log("Ensuring user is a seller in public.users...");
        await supabase.from("users").upsert({ 
          id: authData.user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          user_type: "seller" 
        }, { onConflict: 'id' });
        
        return NextResponse.redirect(`${origin}/`);
      } else {
        console.log("Ensuring user is a buyer in public.users...");
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
