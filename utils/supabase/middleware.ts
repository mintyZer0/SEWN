import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const isSellerApp = hostname.startsWith("seller.");
  const isAdminApp = hostname.startsWith("admin.");
  const path = request.nextUrl.pathname;

  console.log("Middleware Request:", { hostname, path, isSellerApp, isAdminApp });

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

  // Force admin subdomain auth pages to the admin root equivalents
  if (isAdminApp && (path === "/auth/login" || path === "/auth/signup")) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  let response: NextResponse = NextResponse.next({
    request: { headers: request.headers },
  });

  // Domain Rewrite Logic
  if (isSellerApp && !path.startsWith("/auth") && !path.startsWith("/data") && !path.startsWith("/_next") && path !== "/favicon.ico") {
    const rewriteUrl = new URL(`/seller-app${path === "/" ? "" : path}`, request.url);
    response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: request.headers },
    });
  } else if (isAdminApp && !path.startsWith("/auth") && !path.startsWith("/data") && !path.startsWith("/_next") && path !== "/favicon.ico") {
    const rewriteUrl = new URL(`/admin${path === "/" ? "" : path}`, request.url);
    response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: request.headers },
    });
  } else if (!isSellerApp && path.startsWith("/seller-app")) {
    return NextResponse.rewrite(new URL("/404", request.url));
  } else if (!isAdminApp && path.startsWith("/admin")) {
    return NextResponse.rewrite(new URL("/404", request.url));
  }

  const domain = hostname.includes("sewn.local") ? ".sewn.local" : undefined;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set({
              name,
              value,
              ...options,
              domain: name.startsWith("sb-") ? domain : options.domain,
            });
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const publicRoutes = ["/auth", "/error", "/login", "/signup", "/data"];
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // Redirect unauthenticated users
  if (!isPublicRoute && !user) {
    const loginUrl = new URL(isAdminApp ? "/login" : isSellerApp ? "/login" : "/auth/login", request.url);
    // Preserving query params can be dangerous during OAuth, but we'll keep it for now
    // except if it looks like a dead OAuth code
    if (!request.nextUrl.searchParams.has("code")) {
      request.nextUrl.searchParams.forEach((val, key) => {
        loginUrl.searchParams.set(key, val);
      });
    }
    return NextResponse.redirect(loginUrl);
  }

  // Admin App Access Control
  if (user && isAdminApp && !isPublicRoute && !path.startsWith("/auth") && path !== "/login") {
    let isAdmin = user.user_metadata?.role === "admin" || user.user_metadata?.user_type === "admin";
    if (!isAdmin) {
      const { data: profile } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", user.id)
        .single();
      isAdmin = profile?.user_type === "admin";
    }

    if (!isAdmin) {
      const protocol = hostname.includes(".local") || hostname.includes("localhost") ? "http" : "https";
      const adminLoginUrl = new URL("/login", `${protocol}://${host}`);
      adminLoginUrl.searchParams.set("error", "access_denied");
      
      console.log("Redirecting non-admin to admin login:", adminLoginUrl.toString());
      // we must log them out to change users
      await supabase.auth.signOut();
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  // Seller App Access Control
  // IMPORTANT: Do not block /auth or public paths, as they handle the login/signup/data logic itself
  if (user && isSellerApp && !isPublicRoute && !path.startsWith("/auth") && path !== "/login" && path !== "/signup" && path !== "/onboarding") {
    
    const isSellerMetadata = user.user_metadata?.role === "seller" || user.user_metadata?.user_type === "seller";
    
    let isSeller = isSellerMetadata;

    if (!isSeller) {
      const { data: profile } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", user.id)
        .single();
      isSeller = profile?.user_type === "seller";
    }

    if (!isSeller) {
      // If they are a buyer trying to access seller features, send them to the seller login page
      // so they can upgrade/sign in as a sewer
      const protocol = hostname.includes(".local") || hostname.includes("localhost") ? "http" : "https";
      const sellerLoginUrl = new URL("/login", `${protocol}://${host}`);
      sellerLoginUrl.searchParams.set("error", "must_register_as_sewer");
      
      console.log("Redirecting non-seller to seller login:", sellerLoginUrl.toString());
      return NextResponse.redirect(sellerLoginUrl);
    }
  }

  return response;
}
