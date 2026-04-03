"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileButton } from "@/components/user-profile/profile-buttons";
import { upgradeToSewer } from "@/lib/auth-actions";
import { ArrowLeft, ChevronRight, Check, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { PhotoSlot } from "@/components/ui/photo-slot";
import { LocationPicker } from "@/components/ui/location-picker";

const STEPS = [
  { id: 1, name: "Shop Information" },
  { id: 2, name: "Business Information" },
  { id: 3, name: "Tax Information" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data?.user_type === "seller") {
        router.push("/");
        return;
      }

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [supabase, router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-third">Loading profile...</div>;

  return (
    <div className="relative min-h-screen font-jost overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[url(/assets/signup-sewer/signup-sewer-bg.png)] bg-cover bg-center bg-no-repeat w-full h-full" />
      
      <div className="flex flex-col items-center justify-center py-12 px-4 md:px-10">
        {/* Progress Stepper */}
        <div className="w-full max-w-4xl mb-8 flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/30 -z-10 -translate-y-1/2" />
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-colors",
                step >= s.id ? "bg-third text-white" : "bg-white text-third"
              )}>
                {step > s.id ? <Check size={20} /> : s.id}
              </div>
              <span className={cn(
                "text-sm font-medium",
                step >= s.id ? "text-white" : "text-white/60"
              )}>{s.name}</span>
            </div>
          ))}
        </div>

        <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-third/5 p-8 border-b border-third/10">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-5xl text-third font-normal mb-2">
                  {STEPS[step - 1].name}
                </CardTitle>
                <CardDescription className="text-xl text-third/70">
                  {step === 1 && "Basic details about your tailoring shop"}
                  {step === 2 && "Legal and entity verification"}
                  {step === 3 && "Tax and payment information"}
                </CardDescription>
              </div>
              {step > 1 && (
                <button 
                  onClick={() => setStep(step - 1)}
                  className="text-third hover:bg-third/10 p-2 rounded-full transition-colors"
                >
                  <ArrowLeft size={32} />
                </button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-8 md:p-12">
            <form action={async (formData) => {
              if (step < 3) {
                setStep(step + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                await upgradeToSewer(formData);
              }
            }}>
              {/* Step 1: Shop Information */}
              <div className={cn("space-y-8", step !== 1 && "hidden")}>
                <div className="space-y-4">
                  <Label className="text-lg text-third font-semibold block">Individual Registered Name</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-sm text-third/70">First Name</Label>
                      <Input name="first-name" id="first-name" defaultValue={profile?.first_name} className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 1} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-sm text-third/70">Last Name</Label>
                      <Input name="last-name" id="last-name" defaultValue={profile?.last_name} className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 1} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middle-name" className="text-sm text-third/70">Middle Name</Label>
                      <Input name="middle-name" id="middle-name" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="suffix" className="text-sm text-third/70">Suffix</Label>
                      <select name="suffix" id="suffix" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700">
                        <option value="">None</option>
                        <option value="Jr.">Jr.</option>
                        <option value="Sr.">Sr.</option>
                        <option value="III">III</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shop-name" className="text-lg text-third font-semibold">Business Name / Trade Name</Label>
                  <Input name="shop-name" id="shop-name" placeholder="e.g. Maria's Custom Stitches" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 1} />
                  <p className="text-xs text-third/50 italic">If Business Name is not applicable, please enter your name as indicated on your BIR Certificate of Registration.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="business-email" className="text-lg text-third font-semibold">Business Email</Label>
                    <Input name="business-email" id="business-email" type="email" defaultValue={profile?.email} className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 1} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-phone" className="text-lg text-third font-semibold">Business Phone Number</Label>
                    <Input name="business-phone" id="business-phone" placeholder="09XX XXX XXXX" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 1} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-lg text-third font-semibold">General Location</Label>
                    <LocationPicker name="location" required={step === 1} placeholder="Select Region / Province / City / Barangay" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip-code" className="text-lg text-third font-semibold">Zip Code</Label>
                    <Input name="zip-code" id="zip-code" placeholder="2300" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 1} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-lg text-third font-semibold">Registered Address</Label>
                  <textarea name="address" id="address" rows={3} className="w-full rounded-xl border border-third/20 focus:border-third bg-white p-4 text-gray-700 text-sm" placeholder="Registered Address as written on your BIR Certificate of Registration" required={step === 1} />
                </div>
              </div>

              {/* Step 2: Business Information */}
              <div className={cn("space-y-8 animate-in fade-in slide-in-from-right-4 duration-300", step !== 2 && "hidden")}>
                <div className="space-y-4">
                  <Label className="text-lg text-third font-semibold block">Seller Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Sole Proprietorship", "Corporation", "One Person Corp"].map((type) => (
                      <label key={type} className="flex items-center gap-3 p-4 rounded-xl border border-third/20 cursor-pointer hover:bg-third/5 transition-colors">
                        <input type="radio" name="seller-type" value={type} className="w-5 h-5 accent-third" defaultChecked={type === "Sole Proprietorship"} />
                        <span className="text-gray-700 text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-lg text-third font-semibold block">Primary Business Document</Label>
                    <div className="flex flex-col gap-2">
                      <select name="doc-type" className="h-12 rounded-xl border border-third/20 bg-white px-3 text-sm mb-2">
                        <option>DTI Certificate</option>
                        <option>SEC Registration</option>
                        <option>Mayor's Permit</option>
                      </select>
                      <div className="h-48">
                        <PhotoSlot name="business-doc" size="lg" className="h-full" />
                      </div>
                      <p className="text-xs text-third/60">Upload a clear photo of your business registration.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-lg text-third font-semibold block">Government Issued ID</Label>
                    <div className="flex flex-col gap-2">
                      <select name="id-type" className="h-12 rounded-xl border border-third/20 bg-white px-3 text-sm mb-2">
                        <option>UMID</option>
                        <option>Driver's License</option>
                        <option>Philippine Passport</option>
                        <option>PhilSys ID</option>
                      </select>
                      <div className="h-48">
                        <PhotoSlot name="gov-id" size="lg" className="h-full" />
                      </div>
                      <p className="text-xs text-third/60">Upload a clear photo of your valid ID (Front).</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Tax Information */}
              <div className={cn("space-y-8 animate-in fade-in slide-in-from-right-4 duration-300", step !== 3 && "hidden")}>
                <div className="space-y-2">
                  <Label htmlFor="tin" className="text-lg text-third font-semibold">Taxpayer Identification Number (TIN)</Label>
                  <Input name="tin" id="tin" placeholder="000-000-000-000" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 3} />
                  <p className="text-xs text-third/50 italic">Your 9-digit TIN and 3 to 5 digit branch code. Please use "000" as your branch code if you don't have one.</p>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg text-third font-semibold block">Value Added Tax Registration Status</Label>
                  <div className="flex gap-6">
                    {["VAT Registered", "Non-VAT Registered"].map((status) => (
                      <label key={status} className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="vat-status" value={status} className="w-5 h-5 accent-third" defaultChecked={status === "Non-VAT Registered"} />
                        <span className="text-gray-700 text-sm">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg text-third font-semibold block">BIR Certificate of Registration</Label>
                  <div className="h-64 max-w-md">
                    <PhotoSlot name="bir-cert" size="lg" className="h-full" />
                  </div>
                  <p className="text-xs text-third/60 italic">Please upload your BIR Form 2303.</p>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg text-third font-semibold block">Submit Sworn Declaration?</Label>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="sworn-decl" value="yes" className="w-5 h-5 accent-third" />
                      <span className="text-gray-700 text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="sworn-decl" value="no" className="w-5 h-5 accent-third" defaultChecked />
                      <span className="text-gray-700 text-sm">No</span>
                    </label>
                  </div>
                  <p className="text-xs text-third/50 italic">Submission of Sworn Declaration is required to be exempted from withholding tax if your total annual gross remittance is less than or equal to ₱500,000.00.</p>
                </div>

                <div className="pt-6 border-t border-third/10">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-1 w-5 h-5 accent-third rounded border-third/20" required={step === 3} />
                    <span className="text-gray-600 text-xs group-hover:text-third transition-colors">
                      I agree to the <span className="text-blue-500 underline">Terms and Conditions</span> and <span className="text-blue-500 underline">Data Privacy Policy</span>. I certify that the information provided is true and correct.
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-12">
                <ProfileButton
                  type="submit"
                  variant="orange"
                  size="xl"
                  className="px-12 shadow-xl hover:scale-[1.02]"
                >
                  {step === 3 ? "COMPLETE ONBOARDING" : "NEXT STEP"}
                  {step < 3 && <ChevronRight size={28} className="ml-2" />}
                </ProfileButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
