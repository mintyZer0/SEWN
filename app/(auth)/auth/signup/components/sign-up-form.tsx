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
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [formError, setFormError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const [capturedData, setCapturedData] = useState<{
    username: string;
    email: string;
    password: string;
  } | null>(null);

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
      <Card {...props} className="text-white h-200 w-170 border-0 shadow-none">
        <CardHeader className="flex-row justify-center items-baseline gap-4 caret-transparent">
          <CardTitle className="text-8xl font-normal">Sign Up</CardTitle>
          <CardDescription className="text-2xl">
            Please fill in your basic info
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
              className="w-full h-20 rounded-3xl bg-background text-heading text-4xl font-semibold shadow-md hover:bg-background/95 cursor-pointer"
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

      {showRegisterModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRegisterModal(false)}
          />

          <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white text-heading shadow-2xl text-4xl p-8 px-12">
            <button
              type="button"
              onClick={() => setShowRegisterModal(false)}
              className="absolute right-6 top-6 text-heading cursor-pointer"
              aria-label="Close register details form"
            >
              ←
            </button>

            <div className="mb-6">
              <h2 className="text-6xl font-normal">Register</h2>
              <p className="text-sm">
                For smooth transactions, we need additional user data
              </p>
            </div>

            <form
              className="space-y-4 px-4"
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                const formData = new FormData(e.currentTarget);
                const result = await signup(formData);
                setSubmitting(false);
                if (result.success) {
                  setShowRegisterModal(false);
                  setShowSuccess(true);
                } else {
                  setFormError(result.error || "Something went wrong.");
                }
              }}
            >
              <input
                type="hidden"
                name="username"
                value={capturedData?.username || ""}
              />
              <input
                type="hidden"
                name="email"
                value={capturedData?.email || ""}
              />
              <input
                type="hidden"
                name="password"
                value={capturedData?.password || ""}
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1 col-span-2 ">
                  <Label htmlFor="first-name" className="text-sm text-heading">
                    First Name
                  </Label>
                  <Input
                    id="first-name"
                    name="first-name"
                    placeholder="Ethan Mathew"
                    className="rounded-2xl border-heading"
                    required
                  />
                </div>
                <div className="grid gap-1 col-span-2">
                  <Label htmlFor="last-name" className="text-sm text-heading">
                    Last Name
                  </Label>
                  <Input
                    id="last-name"
                    name="last-name"
                    placeholder="Malonzo"
                    className="rounded-2xl border-heading"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="province" className="text-sm text-heading">
                    Province
                  </Label>
                  <select
                    id="province"
                    name="province"
                    className="h-10 rounded-2xl border border-heading px-3 text-sm"
                    defaultValue="Tarlac"
                  >
                    <option value="Tarlac">Tarlac</option>
                  </select>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="city" className="text-sm text-heading">
                    City/Municipality
                  </Label>
                  <select
                    id="city"
                    name="city"
                    className="h-10 rounded-2xl border border-heading px-3 text-sm"
                    defaultValue="Tarlac City"
                  >
                    <option value="Tarlac City">Tarlac City</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-1">
                <Label
                  htmlFor="customer-address"
                  className="text-sm text-heading"
                >
                  Customer Address
                </Label>
                <Input
                  id="customer-address"
                  name="customer-address"
                  placeholder="Sitio Diyan Lang, Sa tabi tabi, Tarlac City, Tarlac"
                  className="rounded-2xl border-heading"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label
                    htmlFor="phone-number"
                    className="text-sm text-heading"
                  >
                    Phone Number
                  </Label>
                  <Input
                    id="phone-number"
                    name="phone-number"
                    placeholder="0967 676 7676"
                    className="rounded-2xl border-heading"
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="landline" className="text-sm text-heading">
                    Landline
                  </Label>
                  <Input
                    id="landline"
                    name="landline"
                    placeholder="N/A"
                    className="rounded-2xl border-heading"
                  />
                </div>
              </div>

              {formError ? (
                <p className="text-sm text-red-500">{formError}</p>
              ) : null}

              <Button
                type="submit"
                disabled={submitting}
                className="mt-2 h-14 w-full rounded-xl text-3xl font-semibold text-white bg-orchid hover:bg-background disabled:opacity-50"
              >
                {submitting ? "Registering..." : "Register"}
              </Button>
            </form>
          </div>
        </div>
      ) : null}

      {showSuccess ? (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center px-4 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="absolute right-4 top-4 text-2xl text-heading cursor-pointer"
              aria-label="Close"
            >
              &times;
            </button>

            <div className="mx-auto mb-4 flex h-40 w-40 items-center justify-center">
              <Image
                src="/assets/signup-page/success.png"
                alt="Success"
                width={180}
                height={180}
              />
            </div>

            <h2 className="text-4xl font-bold text-heading">
              Successfully Created Account!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Click anywhere to close the window
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
