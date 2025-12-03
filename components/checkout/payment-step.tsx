"use client";

import { useState } from "react";

interface PaymentStepProps {
  orderTotal: number;
  onSubmit: (data: PaymentFormData) => void;
}

export interface PaymentFormData {
  paymentMethod: "credit" | "paymaya" | "gcash" | "other";
  creditCardNumber?: string;
  cardholderName?: string;
  expirationDate?: string;
  cvv?: string;
  saveCard?: boolean;
}

export default function PaymentStep({
  orderTotal,
  onSubmit,
}: PaymentStepProps) {
  const [paymentMethod, setPaymentMethod] = useState<
    "credit" | "paymaya" | "gcash" | "other"
  >("credit");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: PaymentFormData = {
      paymentMethod,
      creditCardNumber: formData.get("creditCardNumber") as string,
      cardholderName: formData.get("cardholderName") as string,
      expirationDate: formData.get("expirationDate") as string,
      cvv: formData.get("cvv") as string,
      saveCard: formData.get("saveCard") === "on",
    };
    onSubmit(data);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-light text-primary">
          Select Payment Method
        </h2>
        <p className="text-xl text-gray-700">
          Order total:{" "}
          <span className="text-primary font-medium">₱{orderTotal}</span>
        </p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-gray-300 pb-4">
        <button
          type="button"
          onClick={() => setPaymentMethod("credit")}
          className={`px-6 py-2 font-medium transition-colors ${
            paymentMethod === "credit"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
        >
          Credit Card
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("paymaya")}
          className={`px-6 py-2 font-medium transition-colors ${
            paymentMethod === "paymaya"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
        >
          PayMaya
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("gcash")}
          className={`px-6 py-2 font-medium transition-colors ${
            paymentMethod === "gcash"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
        >
          GCash
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod("other")}
          className={`px-6 py-2 font-medium transition-colors ${
            paymentMethod === "other"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-500"
          }`}
        >
          Other
        </button>
      </div>

      {paymentMethod === "credit" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-center text-lg font-medium text-primary mb-6">
            Pay using credit cards
          </p>

          <div>
            <label
              htmlFor="creditCardNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Credit Card
            </label>
            <input
              type="text"
              id="creditCardNumber"
              name="creditCardNumber"
              placeholder="1234 5678 9012 3456"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="cardholderName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expirationDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Expiration Date
              </label>
              <input
                type="text"
                id="expirationDate"
                name="expirationDate"
                placeholder="MM/YY"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label
                htmlFor="cvv"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                placeholder="123"
                required
                maxLength={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="saveCard"
              name="saveCard"
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
              Save Card
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            Proceed
          </button>

          <div className="bg-secondary p-8 rounded-lg mt-8">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-light text-gray-800 mb-4 border-b border-gray-400 pb-2 inline-block">
                  Order Summary
                </h3>
                <p className="text-base text-gray-700 mt-4">
                  1x Walk Rhythm by Ysabelle Santiago - P{orderTotal}
                </p>
              </div>
              <div className="text-right border-l border-gray-400 pl-8 ml-8">
                <p className="text-lg text-primary mb-2">Order total:</p>
                <p className="text-5xl text-primary font-light">
                  ₱{orderTotal}
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
