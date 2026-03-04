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
import { RegisterModal } from "@/components/modals/register-modal";
import { SuccessModal } from "@/components/modals/success-modal";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const variants = {
  customer: {
    style: "text-white",
    subtitle: "Please fill in your basic info",
    submitButtonClass: "bg-background",
  },
  sewer: {
    style: "text-third",
    subtitle: "as a SEWN sewer",
    submitButtonClass: "bg-secondary-gradient-b text-white",
  },
} as const;

interface SignupFormProps extends React.ComponentProps<typeof Card> {
  variant?: keyof typeof variants;
}

export function SignupForm({
  className,
  variant = "customer",
  ...props
}: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const [capturedData, setCapturedData] = useState<{
    username: string;
    email: string;
    password: string;
  } | null>(null);

  // Listen for email confirmation across tabs and auto-redirect
  useEffect(() => {
    if (!showSuccess) return;

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [showSuccess, router]);

  const openRegisterModal = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (!username || !email || !password || !confirmPassword) {
      setFormError("Please fill in all fields before continuing.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setFormError("");
    setCapturedData({ username, email, password });
    setShowRegisterModal(true);
  };

  return (
    <>
      <Card
        {...props}
        className={cn(
          "h-200 w-170 border-0 shadow-none",
          variants[variant].style,
          className,
        )}
      >
        <CardHeader className="flex-row justify-center items-baseline gap-4 caret-transparent">
          <CardTitle className="text-8xl font-normal">Sign Up</CardTitle>
          <CardDescription className="text-2xl">
            {variants[variant].subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={openRegisterModal} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label className="text-2xl" htmlFor="username">
                Username
              </Label>
              <Input
                className="rounded-2xl text-lg! h-16! px-4! py-4!"
                id="username"
                name="username"
                type="text"
                placeholder="johndoe"
                required
              />
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

            {formError ? (
              <p className="text-sm text-red-300">{formError}</p>
            ) : null}

            <Button
              type="submit"
              className={`w-full h-20 rounded-3xl ${variants[variant].submitButtonClass} text-4xl font-semibold shadow-md hover:bg-background/95 cursor-pointer`}
            >
              Register
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/auth/login" className="underline underline-offset-4">
              Sign in
            </a>
          </div>
        </CardContent>
      </Card>

      {showRegisterModal && capturedData ? (
        <RegisterModal
          variant={variant}
          capturedData={capturedData}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={() => {
            setShowRegisterModal(false);
            setShowSuccess(true);
          }}
          onError={(error) => setFormError(error)}
        />
      ) : null}

      {showSuccess ? <SuccessModal /> : null}
    </>
  );
}
