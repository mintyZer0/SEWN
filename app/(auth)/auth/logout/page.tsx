"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signout } from "@/lib/auth-actions";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    signout().then(() => {
      setTimeout(() => router.push("/"), 2000);
    });
  }, [router]);
  return <div>You have logged out... redirecting in a sec.</div>;
}
