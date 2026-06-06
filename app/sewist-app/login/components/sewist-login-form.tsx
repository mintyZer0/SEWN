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
import { loginSewist, signInWithGoogleSewist, signInWithFacebookSewist, signInWithTwitterSewist } from "@/lib/auth-actions";
import SocialSignInButton from "@/app/(auth)/auth/login/components/social-sign-in-button";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function SewistLoginForm({
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
      <Card className="text-third h-auto md:h-200 w-full md:w-150 border-0 shadow-none bg-transparent">
        <CardHeader className="flex flex-col items-center gap-2 text-center">
          <CardTitle className="text-5xl md:text-8xl font-normal">Sewist Login</CardTitle>
          <CardDescription className="text-lg md:text-2xl text-third">
            Please fill in your basic info
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-4 md:gap-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl md:rounded-2xl text-center text-sm md:text-lg animate-in fade-in zoom-in duration-200">
                  {error === "invalid_credentials" && "Invalid email or password. Please try again or register an account."}
                  {error === "must_register_as_sewist" && "You are registered as a customer. Please sign up as a Sewist to access this dashboard."}
                  {error === "must_be_verified" && "Your sewist account is pending verification. Please wait for admin approval before accessing the dashboard."}
                  {error === "email_not_confirmed" && "Please confirm your email address before logging in."}
                  {error === "oauth_exchange_failed" && "Failed to connect with your social account. Please try again."}
                  {error === "no_session" && "Session expired or not found. Please login again."}
                  {error === "unknown_error" && "An unexpected error occurred. Please try again."}
                  {!["invalid_credentials", "must_register_as_sewist", "must_be_verified", "email_not_confirmed", "oauth_exchange_failed", "no_session", "unknown_error"].includes(error) && "An unexpected error occurred. Please try again."}
                </div>
              )}
              <div className="grid gap-2">
                <Label className="text-lg md:text-2xl" htmlFor="email">
                  Email
                </Label>
                <Input
                  className="rounded-xl md:rounded-2xl text-base md:text-lg! h-12 md:h-16! px-4! py-4!"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label className="text-lg md:text-2xl" htmlFor="password">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    className="rounded-xl md:rounded-2xl text-base md:text-lg! h-12 md:h-16! px-4! py-4!"
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
                  className="ml-auto inline-block text-xs md:text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Button
                type="submit"
                formAction={loginSewist}
                className="w-full h-14 md:h-20 rounded-2xl md:rounded-3xl bg-secondary-gradient-b text-white text-2xl md:text-4xl font-semibold shadow-md hover:bg-secondary-gradient-b/95 cursor-pointer mt-2 md:mt-0"
              >
                LOGIN
              </Button>
              <div className="flex flex-row justify-around">
                <SocialSignInButton
                  imageSrc="/assets/login-page/gmail.png"
                  altText="Google Icon"
                  onSignIn={() => signInWithGoogleSewist("login")}
                />
                <SocialSignInButton
                  imageSrc="/assets/login-page/facebook.png"
                  altText="Facebook Icon"
                  onSignIn={() => signInWithFacebookSewist("login")}
                />
                <SocialSignInButton
                  imageSrc="/assets/login-page/facebook.png"
                  altText="X Icon"
                  onSignIn={() => signInWithTwitterSewist("login")}
                />
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                Sign up as Sewist
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
