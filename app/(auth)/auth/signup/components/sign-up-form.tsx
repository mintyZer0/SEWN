"use client";
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
import { signup } from "@/lib/auth-actions";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  return (
    <Card {...props} className="text-white h-200 w-170 border-0 shadow-none">
      <CardHeader className="flex-row justify-center items-baseline gap-4">
        <CardTitle className="text-8xl font-normal">Sign Up</CardTitle>
        <CardDescription className="text-2xl">
          Please fill in your basic info
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-2xl" htmlFor="first-name">
                  First Name
                </Label>
                <Input
                  className="rounded-2xl text-lg! h-16! px-4! py-4!"
                  id="first-name"
                  name="first-name"
                  type="text"
                  placeholder="John"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-2xl" htmlFor="last-name">
                  Last Name
                </Label>
                <Input
                  className="rounded-2xl text-lg! h-16! px-4! py-4!"
                  id="last-name"
                  name="last-name"
                  type="text"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>
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
              <Label className="text-2xl" htmlFor="password">
                Password
              </Label>
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
            </div>
            <div className="grid gap-2">
              <Label className="text-2xl" htmlFor="confirm-password">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  className="rounded-2xl text-lg! h-16! px-4! py-4!"
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
            <Button
              formAction={signup}
              type="submit"
              className="w-full h-20 rounded-3xl bg-background text-heading text-4xl font-semibold shadow-md hover:bg-background/95 cursor-pointer"
            >
              CREATE ACCOUNT
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/auth/login" className="underline underline-offset-4">
              Sign in
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
