"use client";

import { Check } from "react-feather";

interface CheckoutStepperProps {
  currentStep: number;
}

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps = [
    { number: 1, label: "product details" },
    { number: 2, label: "address" },
    { number: 3, label: "payment" },
    { number: 4, label: "confirmation" },
  ];

  return (
    <div className="w-full py-6 sm:py-8 md:py-12">
      <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-8 md:gap-12 max-w-5xl mx-auto">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center min-w-20 sm:min-w-24 md:min-w-[120px]">
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all border-2 ${
                currentStep >= step.number
                  ? "bg-orchid-vertical-b border-transparent text-white"
                  : "bg-white text-heading border-gray-200"
              }`}
            >
              <span className="text-xl sm:text-2xl md:text-5xl font-light">{step.number}</span>
            </div>
            <span
              className={`mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-xl font-medium ${
                currentStep >= step.number
                  ? "text-heading"
                  : "text-gray-400"
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
