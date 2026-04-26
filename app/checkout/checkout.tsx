"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CheckoutStepper from "@/components/checkout/checkout-stepper";
import ProductDetailsStep from "@/components/checkout/product-details-step";
import AddressStep, { AddressFormData } from "@/components/checkout/address-step";
import PaymentStep, { PaymentFormData } from "@/components/checkout/payment-step";
import ConfirmationStep from "@/components/checkout/confirmation-step";
import SuccessPage from "@/components/checkout/success-page";

interface ProductVariant {
  id: string;
  sku: string;
  stock_quantity: number;
  price_override: number | null;
  variant_attribute_values: {
    attribute_type: string;
    attribute_value: string;
  }[];
}

interface Product {
  id: string;
  user_id: string;
  name: string;
  price: number;
  img_src: string;
  location: string;
  type: string;
  description?: string;
  users?: {
    first_name: string;
    last_name: string;
  };
  product_variants?: ProductVariant[];
  product_images?: {
    image_url: string;
    display_order: number;
    is_main: boolean;
  }[];
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
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

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

const sewistName = initialProduct.users 
  ? `${initialProduct.users.first_name} ${initialProduct.users.last_name}`.trim() 
  : 'Unknown Sewist';

const currentPrice = selectedVariant?.price_override ?? (initialProduct.price || 0);

const productImages = initialProduct.product_images?.map(img => img.image_url) || [initialProduct.img_src || '/placeholder.jpg'];

  return (
    <div className="min-h-dvw">
      <CheckoutStepper currentStep={currentStep} />
      <div className="pb-12">
        {currentStep === 1 && (
          <ProductDetailsStep
            productName={initialProduct.name || 'Unknown Product'}
            productImages={productImages}
            productDescription={initialProduct.description || ""}
            price={currentPrice}
            sewist={sewistName}
            details={[]}
            variants={initialProduct.product_variants || []}
            selectedVariant={selectedVariant}
            onVariantSelect={setSelectedVariant}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && <AddressStep onSubmit={handleAddressSubmit} />}

        {currentStep === 3 && (
          <PaymentStep
            orderTotal={currentPrice}
            onSubmit={handlePaymentSubmit}
          />
        )}

        {currentStep === 4 && addressData && paymentData && (
          <ConfirmationStep
            addressData={addressData}
            paymentData={paymentData}
            orderTotal={currentPrice}
            productName={initialProduct.name || 'Unknown Product'}
            onPlaceOrder={handlePlaceOrder}
          />
        )}
      </div>
    </div>
  );
}
