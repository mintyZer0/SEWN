"use client";

import { useEffect, useState } from "react";
import PrimaryButton from "../ui/primary-button";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommissionFormProps {
  sewistName: string;
  sewistImage: string;
  sewistId: string;
  serviceType: "commission" | "repair" | "alteration";
  disableSubject?: boolean;
  disableEmail?: boolean;
  disableFullName?: boolean;
  disableFabric?: boolean;
  disableOrderDetails?: boolean;
  disableMeasurements?: boolean;
  disableScheduleAppointment?: boolean;
  disableImages?: boolean;
  orderDetailsLabel?: string;
}

interface UserAddressOption {
  id: string;
  full_address: string;
  barangay: string;
  city: string;
  province: string;
  zip_code: number;
  is_primary: boolean;
  address_type?: string | null;
}

interface MeasurementOption {
  id: string;
  profile_name: string | null;
  unit: string | null;
  chest: number | null;
  shoulder_width: number | null;
  neck: number | null;
  sleeve_length_short: number | null;
  sleeve_length_long: number | null;
  upper_arm_bicep: number | null;
  wrist: number | null;
  shirt_length: number | null;
  waist_shirt: number | null;
  waist_pants: number | null;
  hips: number | null;
  inseam: number | null;
  outseam: number | null;
  thigh: number | null;
  knee: number | null;
  leg_opening: number | null;
  front_rise: number | null;
  back_rise: number | null;
}

