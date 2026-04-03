import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const isSellerApp = hostname.startsWith("seller.");
  const path = request.nextUrl.pathname;

  console.log("Middleware Request:", { hostname, path, isSellerApp });

  // Force seller subdomain auth pages to the seller root equivalents
  if (isSellerApp && path === "/auth/login") {
    const loginUrl = new URL("/login", request.url);
    request.nextUrl.searchParams.forEach((val, key) => loginUrl.searchParams.set(key, val));
    return NextResponse.redirect(loginUrl);
  }
  if (isSellerApp && path === "/auth/signup") {
    const signupUrl = new URL("/signup", request.url);
    request.nextUrl.searchParams.forEach((val, key) => signupUrl.searchParams.set(key, val));
    return NextResponse.redirect(signupUrl);
  }

  let response: NextResponse = NextResponse.next({
    request: { headers: request.headers },
  });

  // Domain Rewrite Logic
  if (isSellerApp && !path.startsWith("/auth") && !path.startsWith("/_next") && path !== "/favicon.ico") {
    const rewriteUrl = new URL(`/seller-app${path === "/" ? "" : path}`, request.url);
    response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: request.headers },
    });
  } else if (!isSellerApp && path.startsWith("/seller-app")) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  const domain = hostname.includes("sewn.local") ? ".sewn.local" : hostname.includes("localhost") ? "localhost" : undefined;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          // If we already have a rewrite/redirect response, we need to update its cookies too
          response.cookies.set({ 
            name, 
            value, 
            ...options,
            domain: name.startsWith("sb-") || name.includes("-auth-token") ? domain : options.domain
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response.cookies.set({ 
            name, 
            value: "", 
            ...options,
            domain: name.startsWith("sb-") || name.includes("-auth-token") ? domain : options.domain
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const publicRoutes = ["/auth", "/error", "/login", "/signup"];
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // Redirect unauthenticated users
  if (!isPublicRoute && !user) {
    const loginUrl = new URL(isSellerApp ? "/login" : "/auth/login", request.url);
    // Preserving query params can be dangerous during OAuth, but we'll keep it for now
    // except if it looks like a dead OAuth code
    if (!request.nextUrl.searchParams.has("code")) {
      request.nextUrl.searchParams.forEach((val, key) => {
        loginUrl.searchParams.set(key, val);
      });
    }
    return NextResponse.redirect(loginUrl);
  }

  // Seller App Access Control
  if (user && isSellerApp && path !== "/login" && path !== "/signup") {
    const { data: profile } = await supabase
      .from("users")
      .select("user_type")
      .eq("id", user.id)
      .single();

    if (!profile || profile.user_type !== "seller") {
      // If they are a buyer trying to access seller features, send them to the seller login page
      // so they can upgrade/sign in as a sewer
      const sellerLoginUrl = new URL("/login", request.url);
      console.log("Redirecting non-seller to seller login:", sellerLoginUrl.toString());
      return NextResponse.redirect(sellerLoginUrl);
    }
  }

  return response;
}
