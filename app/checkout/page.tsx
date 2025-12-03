"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/products";
import CheckoutStepper from "@/components/checkout/checkout-stepper";
import ProductDetailsStep from "@/components/checkout/product-details-step";
import AddressStep, {
  AddressFormData,
} from "@/components/checkout/address-step";
import PaymentStep, {
  PaymentFormData,
} from "@/components/checkout/payment-step";
import ConfirmationStep from "@/components/checkout/confirmation-step";
import SuccessPage from "@/components/checkout/success-page";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id") || "1";
  const product = products.find((p) => p.id === productId) || products[0];

  const [currentStep, setCurrentStep] = useState(1);
  const [addressData, setAddressData] = useState<AddressFormData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const handleAddressSubmit = (data: AddressFormData) => {
    setAddressData(data);
    setCurrentStep(3);
  };

  const handlePaymentSubmit = (data: PaymentFormData) => {
    setPaymentData(data);
    setCurrentStep(4);
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return <SuccessPage />;
  }

  return (
    <div
      className="min-h-dvw
    "
    >
      <CheckoutStepper currentStep={currentStep} />

      <div className="pb-12">
        {currentStep === 1 && (
          <ProductDetailsStep
            productName={product.productName}
            productImage={product.imgSrc}
            productDescription={product.description || ""}
            price={product.price}
            details={product.details || []}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && <AddressStep onSubmit={handleAddressSubmit} />}

        {currentStep === 3 && (
          <PaymentStep
            orderTotal={product.price}
            onSubmit={handlePaymentSubmit}
          />
        )}

        {currentStep === 4 && addressData && paymentData && (
          <ConfirmationStep
            addressData={addressData}
            paymentData={paymentData}
            orderTotal={product.price}
            productName={product.productName}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
      </div>
    </div>
  );
}
