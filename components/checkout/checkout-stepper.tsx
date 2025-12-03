"use client";

import { Check } from "react-feather";

interface CheckoutStepperProps {
  currentStep: number;
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { number: 1, label: "Product Details" },
    { number: 2, label: "Address" },
    { number: 3, label: "Payment" },
    { number: 4, label: "Confirmation" },
  ];

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-center gap-8 max-w-4xl mx-auto">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                currentStep > step.number
                  ? "bg-primary text-white"
                  : currentStep === step.number
                  ? "bg-primary text-white"
                  : "bg-white text-primary border-2 border-primary"
              }`}
            >
              {currentStep > step.number ? (
                <Check size={24} strokeWidth={3} />
              ) : (
                <span className="text-xl font-semibold">{step.number}</span>
              )}
            </div>
            <span
              className={`mt-2 text-sm ${
                currentStep >= step.number
                  ? "text-primary font-medium"
                  : "text-gray-500"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
