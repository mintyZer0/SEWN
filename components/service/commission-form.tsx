"use client";

import { useState } from "react";
import Image from "next/image";
import PrimaryButton from "../ui/primary-button";

interface CommissionFormProps {
  sewerName: string;
  sewerImage: string;
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
  disableEmail = false,
  disableFullName = false,
  disableFabric = false,
  disableOrderDetails = false,
  disableMeasurements = false,
  disableScheduleAppointment = false,
  orderDetailsLabel = "Order Details",
}: CommissionFormProps) {
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
      <h2 className="text-6xl font-regular text-primary mb-4">
        <span className="text-black">Commision</span> {sewerName}
      </h2>

      <form className="space-y-5">
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

        <PrimaryButton type="submit">Confirm Order</PrimaryButton>

        <p className="text-xs text-center text-[#2C2463] mt-4">
          By continuing, you agree to our terms and conditions
        </p>
      </form>
    </div>
  );
}
