import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const isSellerApp = host.startsWith("seller.");
  const path = request.nextUrl.pathname;

  let response: NextResponse;

  // Domain Rewrite Logic
  if (isSellerApp && !path.startsWith("/auth")) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/seller-app${path === "/" ? "" : path}`;
    response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: request.headers },
    });
  } else if (!isSellerApp && path.startsWith("/seller-app")) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = "/404";
    response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: request.headers },
    });
  } else {
    response = NextResponse.next({
      request: { headers: request.headers },
    });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = request.cookies.get(name)?.value;
          return cookie;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const publicRoutes = ["/auth", "/error", "/login", "/signup"];
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // Redirect unauthenticated users
  if (!isPublicRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = isSellerApp ? "/login" : "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  // Seller App Access Control
  if (user && isSellerApp) {
    const { data: profile } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (!profile || profile.user_type !== "seller") {
      // redirect buyers away from seller dashboard
      const homeUrl = request.nextUrl.clone();
      homeUrl.host = host.replace("seller.", "");
      homeUrl.pathname = "/";
      return NextResponse.redirect(homeUrl);
    }
  }

  // Buyer App Access Control: Prevent sellers from seeing buyer dashboard?
  // If we only wanted buyers on the main site, we could add logic here.
  // But usually sellers can buy too, so we'll leave it alone.

  return response;
}
