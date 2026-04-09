"use client";

import { useState } from "react";
import Image from "next/image";
import PrimaryButton from "../ui/primary-button";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface CommissionFormProps {
  sewerName: string;
  sewerImage: string;
  sewerId: string;
  serviceType: "commission" | "repair" | "alteration";
  disableEmail?: boolean;
  disableFullName?: boolean;
  disableFabric?: boolean;
  disableOrderDetails?: boolean;
  disableMeasurements?: boolean;
  disableScheduleAppointment?: boolean;
  orderDetailsLabel?: string;
}

export default function CommissionForm({
  sewerName,
  sewerImage,
  sewerId,
  serviceType,
  disableEmail = false,
  disableFullName = false,
  disableFabric = false,
  disableOrderDetails = false,
  disableMeasurements = false,
  disableScheduleAppointment = false,
  orderDetailsLabel = "Order Details",
}: CommissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const supabase = createClient();

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    fabricToUse: "",
    orderDetails: "",
    measurements: "",
    scheduleAppointment: "",
    appointmentDate: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleScheduleClick = () => {
    const dateInput = document.getElementById(
      "appointmentDate"
    ) as HTMLInputElement;
    if (dateInput) {
      dateInput.showPicker();
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setFormData((prev) => ({
      ...prev,
      appointmentDate: selectedDate,
      scheduleAppointment: selectedDate,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "scheduleAppointment") {
      setFormData((prev) => ({
        ...prev,
        scheduleAppointment: value,
        appointmentDate: value === "yes" ? prev.appointmentDate : "",
      }));
      setShowDatePicker(value === "yes");
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
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

      // Format details
      let finalDetails = formData.orderDetails;
      if (formData.fabricToUse) {
        finalDetails += `\nFabric: ${formData.fabricToUse}`;
      }
      if (formData.measurements) {
        finalDetails += `\nMeasurements: ${formData.measurements}`;
      }

      const { error: submitError } = await supabase.from("service_requests").insert({
        client_id: user.id,
        sewer_id: sewerId,
        service_type: serviceType,
        contact_email: formData.email || user.email || "",
        contact_phone: "Not provided", // Add to form later if needed
        contact_name: formData.fullName || user.user_metadata?.full_name || "User",
        request_details: finalDetails,
        appointment_date: formData.scheduleAppointment === "yes" && formData.appointmentDate 
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

  return (
    <div className="max-w-dvw mx-30 rounded-lg p-10 my-10">
      <h2 className="text-6xl font-regular text-heading mb-4">
        <span className="text-black">Commision</span> {sewerName}
      </h2>

      {success ? (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-3xl font-medium text-heading">Request Submitted!</h3>
          <p className="text-xl text-gray-600">The sewer will review your request and get back to you shortly.</p>
          <Link href={`/sewers/${sewerId}`}>
            <PrimaryButton className="mt-8">Return to Profile</PrimaryButton>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-500 rounded-md">
              {errorMsg}
            </div>
          )}
        {!disableEmail && (
          <div>
            <label
              htmlFor="email"
              className="block text-base font-light text-black mb-1"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent"
            />
          </div>
        )}

        {!disableFullName && (
          <div>
            <label
              htmlFor="fullName"
              className="block text-base font-light text-black mb-1"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent"
            />
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
            <div className="relative">
              <select
                id="fabricToUse"
                name="fabricToUse"
                required
                value={formData.fabricToUse}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-12 rounded-md border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select fabric type
                </option>
                {fabricOptions.map((fabric) => (
                  <option key={fabric} value={fabric}>
                    {fabric}
                  </option>
                ))}
              </select>
            </div>
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
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent resize-none"
            />
          </div>
        )}

        {!disableMeasurements && (
          <div>
            <label
              htmlFor="measurements"
              className="block text-base font-light text-black mb-1"
            >
              Measurements <span className="text-red-500">*</span>
            </label>
            <textarea
              id="measurements"
              name="measurements"
              required
              rows={4}
              value={formData.measurements}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent resize-none"
            />
          </div>
        )}

        {!disableScheduleAppointment && (
          <div>
            <label
              htmlFor="scheduleAppointment"
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
              onChange={handleDateChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2C2463] focus:border-transparent cursor-pointer"
            />
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
