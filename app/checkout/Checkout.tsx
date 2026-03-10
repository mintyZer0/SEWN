"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CheckoutStepper from "@/components/checkout/checkout-stepper";
import ProductDetailsStep from "@/components/checkout/product-details-step";
import AddressStep, { AddressFormData } from "@/components/checkout/address-step";
import PaymentStep, { PaymentFormData } from "@/components/checkout/payment-step";
import ConfirmationStep from "@/components/checkout/confirmation-step";
import SuccessPage from "@/components/checkout/success-page";

interface Product {
  id: string;
  user_id: string;
  name: string;
  price: number;
  img_src: string;
  seller_name: string; 
  location: string;
  type: string;
  description?: string;
}


export default function CheckoutClient({ 
  initialProduct 
}: { 
  initialProduct: Product 
}) {
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

  if (orderPlaced) return <SuccessPage />;

const sellerName = initialProduct.seller_name || 'Unknown Seller';
  return (
    <div className="min-h-dvw">
      <CheckoutStepper currentStep={currentStep} />
      <div className="pb-12">
        {currentStep === 1 && (
          <ProductDetailsStep
            productName={initialProduct.name || 'Unknown Product'}
            productImage={initialProduct.img_src || '/placeholder.jpg'}
            productDescription={initialProduct.description || ""}
            price={initialProduct.price || 0}
            seller={sellerName}
            details={[]}  // Add details table later
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && <AddressStep onSubmit={handleAddressSubmit} />}

        {currentStep === 3 && (
          <PaymentStep
            orderTotal={initialProduct.price || 0}
            onSubmit={handlePaymentSubmit}
          />
        )}

        {currentStep === 4 && addressData && paymentData && (
          <ConfirmationStep
            addressData={addressData}
            paymentData={paymentData}
            orderTotal={initialProduct.price || 0}
            productName={initialProduct.name || 'Unknown Product'}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
      </div>
    </div>
  );
}
