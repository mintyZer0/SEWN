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
import { loginAdmin } from "@/lib/auth-actions";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function AdminLoginForm({
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
      <Card className="text-primary h-200 w-150 border-0 shadow-none bg-white">
        <CardHeader className="flex flex-col items-center gap-2 text-center">
          <CardTitle className="text-8xl font-normal text-primary">Admin Login</CardTitle>
          <CardDescription className="text-2xl text-primary/70">
            Please enter your administrator credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-2xl text-center text-lg animate-in fade-in zoom-in duration-200">
                  {error === "invalid_credentials" && "Invalid email or password. Please try again."}
                  {error === "access_denied" && "Access Denied. This account does not have administrator privileges."}
                  {error === "email_not_confirmed" && "Please confirm your email address before logging in."}
                  {error === "unknown_error" && "An unexpected error occurred. Please try again."}
                  {!["invalid_credentials", "access_denied", "email_not_confirmed", "unknown_error"].includes(error) && "An unexpected error occurred. Please try again."}
                </div>
              )}
              <div className="grid gap-2">
                <Label className="text-2xl" htmlFor="email">
                  Email
                </Label>
                <Input
                  className="rounded-2xl text-lg! h-16! px-4! py-4! border-primary/20 focus-visible:ring-primary"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@sewn.com"
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
                    className="rounded-2xl text-lg! h-16! px-4! py-4! border-primary/20 focus-visible:ring-primary"
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-primary/50 hover:text-primary"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                formAction={loginAdmin}
                className="w-full h-20 rounded-3xl bg-primary text-white text-4xl font-semibold shadow-md hover:bg-primary-dark transition-all active:scale-95 cursor-pointer"
              >
                LOGIN
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
