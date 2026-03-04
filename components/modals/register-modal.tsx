"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/lib/auth-actions";
import { useState } from "react";

interface RegisterModalProps {
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
  capturedData,
  onClose,
  onSuccess,
  onError,
}: RegisterModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [province, setProvince] = useState("Tarlac");
  const [city, setCity] = useState("Tarlac City");
  const [customerAddress, setCustomerAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [landline, setLandline] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white text-heading shadow-2xl text-4xl p-8 px-12">
        <button
          type="button"
          onClick={onClose}
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
            setFormError("");
            const formData = new FormData(e.currentTarget);
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
            <div className="grid gap-1 col-span-2 ">
              <Label htmlFor="first-name" className="text-sm text-heading">
                First Name
              </Label>
              <Input
                id="first-name"
                name="first-name"
                placeholder="Ethan Mathew"
                className="rounded-2xl border-heading"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
                value={province}
                onChange={(e) => setProvince(e.target.value)}
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
              >
                <option value="Tarlac City">Tarlac City</option>
              </select>
            </div>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="customer-address" className="text-sm text-heading">
              Customer Address
            </Label>
            <Input
              id="customer-address"
              name="customer-address"
              placeholder="Sitio Diyan Lang, Sa tabi tabi, Tarlac City, Tarlac"
              className="rounded-2xl border-heading"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1">
              <Label htmlFor="phone-number" className="text-sm text-heading">
                Phone Number
              </Label>
              <Input
                id="phone-number"
                name="phone-number"
                placeholder="0967 676 7676"
                className="rounded-2xl border-heading"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
                value={landline}
                onChange={(e) => setLandline(e.target.value)}
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
  );
}
