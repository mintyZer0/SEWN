"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { LocationPicker } from "@/components/ui/location-picker";

const variants = {
  customer: {
    textColor: "text-heading",
    buttonStyle: "bg-orchid hover:bg-background",
    borderStyle: "border-heading",
  },
  sewer: {
    textColor: "text-third",
    buttonStyle: "bg-third hover:bg-third/80",
    borderStyle: "border-third",
  },
} as const;

interface RegisterModalProps {
  variant?: keyof typeof variants;
  capturedData: {
    username: string;
    email: string;
    password: string;
  };
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function RegisterModal({
  variant = "customer",
  capturedData,
  onClose,
  onSuccess,
  onError,
}: RegisterModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const { textColor, buttonStyle, borderStyle } = variants[variant];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [landline, setLandline] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto pt-20 pb-20">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-2xl p-8 px-12 my-auto",
          textColor,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 cursor-pointer"
          aria-label="Close register details form"
        >
          <ArrowLeft className="w-8 h-8" />
        </button>
        <div className="mb-6">
          <h2 className="text-6xl font-normal">Register</h2>
          <p className="text-sm">
            For smooth transactions, we need additional {variant === "customer" ? "user" : "seller"} data
          </p>
        </div>

        <form
          className="space-y-4 px-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setFormError("");
            setSubmitting(true);
            const formData = new FormData(e.currentTarget);
            formData.set("location", location);
            const result = await signup(formData);
            setSubmitting(false);
            if (result.success) {
              onSuccess();
            } else {
              const error = result.error || "Something went wrong.";
              setFormError(error);
              onError(error);
            }
          }}
        >
          <input type="hidden" name="username" value={capturedData.username} />
          <input type="hidden" name="email" value={capturedData.email} />
          <input type="hidden" name="password" value={capturedData.password} />

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1 col-span-2">
              <Label htmlFor="first-name" className="text-sm">First Name</Label>
              <Input id="first-name" name="first-name" placeholder="Ethan Mathew" className={cn("rounded-2xl text-black", borderStyle)} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="grid gap-1 col-span-2">
              <Label htmlFor="last-name" className="text-sm">Last Name</Label>
              <Input id="last-name" name="last-name" placeholder="Malonzo" className={cn("rounded-2xl text-black", borderStyle)} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div className="grid gap-1">
            <Label className="text-sm">Province / City / Barangay</Label>
            <LocationPicker 
              name="location" 
              placeholder="Select Location" 
              onChange={(val) => setLocation(val)}
              required
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="customer-address" className="text-sm">Detail Address</Label>
            <Input id="customer-address" name="customer-address" placeholder="Sitio Diyan Lang, Sa tabi tabi, Tarlac City, Tarlac" className={cn("rounded-2xl text-black", borderStyle)} value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label htmlFor="phone-number" className="text-sm">Phone Number</Label>
              <Input id="phone-number" name="phone-number" placeholder="0967 676 7676" className={cn("rounded-2xl text-black", borderStyle)} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="landline" className="text-sm">Landline</Label>
              <Input id="landline" name="landline" placeholder="N/A" className={cn("rounded-2xl text-black", borderStyle)} value={landline} onChange={(e) => setLandline(e.target.value)} />
            </div>
          </div>

          {formError ? <p className="text-sm text-red-500">{formError}</p> : null}

          <Button type="submit" disabled={submitting} className={cn("mt-2 h-14 w-full rounded-xl text-3xl font-semibold text-white disabled:opacity-50", buttonStyle)}>
            {submitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
