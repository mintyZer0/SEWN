"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, signUpAsSewer } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  const [step, setStep] = useState(1);

  const { textColor, buttonStyle, borderStyle } = variants[variant];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [province, setProvince] = useState("Tarlac");
  const [city, setCity] = useState("Tarlac City");
  const [customerAddress, setCustomerAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [landline, setLandline] = useState("");

  // Sewer-specific fields
  const [companyName, setCompanyName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [taxId, setTaxId] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [dtiSecNumber, setDtiSecNumber] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-2xl text-4xl p-8 px-12",
          textColor,
        )}
      >
        <button
          type="button"
          onClick={() => {
            if (step > 1) {
              setStep(step - 1);
            } else {
              onClose();
            }
          }}
          className="absolute right-6 top-6 cursor-pointer"
          aria-label={step > 1 ? "Go back" : "Close register details form"}
        >
          ←
        </button>
        <div className="mb-6">
          <h2 className="text-6xl font-normal">Register</h2>
          <p className="text-sm">
            {step === 1
              ? `For smooth transactions, we need additional ${variant === "customer" ? "user" : "seller"} data`
              : "Tell us about your business"}
          </p>
        </div>

        {/* On submit, if it's customer variant, directly submit the form. If
        it's sewer variant, go to next step first before submitting. */}

        {step === 1 ? (
          <form
            className="space-y-4 px-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setFormError("");
              if (variant === "sewer") {
                setStep(2);
                return;
              }
              setSubmitting(true);
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
            <input
              type="hidden"
              name="username"
              value={capturedData.username}
            />
            <input type="hidden" name="email" value={capturedData.email} />
            <input
              type="hidden"
              name="password"
              value={capturedData.password}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1 col-span-2 ">
                <Label htmlFor="first-name" className="text-sm">
                  First Name
                </Label>
                <Input
                  id="first-name"
                  name="first-name"
                  placeholder="Ethan Mathew"
                  className={cn("rounded-2xl text-black", borderStyle)}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1 col-span-2">
                <Label htmlFor="last-name" className="text-sm">
                  Last Name
                </Label>
                <Input
                  id="last-name"
                  name="last-name"
                  placeholder="Malonzo"
                  className={cn("rounded-2xl text-black", borderStyle)}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label htmlFor="province" className="text-sm">
                  Province
                </Label>
                <select
                  id="province"
                  name="province"
                  className={cn(
                    "h-10 rounded-2xl border px-3 text-sm text-black",
                    borderStyle,
                  )}
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                >
                  <option value="Tarlac">Tarlac</option>
                </select>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="city" className="text-sm">
                  City/Municipality
                </Label>
                <select
                  id="city"
                  name="city"
                  className={cn(
                    "h-10 rounded-2xl border px-3 text-sm text-black",
                    borderStyle,
                  )}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="Tarlac City">Tarlac City</option>
                </select>
              </div>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="customer-address" className="text-sm">
                Customer Address
              </Label>
              <Input
                id="customer-address"
                name="customer-address"
                placeholder="Sitio Diyan Lang, Sa tabi tabi, Tarlac City, Tarlac"
                className={cn("rounded-2xl text-black", borderStyle)}
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label htmlFor="phone-number" className="text-sm">
                  Phone Number
                </Label>
                <Input
                  id="phone-number"
                  name="phone-number"
                  placeholder="0967 676 7676"
                  className={cn("rounded-2xl text-black", borderStyle)}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="landline" className="text-sm">
                  Landline
                </Label>
                <Input
                  id="landline"
                  name="landline"
                  placeholder="N/A"
                  className={cn("rounded-2xl text-black", borderStyle)}
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
              className={cn(
                "mt-2 h-14 w-full rounded-xl text-3xl font-semibold text-white disabled:opacity-50",
                buttonStyle,
              )}
            >
              {variant === "sewer"
                ? "Next"
                : submitting
                  ? "Registering..."
                  : "Register"}
            </Button>
          </form>
        ) : (
          <form
            className="space-y-4 px-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              setFormError("");
              const formData = new FormData();
              // Step 1 data
              formData.set("username", capturedData.username);
              formData.set("email", capturedData.email);
              formData.set("password", capturedData.password);
              formData.set("first-name", firstName);
              formData.set("last-name", lastName);
              formData.set("province", province);
              formData.set("city", city);
              formData.set("customer-address", customerAddress);
              formData.set("phone-number", phoneNumber);
              formData.set("landline", landline);
              // Step 2 data
              formData.set("company-name", companyName);
              formData.set("company-email", companyEmail);
              formData.set("tax-id", taxId);
              formData.set("social-link", socialLink);
              formData.set("dti-sec-number", dtiSecNumber);
              const result = await signUpAsSewer(formData);
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
            <div className="grid gap-1">
              <Label htmlFor="company-name" className="text-sm">
                Company Name
              </Label>
              <Input
                id="company-name"
                name="company-name"
                placeholder="Stitches & Co."
                className={cn("rounded-2xl text-black", borderStyle)}
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="company-email" className="text-sm">
                Company Email
              </Label>
              <Input
                id="company-email"
                name="company-email"
                type="email"
                placeholder="info@stitches.com"
                className={cn("rounded-2xl text-black", borderStyle)}
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="tax-id" className="text-sm">
                Tax Identification Number (TIN)
              </Label>
              <Input
                id="tax-id"
                name="tax-id"
                placeholder="000-000-000-000"
                className={cn("rounded-2xl text-black", borderStyle)}
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="social-link" className="text-sm">
                Link to Socials
              </Label>
              <Input
                id="social-link"
                name="social-link"
                type="url"
                placeholder="https://facebook.com/yourpage"
                className={cn("rounded-2xl text-black", borderStyle)}
                value={socialLink}
                onChange={(e) => setSocialLink(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="dti-sec-number" className="text-sm">
                DTI / SEC Registration Number
              </Label>
              <Input
                id="dti-sec-number"
                name="dti-sec-number"
                placeholder="00000000"
                className={cn("rounded-2xl text-black", borderStyle)}
                value={dtiSecNumber}
                onChange={(e) => setDtiSecNumber(e.target.value)}
                required
              />
            </div>

            {formError ? (
              <p className="text-sm text-red-500">{formError}</p>
            ) : null}

            <Button
              type="submit"
              disabled={submitting}
              className={cn(
                "mt-2 h-14 w-full rounded-xl text-3xl font-semibold text-white disabled:opacity-50",
                buttonStyle,
              )}
            >
              {submitting ? "Registering..." : "Register"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
