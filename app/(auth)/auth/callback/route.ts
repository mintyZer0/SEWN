import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";
  const role = searchParams.get("role");

  if (code) {
    const supabase = await createClient();

    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && authData.user) {
      if (role === "sewer") {
        await supabase.from("users").update({ user_type: "seller" }).eq("id", authData.user.id);
        return NextResponse.redirect(`${origin}/sewer-center`);
      } else {
        await supabase.from("users").update({ user_type: "buyer" }).eq("id", authData.user.id);
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}${next}`);
}
