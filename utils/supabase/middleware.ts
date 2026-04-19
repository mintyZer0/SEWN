import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const isSewistApp = hostname.startsWith("sewist.");
  const isAdminApp = hostname.startsWith("admin.");
  const path = request.nextUrl.pathname;

  console.log("Middleware Request:", { hostname, path, isSewistApp, isAdminApp });

  // Force sewist subdomain auth pages to the sewist root equivalents
  if (isSewistApp && path === "/auth/login") {
    const loginUrl = new URL("/login", request.url);
    request.nextUrl.searchParams.forEach((val, key) => loginUrl.searchParams.set(key, val));
    return NextResponse.redirect(loginUrl);
  }
  if (isSewistApp && path === "/auth/signup") {
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
  if (isSewistApp && !path.startsWith("/auth") && !path.startsWith("/data") && !path.startsWith("/_next") && path !== "/favicon.ico") {
    const targetPath = path.startsWith("/sewist-app")
      ? path
      : `/sewist-app${path === "/" ? "" : path}`;
    const rewriteUrl = new URL(targetPath, request.url);
    response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: request.headers },
    });
  } else if (isAdminApp && !path.startsWith("/auth") && !path.startsWith("/data") && !path.startsWith("/_next") && path !== "/favicon.ico") {
    const targetPath = path.startsWith("/admin")
      ? path
      : `/admin${path === "/" ? "" : path}`;
    const rewriteUrl = new URL(targetPath, request.url);
    response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: request.headers },
    });
  } else if (!isSewistApp && path.startsWith("/sewist-app")) {
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
    const loginUrl = new URL(isAdminApp ? "/login" : isSewistApp ? "/login" : "/auth/login", request.url);
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

  // Sewist App Access Control
  // IMPORTANT: Do not block /auth or public paths, as they handle the login/signup/data logic itself
  if (user && isSewistApp && !isPublicRoute && !path.startsWith("/auth") && path !== "/login" && path !== "/signup" && path !== "/onboarding") {
    
    const isSewistMetadata = user.user_metadata?.role === "sewist" || user.user_metadata?.user_type === "sewist";
    
    let isSewist = isSewistMetadata;

    if (!isSewist) {
      const { data: profile } = await supabase
        .from("users")
        .select("user_type")
        .eq("id", user.id)
        .single();
      isSewist = profile?.user_type === "sewist";
    }

    if (!isSewist) {
      // If they are a buyer trying to access sewist features, send them to the sewist login page
      // so they can upgrade/sign in as a sewist
      const protocol = hostname.includes(".local") || hostname.includes("localhost") ? "http" : "https";
      const sewistLoginUrl = new URL("/login", `${protocol}://${host}`);
      sewistLoginUrl.searchParams.set("error", "must_register_as_sewist");
      
      console.log("Redirecting non-sewist to sewist login:", sewistLoginUrl.toString());
      return NextResponse.redirect(sewistLoginUrl);
    }

    const { data: verification } = await supabase
      .from("sewist_verifications")
      .select("verification_status")
      .eq("user_id", user.id)
      .single();

    if (verification?.verification_status !== "verified") {
      const protocol = hostname.includes(".local") || hostname.includes("localhost") ? "http" : "https";
      const sewistLoginUrl = new URL("/login", `${protocol}://${host}`);
      sewistLoginUrl.searchParams.set("error", "must_be_verified");
      await supabase.auth.signOut();
      return NextResponse.redirect(sewistLoginUrl);
    }
  }

  return response;
}
