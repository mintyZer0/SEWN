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
  { id: 2, name: "Sewer Profile & Questionnaire" },
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
                  {step === 2 && "Demographics and Sewing Questionnaire"}
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
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              if (step < 2) {
                setStep(step + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                const result = await upgradeToSewer(formData);
                if (result.success) {
                  // Force a full hard reload to ensure middleware catches the updated session metadata
                  window.location.href = "/";
                } else {
                  console.error(result.error);
                  alert(result.error || "An error occurred during upgrade.");
                }
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
                  <Label htmlFor="address" className="text-lg text-third font-semibold">Detail Address</Label>
                  <textarea name="address" id="address" rows={3} className="w-full rounded-xl border border-third/20 focus:border-third bg-white p-4 text-gray-700 text-sm" placeholder="Street Address, Barangay, City, Province" required={step === 1} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="tax-id" className="text-lg text-third font-semibold">Tax Identification Number (TIN)</Label>
                    <Input name="tax-id" id="tax-id" placeholder="000-000-000-000" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 1} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dti-sec-number" className="text-lg text-third font-semibold">DTI / SEC Registration Number</Label>
                    <Input name="dti-sec-number" id="dti-sec-number" placeholder="00000000" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 1} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="social-link" className="text-lg text-third font-semibold">Link to Socials</Label>
                  <Input name="social-link" id="social-link" type="url" placeholder="https://facebook.com/yourpage" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" />
                </div>
              </div>

              


              {/* Step 2: Sewer Profile & Questionnaire */}
              <div className={cn("space-y-8 animate-in fade-in slide-in-from-right-4 duration-300", step !== 2 && "hidden")}>
                <div className="space-y-4">
                  <h3 className="text-xl text-third font-semibold border-b border-third/10 pb-2">Demographics & Background</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm text-third/70">Age</Label>
                      <Input name="age" id="age" type="number" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sex" className="text-sm text-third/70">Sex</Label>
                      <select name="sex" id="sex" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                        <option value="">Select Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="educational-attainment" className="text-sm text-third/70">Educational Attainment</Label>
                    <select name="educational-attainment" id="educational-attainment" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                      <option value="">Select Educational Attainment</option>
                      <option value="Elementary Level">Elementary Level</option>
                      <option value="Elementary Graduate">Elementary Graduate</option>
                      <option value="High School Level">High School Level</option>
                      <option value="High School Graduate">High School Graduate</option>
                      <option value="College Level">College Level</option>
                      <option value="College Graduate">College Graduate</option>
                      <option value="Vocational or Trade Course">Vocational or Trade Course</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthly-income" className="text-sm text-third/70">Monthly income as Sewer (Php)</Label>
                    <select name="monthly-income" id="monthly-income" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                      <option value="">Select Monthly Income</option>
                      <option value="5,000 – below">5,000 – below</option>
                      <option value="5000 – 10,000">5000 – 10,000</option>
                      <option value="10,001 – 15,000">10,001 – 15,000</option>
                      <option value="15,000 – 20,000">15,000 – 20,000</option>
                      <option value="25,000 – 30,000">25,000 – 30,000</option>
                      <option value="30,000 – above">30,000 – above</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl text-third font-semibold border-b border-third/10 pb-2">Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <Label className="text-sm text-third/70 block">Identification Card</Label>
                      <div className="h-48">
                        <PhotoSlot name="id-card-upload" size="lg" className="h-full" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-sm text-third/70 block">Sewer’s Profile (Optional)</Label>
                      <div className="h-48">
                        <PhotoSlot name="sewer-profile-upload" size="lg" className="h-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl text-third font-semibold border-b border-third/10 pb-2">Sewing Questionnaire</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="why-sew" className="text-sm text-third/70">Why do you continue to sew today?</Label>
                    <select name="why-sew" id="why-sew" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                      <option value="">Select reason</option>
                      <option value="Source of Income">Source of Income</option>
                      <option value="Community Tradition">Community Tradition</option>
                      <option value="Continue Family’s Legacy">Continue Family’s Legacy</option>
                      <option value="Part-Time Job">Part-Time Job</option>
                      <option value="Provide for the Needs of the Family">Provide for the Needs of the Family</option>
                      <option value="No Alternative Options for Employment">No Alternative Options for Employment</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="like-sewing" className="text-sm text-third/70">What do you like about sewing?</Label>
                    <select name="like-sewing" id="like-sewing" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                      <option value="">Select reason</option>
                      <option value="Gives Relaxation / Reduce Stress">Gives Relaxation / Reduce Stress</option>
                      <option value="Generates Income">Generates Income</option>
                      <option value="Satisfaction">Satisfaction</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="give-pride" className="text-sm text-third/70">Does it give you pride?</Label>
                      <select name="give-pride" id="give-pride" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                        <option value="">Select Yes/No</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="express-yourself" className="text-sm text-third/70">Were you able to express yourself through sewing?</Label>
                      <select name="express-yourself" id="express-yourself" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                        <option value="">Select Yes/No</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goals" className="text-sm text-third/70">What are your goals as a sewer for other people?</Label>
                    <select name="goals" id="goals" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                      <option value="">Select Goal</option>
                      <option value="Share my Knowledge">Share my Knowledge</option>
                      <option value="Help in Generating Income">Help in Generating Income</option>
                      <option value="Recognized our Tradition">Recognized our Tradition</option>
                      <option value="Promote the Business">Promote the Business</option>
                      <option value="Build the Community">Build the Community</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl text-third font-semibold border-b border-third/10 pb-2">Sewing Community</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="learn-craft" className="text-sm text-third/70">How did you learn the craft?</Label>
                      <Input name="learn-craft" id="learn-craft" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 2} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="who-taught" className="text-sm text-third/70">Who taught you? (Indicate the relationship)</Label>
                      <Input name="who-taught" id="who-taught" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 2} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="motivations" className="text-sm text-third/70">What are your motivations for pursuing sewing as a livelihood?</Label>
                    <select name="motivations" id="motivations" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                      <option value="">Select Motivation</option>
                      <option value="To provide for the needs of the family">To provide for the needs of the family</option>
                      <option value="Acquire comprehensive knowledge in sewing">Acquire comprehensive knowledge in sewing</option>
                      <option value="Skills Enhancement">Skills Enhancement</option>
                      <option value="Satisfaction of being able to produce a woven fabric">Satisfaction of being able to produce a woven fabric</option>
                      <option value="For customer’s satisfaction">For customer’s satisfaction</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="only-livelihood" className="text-sm text-third/70">Is it the only livelihood available in your area?</Label>
                    <Input name="only-livelihood" id="only-livelihood" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" required={step === 2} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="own-machine" className="text-sm text-third/70">Do you own a Sewing Machine?</Label>
                      <select name="own-machine" id="own-machine" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                        <option value="">Select Yes/No</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="machine-owner" className="text-sm text-third/70">Who owned the Machine?</Label>
                      <Input name="machine-owner" id="machine-owner" className="h-12 rounded-xl border-third/20 focus:border-third bg-white" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl text-third font-semibold border-b border-third/10 pb-2">Design Process</h3>

                  <div className="space-y-2">
                    <Label htmlFor="traditional-products" className="text-sm text-third/70">Are the sewn products you produced traditional products of your community?</Label>
                    <select name="traditional-products" id="traditional-products" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                      <option value="">Select Yes/No</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="products-used-for" className="text-sm text-third/70">What products are the sewn usually used for?</Label>
                      <select name="products-used-for" id="products-used-for" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                        <option value="">Select Product Type</option>
                        <option value="Apparel">Apparel</option>
                        <option value="Masks">Masks</option>
                        <option value="Bags">Bags</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specific-products" className="text-sm text-third/70">Specific products sewed are used for if applicable?</Label>
                      <select name="specific-products" id="specific-products" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700">
                        <option value="">Select Specific Product</option>
                        <option value="Shawls">Shawls</option>
                        <option value="Uniforms">Uniforms</option>
                        <option value="Barong">Barong</option>
                        <option value="Dress">Dress</option>
                        <option value="Table Runners">Table Runners</option>
                        <option value="Gowns">Gowns</option>
                        <option value="Blankets">Blankets</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="design-products" className="text-sm text-third/70">Do you design the garment products?</Label>
                      <select name="design-products" id="design-products" className="w-full h-12 rounded-xl border border-third/20 focus:border-third bg-white px-3 text-gray-700" required={step === 2}>
                        <option value="">Select Yes/No</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-third/10">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" className="mt-1 w-5 h-5 accent-third rounded border-third/20" required={step === 2} />
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
                  {step === 2 ? "COMPLETE ONBOARDING" : "NEXT STEP"}
                  {step < 2 && <ChevronRight size={28} className="ml-2" />}
                </ProfileButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
