import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isLocalHost(host: string) {
  return (
    host.includes("localhost") ||
    host.startsWith("127.") ||
    host.endsWith(".local") ||
    host.includes(".local:")
  );
}

export async function updateSession(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const shouldSecure = !isLocalHost(host);
  const isSewistApp = hostname.startsWith("sewist.");
  const isAdminApp = hostname.startsWith("admin.");
  const path = request.nextUrl.pathname;

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
  if (isSewistApp && !path.startsWith("/auth") && !path.startsWith("/data") && !path.startsWith("/api") && !path.startsWith("/_next") && path !== "/favicon.ico") {
    const targetPath = path.startsWith("/sewist-app")
      ? path
      : `/sewist-app${path === "/" ? "" : path}`;
    const rewriteUrl = new URL(targetPath, request.url);
    response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: request.headers },
    });
  } else if (isAdminApp && !path.startsWith("/auth") && !path.startsWith("/data") && !path.startsWith("/api") && !path.startsWith("/_next") && path !== "/favicon.ico") {
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
              path: options.path ?? "/",
              sameSite: options.sameSite ?? "lax",
              httpOnly: options.httpOnly ?? true,
              secure: options.secure ?? shouldSecure,
              domain: name.startsWith("sb-") ? domain : options.domain,
            });
          });
        },
      },
    }
  );

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error: any) {
    console.error("Middleware Supabase auth error");
    // Mitigate "Invalid UTF-8 sequence" / malformed base64 cookie error
    if (error?.message?.includes("Invalid UTF-8") || error?.message?.includes("base64") || error?.name === "TypeError") {
      const loginUrl = new URL(isAdminApp ? "/login" : isSewistApp ? "/login" : "/auth/login", request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      
      request.cookies.getAll().forEach((cookie) => {
        if (cookie.name.startsWith("sb-")) {
          redirectResponse.cookies.set({
            name: cookie.name,
            value: "",
            maxAge: 0,
            domain: domain,
          });
        }
      });
      return redirectResponse;
    }
  }

  const publicRoutes = ["/auth", "/error", "/login", "/signup", "/data", "/api"];
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
