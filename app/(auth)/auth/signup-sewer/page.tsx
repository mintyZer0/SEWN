import React from "react";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignUpPage() {
  return (
    <div className="flex h-svh w-full items-center justify-center">
      <SignupForm variant="sewer" />
    </div>
  );
}
