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
import { login, signInWithGoogle, signInWithFacebook, signInWithTwitter } from "@/lib/auth-actions";
import SocialSignInButton from "./social-sign-in-button";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div
      className={cn("flex flex-col gap-6 items-center", className)}
      {...props}
    >
      <Card className="text-white h-auto md:h-200 w-full md:w-150 border-0 shadow-none bg-transparent">
        <CardHeader className="flex-col md:flex-row justify-center items-center md:items-baseline gap-2 md:gap-4 text-center md:text-left">
          <CardTitle className="text-5xl md:text-8xl font-normal">Login</CardTitle>
          <CardDescription className="text-lg md:text-2xl">
            Please fill in your basic info
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-4 md:gap-6">
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
                formAction={login}
                className="w-full h-14 md:h-20 rounded-2xl md:rounded-3xl bg-background text-heading text-2xl md:text-4xl font-semibold shadow-md hover:bg-background/95 cursor-pointer mt-2 md:mt-0"
              >
                LOGIN
              </Button>
              <div className="flex flex-row justify-around">
                <SocialSignInButton
                  imageSrc="/assets/login-page/gmail.png"
                  altText="Google Icon"
                  onSignIn={signInWithGoogle}
                />
                <SocialSignInButton
                  imageSrc="/assets/login-page/facebook.png"
                  altText="Facebook Icon"
                  onSignIn={signInWithFacebook}
                />
                <SocialSignInButton
                  imageSrc="/assets/login-page/facebook.png"
                  altText="X Icon"
                  onSignIn={signInWithTwitter}
                />
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/auth/signup" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