export default function CommissionForm({
  sewistName,
  sewistImage,
  sewistId,
  serviceType,
  disableSubject = false,
  disableEmail = false,
  disableFullName = false,
  disableFabric = false,
  disableOrderDetails = false,
  disableMeasurements = false,
  disableScheduleAppointment = false,
  disableImages = false,
  orderDetailsLabel = "Order Details",
  }: CommissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [addresses, setAddresses] = useState<UserAddressOption[]>([]);
  const [measurementProfiles, setMeasurementProfiles] = useState<MeasurementOption[]>([]);
  const supabase = createClient();

  const [formData, setFormData] = useState({
    subject: "",
    selectedAddressId: "",
    selectedMeasurementId: "",
    fabricToUse: "",
    orderDetails: "",
    appointmentDate: "",
    images: [] as File[],
  });

  useEffect(() => {
    const loadUserFormOptions = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMsg("You must be logged in to submit a request.");
        return;
      }

      setUserEmail(user.email || "");

      const [{ data: addressData, error: addressError }, { data: measurementData, error: measurementError }] =
        await Promise.all([
          supabase
            .from("user_addresses")
            .select("id, full_address, barangay, city, province, zip_code, is_primary, address_type")
            .eq("user_id", user.id)
            .order("is_primary", { ascending: false }),
          supabase
            .from("user_measurements")
            .select("id, profile_name, unit, chest, shoulder_width, neck, sleeve_length_short, sleeve_length_long, upper_arm_bicep, wrist, shirt_length, waist_shirt, waist_pants, hips, inseam, outseam, thigh, knee, leg_opening, front_rise, back_rise")
            .eq("user_id", user.id)
            .order("created_at", { ascending: true }),
        ]);

      if (addressError) {
        setErrorMsg(addressError.message);
        return;
      }
      if (measurementError) {
        setErrorMsg(measurementError.message);
        return;
      }

      const validAddresses = (addressData || []).filter(
        (address) => !!address.id && String(address.address_type || "").toLowerCase() !== "shop"
      );
      const validMeasurements = (measurementData || []).filter((measurement) => !!measurement.id);

      setAddresses(validAddresses as UserAddressOption[]);
      setMeasurementProfiles(validMeasurements as MeasurementOption[]);
      setFormData((prev) => ({
        ...prev,
        selectedAddressId: validAddresses[0]?.id || "",
        selectedMeasurementId: validMeasurements[0]?.id || "",
      }));
    };

    loadUserFormOptions();
  }, [supabase]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("You must be logged in to submit a request.");
      }

      const selectedAddress = addresses.find((address) => address.id === formData.selectedAddressId);
      const selectedMeasurement = measurementProfiles.find(
        (measurement) => measurement.id === formData.selectedMeasurementId
      );

      if (!selectedAddress) {
        throw new Error("Please add and select an address from your profile first.");
      }
      if (!disableMeasurements && !selectedMeasurement) {
        throw new Error("Please add and select a measurement profile first.");
      }

      // Format details
      let finalDetails = formData.orderDetails;
      if (selectedMeasurement?.profile_name) {
        finalDetails += `\nMeasurement Preset: ${selectedMeasurement.profile_name}`;
      }

      const { error: submitError } = await supabase.from("service_requests").insert({
        client_id: user.id,
        sewist_id: sewistId,
        service_type: serviceType,
        subject: formData.subject || `New ${serviceType} request`,
        address_id: selectedAddress.id,
        fabric: disableFabric ? null : formData.fabricToUse || null,
        request_details: finalDetails,
        measurement_profile_id: disableMeasurements ? null : selectedMeasurement?.id || null,
        appointment_date: formData.appointmentDate
          ? new Date(formData.appointmentDate).toISOString()
          : new Date().toISOString(), // Fallback if no date
        status: "pending"
      });

      if (submitError) throw submitError;
      
      setSuccess(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      setErrorMsg(err.message || "An error occurred while submitting your request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fabricOptions = [
    "Cotton",
    "Linen",
    "Silk",
    "Wool",
    "Polyester",
    "Denim",
    "Leather",
    "Satin",
    "Velvet",
    "Other",
  ];
  const selectedMeasurementProfile = measurementProfiles.find(
    (measurement) => measurement.id === formData.selectedMeasurementId
  );
  const measurementUnit = selectedMeasurementProfile?.unit || "in";
  const measurementPreviewFields = selectedMeasurementProfile
    ? [
        { label: "Chest", value: selectedMeasurementProfile.chest },
        { label: "Shoulder Width", value: selectedMeasurementProfile.shoulder_width },
        { label: "Neck", value: selectedMeasurementProfile.neck },
        { label: "Sleeve (Short)", value: selectedMeasurementProfile.sleeve_length_short },
        { label: "Sleeve (Long)", value: selectedMeasurementProfile.sleeve_length_long },
        { label: "Upper Arm/Bicep", value: selectedMeasurementProfile.upper_arm_bicep },
        { label: "Wrist", value: selectedMeasurementProfile.wrist },
        { label: "Shirt Length", value: selectedMeasurementProfile.shirt_length },
        { label: "Waist (Shirt)", value: selectedMeasurementProfile.waist_shirt },
        { label: "Waist (Pants)", value: selectedMeasurementProfile.waist_pants },
        { label: "Hips", value: selectedMeasurementProfile.hips },
        { label: "Inseam", value: selectedMeasurementProfile.inseam },
        { label: "Outseam", value: selectedMeasurementProfile.outseam },
        { label: "Thigh", value: selectedMeasurementProfile.thigh },
        { label: "Knee", value: selectedMeasurementProfile.knee },
        { label: "Leg Opening", value: selectedMeasurementProfile.leg_opening },
        { label: "Front Rise", value: selectedMeasurementProfile.front_rise },
        { label: "Back Rise", value: selectedMeasurementProfile.back_rise },
      ].filter((field) => field.value !== null)
    : [];

  return (
    <div className="max-w-dvw mx-30 rounded-lg p-10 my-10">
      <h2 className="text-6xl font-regular text-heading mb-4">
        <span className="text-black">Commission</span> {sewistName}
      </h2>

      {success ? (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-3xl font-medium text-heading">Request Submitted!</h3>
          <p className="text-xl text-gray-600">The sewist will review your request and get back to you shortly.</p>
          <Link href={`/sewists/${sewistId}`}>
            <PrimaryButton className="mt-8">Return to Profile</PrimaryButton>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-500 rounded-2xl">
              {errorMsg}
            </div>
          )}
        {!disableSubject && (
          <div>
            <label
              htmlFor="subject"
              className="block text-base font-light text-black mb-1"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              placeholder={`E.g. ${serviceType === 'repair' ? 'Fixing a hole' : 'Custom dress inquiry'}`}
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent"
            />
          </div>
        )}

        {!disableEmail && (
          <div>
            <label className="block text-base font-light text-black mb-1">
              Email
            </label>
            <input
              type="email"
              value={userEmail}
              readOnly
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 bg-gray-200 text-gray-600 focus:outline-none"
            />
          </div>
        )}

        {!disableFullName && (
          <div className="relative">
            <label className="block text-base font-light text-black mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <Select
              variant="purple"
              value={formData.selectedAddressId}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, selectedAddressId: val }))}
            >
              <SelectTrigger className="w-full px-4 py-2 rounded-2xl border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent">
                <SelectValue placeholder={addresses.length ? "Select your address" : "No saved address found"} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {addresses.map((address) => (
                  <SelectItem key={address.id} value={address.id}>
                    {`${address.full_address}, ${address.city}, ${address.province}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {addresses.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Add an address in your profile first.
                {" "}
                <Link href="/user-profile/addresses" className="underline">
                  Go to My Addresses
                </Link>
              </p>
            )}
          </div>
        )}

        {!disableFabric && (
          <div className="relative">
            <label
              htmlFor="fabricToUse"
              className="block text-base font-light text-black mb-1"
            >
              Fabric to be Used <span className="text-red-500">*</span>
            </label>
            <Select 
              variant="purple"
              value={formData.fabricToUse} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, fabricToUse: val }))}
              required
            >
              <SelectTrigger className="w-full px-4 py-2 rounded-2xl border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent">
                <SelectValue placeholder="Select fabric type" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {fabricOptions.map((fabric) => (
                  <SelectItem key={fabric} value={fabric}>
                    {fabric}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {!disableOrderDetails && (
          <div>
            <label
              htmlFor="orderDetails"
              className="block text-base font-light text-black mb-1"
            >
              {orderDetailsLabel} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="orderDetails"
              name="orderDetails"
              required
              rows={4}
              value={formData.orderDetails}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent resize-none"
            />
          </div>
        )}

        {!disableMeasurements && (
          <div className="relative">
            <label className="block text-base font-light text-black mb-1">
              Measurement Preset <span className="text-red-500">*</span>
            </label>
            <Select
              variant="purple"
              value={formData.selectedMeasurementId}
              onValueChange={(val) => setFormData((prev) => ({ ...prev, selectedMeasurementId: val }))}
            >
              <SelectTrigger className="w-full px-4 py-2 rounded-2xl border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent">
                <SelectValue placeholder={measurementProfiles.length ? "Select measurement profile" : "No measurement profile found"} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {measurementProfiles.map((measurement) => (
                  <SelectItem key={measurement.id} value={measurement.id}>
                    {measurement.profile_name || "Unnamed profile"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {measurementProfiles.length === 0 && (
              <p className="text-xs text-red-500 mt-1">
                Add a measurement profile first.
                {" "}
                <Link href="/user-profile/measurements" className="underline">
                  Go to Measurements
                </Link>
              </p>
            )}
            {selectedMeasurementProfile && (
              <div className="mt-3 rounded-2xl border border-gray-200 bg-gray-100 p-3">
                <p className="text-sm font-medium text-heading mb-2">
                  {selectedMeasurementProfile.profile_name || "Selected profile"} measurements
                </p>
                {measurementPreviewFields.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                    {measurementPreviewFields.map((field) => (
                      <p key={field.label} className="text-sm text-gray-700">
                        {field.label}: {field.value} {measurementUnit}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">No measurements set in this profile yet.</p>
                )}
              </div>
            )}
          </div>
        )}

        {!disableScheduleAppointment && (
          <div>
            <label
              htmlFor="appointmentDate"
              className="block text-base font-light text-black mb-1"
            >
              Schedule an appointment? <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              required
              value={formData.appointmentDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent cursor-pointer"
            />
          </div>
        )}

        {!disableImages && (
          <div>
            <label
              htmlFor="images"
              className="block text-base font-light text-black mb-1"
            >
              Reference Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              disabled
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 bg-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-third file:text-white hover:file:bg-third/90 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Image uploads are currently being set up. This will be available soon.</p>
          </div>
        )}

        <PrimaryButton type="submit" disabled={isSubmitting} className="flex items-center justify-center gap-2">
          {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
          {isSubmitting ? "Submitting..." : "Confirm Order"}
        </PrimaryButton>

        <p className="text-xs text-center text-[#2C2463] mt-4">
          By continuing, you agree to our terms and conditions
        </p>
      </form>
      )}
    </div>
  );
}
