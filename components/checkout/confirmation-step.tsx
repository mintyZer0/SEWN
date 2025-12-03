"use client";

import { AddressFormData } from "./address-step";
import { PaymentFormData } from "./payment-step";

interface ConfirmationStepProps {
  addressData: AddressFormData;
  paymentData: PaymentFormData;
  orderTotal: number;
  productName: string;
  onPlaceOrder: () => void;
}

export default function ConfirmationStep({
  addressData,
  paymentData,
  orderTotal,
  productName,
  onPlaceOrder,
}: ConfirmationStepProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-light text-primary">Order Confirmation</h2>
        <p className="text-xl text-gray-700">
          Order total:{" "}
          <span className="text-primary font-medium">₱{orderTotal}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-medium text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Your information
          </h3>
          <div className="space-y-2 text-gray-700">
            <p className="font-medium">{addressData.fullName}</p>
            <p className="text-sm">{addressData.email}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Payment
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">
                {paymentData.paymentMethod === "gcash" ? "G" : "💳"}
              </span>
            </div>
            <span className="text-gray-700 capitalize">
              {paymentData.paymentMethod}
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Billing Address
          </h3>
          <div className="space-y-1 text-sm text-gray-700">
            <p className="font-medium">{addressData.fullName}</p>
            <p>{addressData.address}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-medium text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Order Summary
          </h3>
          <p className="text-sm text-gray-700">
            1x {productName} - ₱{orderTotal}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center p-6 rounded-lg border border-gray-200 mb-6">
        <p className="text-xl font-medium text-primary">Total: ₱{orderTotal}</p>
        <button
          onClick={onPlaceOrder}
          className="bg-orchid text-white px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
