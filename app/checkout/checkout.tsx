"use client";
import { useState, useEffect } from "react";
import CheckoutStepper from "@/components/checkout/checkout-stepper";
import ProductDetailsStep from "@/components/checkout/product-details-step";
import AddressStep, { AddressFormData } from "@/components/checkout/address-step";
import PaymentStep, { PaymentFormData } from "@/components/checkout/payment-step";
import ConfirmationStep from "@/components/checkout/confirmation-step";
import SuccessPage from "@/components/checkout/success-page";
import { getS3PublicUrl } from "@/lib/s3-client";
import LoginRequiredModal from "@/components/auth/login-required-modal";
import { createClient } from "@/utils/supabase/client";

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
  const supabase = createClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [addressData, setAddressData] = useState<AddressFormData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

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

  const handleStartCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    setCurrentStep(2);
  };

  if (orderPlaced) return <SuccessPage />;

const sewistName = initialProduct.users 
  ? `${initialProduct.users.first_name} ${initialProduct.users.last_name}`.trim() 
  : 'Unknown Sewist';

const currentPrice = selectedVariant?.price_override ?? (initialProduct.price || 0);

const productImages = (
  initialProduct.product_images?.map((img) => getS3PublicUrl(img.image_url)) ?? []
).filter(Boolean);

if (productImages.length === 0) {
  const fallbackImage = getS3PublicUrl(initialProduct.img_src);
  if (fallbackImage) {
    productImages.push(fallbackImage);
  } else {
    productImages.push("/assets/placeholder-600x400.svg");
  }
}

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
            onNext={handleStartCheckout}
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
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        loginHref={`/auth/login?redirect=${encodeURIComponent(`/checkout?id=${initialProduct.id}`)}`}
        description="Please login first before placing an order."
      />
    </div>
  );
}
