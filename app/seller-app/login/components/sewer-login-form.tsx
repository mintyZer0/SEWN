"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSewer, signInWithGoogleSewer, signInWithFacebookSewer, signInWithTwitterSewer } from "@/lib/auth-actions";
import SocialSignInButton from "@/app/(auth)/auth/login/components/social-sign-in-button";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function SewerLoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div
      className={cn("flex flex-col gap-6 items-center", className)}
      {...props}
    >
      <Card className="text-third h-200 w-150 border-0 shadow-none">
        <CardHeader className="flex flex-col items-center gap-2 text-center">
          <CardTitle className="text-8xl font-normal">Sewer Login</CardTitle>
          <CardDescription className="text-2xl text-third">
            Please fill in your basic info
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-2xl text-center text-lg animate-in fade-in zoom-in duration-200">
                  {error === "invalid_credentials" && "Invalid email or password. Please try again or register an account."}
                  {error === "must_register_as_sewer" && "You are registered as a customer. Please sign up as a Sewer to access this dashboard."}
                  {error === "email_not_confirmed" && "Please confirm your email address before logging in."}
                  {error === "oauth_exchange_failed" && "Failed to connect with your social account. Please try again."}
                  {error === "no_session" && "Session expired or not found. Please login again."}
                  {error === "unknown_error" && "An unexpected error occurred. Please try again."}
                  {!["invalid_credentials", "must_register_as_sewer", "email_not_confirmed", "oauth_exchange_failed", "no_session", "unknown_error"].includes(error) && "An unexpected error occurred. Please try again."}
                </div>
              )}
              <div className="grid gap-2">
                <Label className="text-2xl" htmlFor="email">
                  Email
                </Label>
                <Input
                  className="rounded-2xl text-lg! h-16! px-4! py-4!"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="text-2xl" htmlFor="password">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    className="rounded-2xl text-lg! h-16! px-4! py-4!"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Button
                type="submit"
                formAction={loginSewer}
                className="w-full h-20 rounded-3xl bg-secondary-gradient-b text-white text-4xl font-semibold shadow-md hover:bg-secondary-gradient-b/95 cursor-pointer"
              >
                LOGIN
              </Button>
              <div className="flex flex-row justify-around">
                <SocialSignInButton
                  imageSrc="/assets/login-page/gmail.png"
                  altText="Google Icon"
                  onSignIn={() => signInWithGoogleSewer("login")}
                />
                <SocialSignInButton
                  imageSrc="/assets/login-page/facebook.png"
                  altText="Facebook Icon"
                  onSignIn={() => signInWithFacebookSewer("login")}
                />
                <SocialSignInButton
                  imageSrc="/assets/login-page/facebook.png"
                  altText="X Icon"
                  onSignIn={() => signInWithTwitterSewer("login")}
                />
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up as Sewer
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
