"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, signUpAsSewer } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { PhotoSlot } from "@/components/ui/photo-slot";

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

  // Step 1
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [province, setProvince] = useState("Tarlac");
  const [city, setCity] = useState("Tarlac City");
  const [customerAddress, setCustomerAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [landline, setLandline] = useState("");

  // Step 2 Sewer (Demographics & Questionnaire)
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [education, setEducation] = useState("");
  const [income, setIncome] = useState("");
  const [whySew, setWhySew] = useState("");
  const [likeSewing, setLikeSewing] = useState("");
  const [givePride, setGivePride] = useState("");
  const [expressYourself, setExpressYourself] = useState("");
  const [goals, setGoals] = useState("");
  const [taxId, setTaxId] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [dtiSecNumber, setDtiSecNumber] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto pt-20 pb-20">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-2xl text-4xl p-8 px-12 my-auto",
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
          <ArrowLeft className="w-8 h-8" />
        </button>
        <div className="mb-6">
          <h2 className="text-6xl font-normal">Register</h2>
          <p className="text-sm">
            {step === 1
              ? `For smooth transactions, we need additional ${variant === "customer" ? "user" : "seller"} data`
              : "Sewer Registration & Demographics"}
          </p>
        </div>

        {step === 1 && (
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1">
                <Label htmlFor="province" className="text-sm">Province</Label>
                <select id="province" name="province" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} value={province} onChange={(e) => setProvince(e.target.value)}>
                  <option value="Tarlac">Tarlac</option>
                </select>
              </div>
              <div className="grid gap-1">
                <Label htmlFor="city" className="text-sm">City/Municipality</Label>
                <select id="city" name="city" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="Tarlac City">Tarlac City</option>
                </select>
              </div>
            </div>

            <div className="grid gap-1">
              <Label htmlFor="customer-address" className="text-sm">Customer Address</Label>
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
              {variant === "sewer" ? "Next" : submitting ? "Registering..." : "Register"}
            </Button>
          </form>
        )}

        {step === 2 && variant === "sewer" && (
          <form
            className="space-y-4 px-4 max-h-[60vh] overflow-y-auto"
            onSubmit={async (e) => {
              e.preventDefault();
              setSubmitting(true);
              setFormError("");
              const formData = new FormData(e.currentTarget);
              // Append Step 1 data
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
            <div className="space-y-4">
              <div className="grid gap-1">
                <Label htmlFor="tax-id" className="text-sm">Tax Identification Number (TIN)</Label>
                <Input id="tax-id" name="tax-id" placeholder="000-000-000-000" className={cn("rounded-2xl text-black", borderStyle)} value={taxId} onChange={(e) => setTaxId(e.target.value)} required />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="social-link" className="text-sm">Link to Socials</Label>
                <Input id="social-link" name="social-link" type="url" placeholder="https://facebook.com/yourpage" className={cn("rounded-2xl text-black", borderStyle)} value={socialLink} onChange={(e) => setSocialLink(e.target.value)} />
              </div>

              <div className="grid gap-1">
                <Label htmlFor="dti-sec-number" className="text-sm">DTI / SEC Registration Number</Label>
                <Input id="dti-sec-number" name="dti-sec-number" placeholder="00000000" className={cn("rounded-2xl text-black", borderStyle)} value={dtiSecNumber} onChange={(e) => setDtiSecNumber(e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label htmlFor="age" className="text-sm">Age</Label>
                  <Input type="number" id="age" name="age" className={cn("rounded-2xl text-black", borderStyle)} value={age} onChange={(e) => setAge(e.target.value)} required />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="sex" className="text-sm">Sex</Label>
                  <select id="sex" name="sex" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} value={sex} onChange={(e) => setSex(e.target.value)} required>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="education" className="text-sm">Educational Attainment</Label>
                <select id="education" name="education" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} value={education} onChange={(e) => setEducation(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Elementary Level">Elementary Level</option>
                  <option value="Elementary Graduate">Elementary Graduate</option>
                  <option value="High School Level">High School Level</option>
                  <option value="High School Graduate">High School Graduate</option>
                  <option value="College Level">College Level</option>
                  <option value="College Graduate">College Graduate</option>
                  <option value="Vocational or Trade Course">Vocational or Trade Course</option>
                </select>
              </div>

              <div className="grid gap-1">
                <Label htmlFor="income" className="text-sm">Monthly income as Sewer (Php)</Label>
                <select id="income" name="income" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} value={income} onChange={(e) => setIncome(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="5,000 – below">5,000 – below</option>
                  <option value="5000 – 10,000">5000 – 10,000</option>
                  <option value="10,001 – 15,000">10,001 – 15,000</option>
                  <option value="15,000 – 20,000">15,000 – 20,000</option>
                  <option value="25,000 – 30,000">25,000 – 30,000</option>
                  <option value="30,000 – above">30,000 – above</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-1">
                  <Label className="text-sm">Identification Card</Label>
                  <div className="h-32">
                    <PhotoSlot name="id-card" size="sm" className="h-full" />
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label className="text-sm">Sewer Profile (Optional)</Label>
                  <div className="h-32">
                    <PhotoSlot name="sewer-profile" size="sm" className="h-full" />
                  </div>
                </div>
              </div>

              <div className="grid gap-1 mt-4">
                <h3 className="text-lg font-semibold mt-4">Sewing Questionnaire</h3>
                
                <Label htmlFor="whySew" className="text-sm mt-2">Why do you continue to sew today?</Label>
                <select id="whySew" name="whySew" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} value={whySew} onChange={(e) => setWhySew(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Source of Income">Source of Income</option>
                  <option value="Community Tradition">Community Tradition</option>
                  <option value="Continue Family’s Legacy">Continue Family’s Legacy</option>
                  <option value="Part-Time Job">Part-Time Job</option>
                  <option value="Provide for the Needs of the Family">Provide for the Needs of the Family</option>
                  <option value="No Alternative Options for Employment">No Alternative Options for Employment</option>
                </select>

                <Label htmlFor="likeSewing" className="text-sm mt-2">What do you like about sewing?</Label>
                <select id="likeSewing" name="likeSewing" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} value={likeSewing} onChange={(e) => setLikeSewing(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Gives Relaxation / Reduce Stress">Gives Relaxation / Reduce Stress</option>
                  <option value="Generates Income">Generates Income</option>
                  <option value="Satisfaction">Satisfaction</option>
                  <option value="Others">Others</option>
                </select>
                
                <Label htmlFor="givePride" className="text-sm mt-2">Does it give you pride?</Label>
                <select id="givePride" name="givePride" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} value={givePride} onChange={(e) => setGivePride(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <Label htmlFor="expressYourself" className="text-sm mt-2">Were you able to express yourself through sewing?</Label>
                <select id="expressYourself" name="expressYourself" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} value={expressYourself} onChange={(e) => setExpressYourself(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <Label htmlFor="goals" className="text-sm mt-2">What are your goals as a sewer for other people?</Label>
                <select id="goals" name="goals" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} value={goals} onChange={(e) => setGoals(e.target.value)} required>
                  <option value="">Select</option>
                  <option value="Share my Knowledge">Share my Knowledge</option>
                  <option value="Help in Generating Income">Help in Generating Income</option>
                  <option value="Recognized our Tradition">Recognized our Tradition</option>
                  <option value="Promote the Business">Promote the Business</option>
                  <option value="Build the Community">Build the Community</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div className="grid gap-1 mt-4">
                <h3 className="text-lg font-semibold mt-4">Sewing Community</h3>

                <Label htmlFor="learn-craft" className="text-sm mt-2">How did you learn the craft?</Label>
                <Input id="learn-craft" name="learn-craft" className={cn("rounded-2xl text-black", borderStyle)} required />

                <Label htmlFor="who-taught" className="text-sm mt-2">Who taught you? (Indicate the relationship)</Label>
                <Input id="who-taught" name="who-taught" className={cn("rounded-2xl text-black", borderStyle)} required />

                <Label htmlFor="motivations" className="text-sm mt-2">What are your motivations for pursuing sewing as a livelihood?</Label>
                <select id="motivations" name="motivations" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} required>
                  <option value="">Select</option>
                  <option value="To provide for the needs of the family">To provide for the needs of the family</option>
                  <option value="Acquire comprehensive knowledge in sewing">Acquire comprehensive knowledge in sewing</option>
                  <option value="Skills Enhancement">Skills Enhancement</option>
                  <option value="Satisfaction of being able to produce a woven fabric">Satisfaction of being able to produce a woven fabric</option>
                  <option value="For customer’s satisfaction">For customer’s satisfaction</option>
                  <option value="Others">Others</option>
                </select>

                <Label htmlFor="only-livelihood" className="text-sm mt-2">Is it the only livelihood available in your area?</Label>
                <Input id="only-livelihood" name="only-livelihood" className={cn("rounded-2xl text-black", borderStyle)} required />

                <Label htmlFor="own-machine" className="text-sm mt-2">Do you own a Sewing Machine?</Label>
                <select id="own-machine" name="own-machine" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} required>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <Label htmlFor="machine-owner" className="text-sm mt-2">Who owned the Machine?</Label>
                <Input id="machine-owner" name="machine-owner" className={cn("rounded-2xl text-black", borderStyle)} />
              </div>

              <div className="grid gap-1 mt-4">
                <h3 className="text-lg font-semibold mt-4">Design Process</h3>

                <Label htmlFor="traditional-products" className="text-sm mt-2">Are the sewn products you produced traditional products of your community?</Label>
                <select id="traditional-products" name="traditional-products" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} required>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                <Label htmlFor="products-used-for" className="text-sm mt-2">What products are the sewn usually used for?</Label>
                <select id="products-used-for" name="products-used-for" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} required>
                  <option value="">Select</option>
                  <option value="Apparel">Apparel</option>
                  <option value="Masks">Masks</option>
                  <option value="Bags">Bags</option>
                </select>

                <Label htmlFor="specific-products" className="text-sm mt-2">Specific products sewed are used for if applicable?</Label>
                <select id="specific-products" name="specific-products" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)}>
                  <option value="">Select</option>
                  <option value="Shawls">Shawls</option>
                  <option value="Uniforms">Uniforms</option>
                  <option value="Barong">Barong</option>
                  <option value="Dress">Dress</option>
                  <option value="Table Runners">Table Runners</option>
                  <option value="Gowns">Gowns</option>
                  <option value="Blankets">Blankets</option>
                </select>

                <Label htmlFor="design-products" className="text-sm mt-2">Do you design the garment products?</Label>
                <select id="design-products" name="design-products" className={cn("h-10 rounded-2xl border px-3 text-sm text-black", borderStyle)} required>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            {formError ? <p className="text-sm text-red-500">{formError}</p> : null}

            <Button type="submit" disabled={submitting} className={cn("mt-4 h-14 w-full rounded-xl text-3xl font-semibold text-white disabled:opacity-50", buttonStyle)}>
              {submitting ? "Registering..." : "Register"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
