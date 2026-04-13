import { Suspense } from "react";
import { AdminLoginForm } from "./components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-primary-light/10">
      <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
        <Suspense fallback={<div className="text-primary text-center">Loading...</div>}>
          <AdminLoginForm />
        </Suspense>
      </div>
    </div>
  );
}
