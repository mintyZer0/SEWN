import React, { memo, useCallback, useMemo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import VariantSelector, { type ProductVariant } from "./variant-selector";
import VariantImageCarousel from "./variant-image-carousel";
import { ProfileButton } from "@/components/user-profile/profile-buttons";

interface ProductDetailsStepProps {
  productName: string;
  productImages: string[];
  productDescription: string;
  price: number;
  sewist?: string;     
  details: string[];
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onVariantSelect: (variant: ProductVariant | null) => void;
  onNext: () => void;
}

const ProductDetailsStep = memo(({
  productName,
  productImages,
  productDescription,
  price,
  sewist,
  details,
  variants,
  selectedVariant,
  onVariantSelect,
  onNext,
}: ProductDetailsStepProps) => {
  const [mainImage, setMainImage] = React.useState(productImages[0] || "/placeholder.jpg");
  const [quantity, setQuantity] = React.useState(1);

  // Sync main image if productImages change
  React.useEffect(() => {
    if (productImages.length > 0) {
      setMainImage(productImages[0]);
    }
  }, [productImages]);

  // Calculate actual total stock from all variants
  const totalStock = useMemo(() => {
    return variants.reduce((acc, v) => acc + (v.stock_quantity || 0), 0);
  }, [variants]);

  // Determine current stock limit based on selection
  const currentMaxStock = selectedVariant ? selectedVariant.stock_quantity : totalStock;

  // Cap quantity if it exceeds available stock on change
  React.useEffect(() => {
    if (currentMaxStock === 0) {
      setQuantity(0);
    } else if (quantity > currentMaxStock) {
      setQuantity(currentMaxStock);
    } else if (quantity === 0 && currentMaxStock > 0) {
      setQuantity(1);
    }
  }, [currentMaxStock, quantity]);

  const hasVariants = variants.length > 0;
  // Can proceed if (not variants or variant selected) AND has stock
  const canProceed = (!hasVariants || !!selectedVariant) && currentMaxStock > 0;

  const handleDecrement = useCallback(() => {
    setQuantity((prev) => Math.max(currentMaxStock > 0 ? 1 : 0, prev - 1));
  }, [currentMaxStock]);

  const handleIncrement = useCallback(() => {
    setQuantity((prev) => (prev < currentMaxStock ? prev + 1 : prev));
  }, [currentMaxStock]);

  return (
    <div className="py-8 w-full overflow-hidden bg-white">
      {/* Title Area - Shifted left */}
      <div className="w-full pl-6 lg:pl-12 xl:pl-32 mb-12 animate-in fade-in slide-in-from-top-4 duration-1000 fill-mode-both">
        <h2 className="text-7xl font-bold text-heading max-w-7xl">
          Product Details
        </h2>
      </div>

      {/* Main Grid - Shifted left */}
      <div className="w-full pl-0 lg:pl-0 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-24 items-start">
          
          {/* COLUMN 1: LEFT SIDE (Image + Variants) */}
          <div className="flex flex-col space-y-12 max-w-fit">
            {/* Image Container - Locked to viewport edge */}
            <div className="relative shrink-0 animate-in fade-in slide-in-from-left-12 duration-1000 fill-mode-both">
              <div className="bg-orchid-vertical-b rounded-tr-[100px] rounded-br-[100px] p-16 pr-32 flex flex-col items-start justify-center relative">
                {/* Subtle Grain Texture */}
                <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                <div className="flex items-center">
                  <div className="bg-white rounded-[50px] p-6 relative shadow-2xl">
                    <div className="relative w-[400px] h-[500px] overflow-hidden rounded-[40px]">
                      <Image
                        src={mainImage}
                        alt={productName}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                  {/* Vertical Text */}
                  <div className="ml-10 py-8 flex items-center justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
                    <span className="text-white text-7xl font-light tracking-widest whitespace-nowrap inline-block rotate-180" style={{ writingMode: 'vertical-rl' }}>
                      {productName.toLowerCase()}
                    </span>
                  </div>
                </div>
                <p className="mt-6 text-white/90 font-light text-2xl italic animate-in fade-in slide-in-from-left-4 duration-700 delay-500 fill-mode-both">by {sewist}</p>
              </div>
            </div>

            {/* Variant Selectors - Positioned exactly under image */}
            <div className="pl-12 lg:pl-12 xl:pl-32 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600 fill-mode-both">
              <VariantSelector 
                variants={variants} 
                onVariantSelect={onVariantSelect} 
              />
            </div>
          </div>

          {/* COLUMN 2: RIGHT SIDE (Title + Desc + Actions) */}
          <div className="flex flex-col ml-20 space-y-12 pt-4 pr-6 lg:pr-12 xl:pr-32 animate-in fade-in slide-in-from-right-12 duration-1000 fill-mode-both">
            <div>
              <h3 className="text-8xl font-bold text-heading mb-3">{productName}</h3>
              <p className="text-3xl font-bold text-heading">by {sewist}</p>
            </div>

            <p className="text-2xl text-gray-600 leading-relaxed max-w-2xl font-medium">
              {productDescription || "Step into effortless style with the Walk Rhythm shirt, a modern twist on classic tailoring. Featuring crisp vertical stripes that elongate the silhouette, this button-down is designed for movement and confidence."}
            </p>

            <div className="space-y-12">
              {/* Quantity Stepper */}
              <div className="space-y-6">
                <h4 className="text-3xl font-bold text-heading">Quantity</h4>
                <div className="flex items-center gap-10">
                  <div className="flex items-center border-2 border-primary-light rounded-full px-6 py-1">
                    <button 
                      type="button"
                      onClick={handleDecrement}
                      disabled={quantity <= (currentMaxStock > 0 ? 1 : 0)}
                      className="text-primary text-4xl font-light w-10 disabled:opacity-30"
                    >-</button>
                    <span className="text-3xl font-medium px-8 min-w-[80px] text-center">{quantity}</span>
                    <button 
                      type="button"
                      onClick={handleIncrement}
                      disabled={quantity >= currentMaxStock}
                      className="text-primary text-4xl font-light w-10 disabled:opacity-30"
                    >+</button>
                  </div>
                  <span className="text-gray-400 text-2xl font-medium">
                    Stocks: {currentMaxStock}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-6 w-full max-w-xl">
                <ProfileButton 
                  variant="white" 
                  size="xl" 
                  disabled={!canProceed}
                  className="rounded-full border-2 border-primary-light text-primary py-6 text-3xl shadow-sm w-full"
                >
                  {currentMaxStock > 0 ? "Add to Cart" : "Out of Stock"}
                </ProfileButton>
                
                <ProfileButton
                  variant="orange"
                  size="xl"
                  disabled={!canProceed}
                  onClick={onNext}
                  className="rounded-full bg-orchid-vertical-b text-white text-5xl py-8 shadow-xl w-full"
                >
                  {currentMaxStock > 0 ? "Order" : "Out of Stock"}
                </ProfileButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section - Shifted left */}
      <div className="w-full pl-6 lg:pl-12 xl:pl-32 pr-6">
        <div className="animate-in fade-in duration-1000 delay-700 fill-mode-both">
          <VariantImageCarousel
            images={productImages}
            productName={productName}
            selectedImage={mainImage}
            onImageSelect={setMainImage}
            className="mb-24 -mx-4"
          />
        </div>

        {/* Details Section - Shifted left */}
        <div className="space-y-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-800 fill-mode-both">
          <h4 className="text-4xl font-bold text-heading">Details:</h4>
          <ul className="space-y-1 max-w-4xl">
            {(details.length > 0 ? details : [
              "Fit: Tailored fit with a slightly relaxed silhouette",
              "Material: Lightweight cotton blend (estimated)",
              "Color: Monochrome stripe palette (black, white, and grey tones)",
              "Hem: Straight hem, ideal for tucking in"
            ]).map((detail, index) => (
              <li
                key={index}
                className="text-2xl text-gray-700 leading-relaxed flex items-start"
              >
                <span className="mr-4 font-bold">•</span>
                <span className="font-medium">{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Comments Section */}
      <div className="w-full bg-[#FFF0F5] mt-32 py-24 px-6 animate-in fade-in duration-1000 delay-1000 fill-mode-both">
        <div className="max-w-7xl ml-6 lg:ml-12 xl:ml-32">
          <h3 className="text-5xl font-bold text-heading mb-10">Comments</h3>
          <div className="bg-white rounded-[40px] h-64 w-full shadow-sm max-w-7xl"></div>
        </div>
      </div>
    </div>
  );
});

ProductDetailsStep.displayName = "ProductDetailsStep";
export default ProductDetailsStep;
