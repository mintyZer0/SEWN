import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import VariantSelector, { type ProductVariant } from "./variant-selector";
import VariantImageCarousel from "./variant-image-carousel";

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

export default function ProductDetailsStep({
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
}: ProductDetailsStepProps) {
  const [mainImage, setMainImage] = React.useState(productImages[0] || "/placeholder.jpg");

  // Sync main image if productImages change
  React.useEffect(() => {
    if (productImages.length > 0) {
      setMainImage(productImages[0]);
    }
  }, [productImages]);

  const hasVariants = variants.length > 0;
  const canProceed = !hasVariants || selectedVariant;

  return (
    <div className="py-8 max-w-dvw">
      <h2 className="text-6xl font-light text-heading mb-8 max-w-7xl px-10">
        Product Details
      </h2>

      <div className="flex flex-row gap-8 mb-6">
        <div className="shrink-0">
          <div className="relative -left-10 bg-orchid-vertical-b rounded-[80px] w-170">
            <span className="absolute top-1/2 -right-20 text-white text-6xl writing-mode-vertical transform -rotate-90 whitespace-nowrap">
              {productName}
            </span>
            <div className="relative p-20 pl-30 pr-10">
              <div className="relative rounded-3xl h-150 w-100 p-10">
                <Image
                  src={mainImage}
                  alt={productName}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover w-full rounded-4xl transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-6 max-w-dvw px-4 mx-10 mr-30">
          <div className="flex flex-col justify-center text-left ">
            <h3 className="text-6xl font-semi text-heading mb-1">
              {productName}
            </h3>
            <p className="text-3xl font-semibold mb-6">
              by {sewist || 'Unknown Sewist'}
            </p>

            <p className="text-2xl leading-relaxed mb-6 text-gray-700">
              {productDescription}
            </p>

            <div className="space-y-1 mb-8">
              <span className="text-5xl font-black text-primary">
                ₱{price.toLocaleString()}
              </span>
              {selectedVariant && (
                <p className="text-lg text-emerald-600 font-bold uppercase">
                  {selectedVariant.stock_quantity > 0 
                    ? `${selectedVariant.stock_quantity} in stock` 
                    : "Out of stock"}
                </p>
              )}
            </div>

            {/* Variant Selector Component */}
            <VariantSelector 
              variants={variants} 
              onVariantSelect={onVariantSelect} 
            />
          </div>
        </div>
      </div>

      {/* Dynamic Image Carousel Component */}
      <VariantImageCarousel
        images={productImages}
        productName={productName}
        selectedImage={mainImage}
        onImageSelect={setMainImage}
        className="my-10"
      />

      <div className="flex flex-col mb-6 px-10 mx-30">
        <h4 className="text-4xl font-semibold text-heading mb-3">Details:</h4>
        <ul className="space-y-2">
          {details.map((detail, index) => (
            <li
              key={index}
              className="text-2xl text-gray-700 leading-relaxed font-semibold"
            >
              • {detail}
            </li>
          ))}
        </ul>
      </div>

      <button
        disabled={!canProceed || (selectedVariant && selectedVariant.stock_quantity <= 0)}
        className={cn(
          "relative h-60 w-[calc(100%-400px)] mx-auto block mb-20 rounded-2xl overflow-hidden shadow-xl transition-all active:scale-95 group disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed",
          canProceed ? "hover:shadow-primary/20" : ""
        )}
        onClick={onNext}
      >
        <Image
          src={mainImage}
          alt={`${productName} detail`}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <span className="text-white text-7xl font-bold">
            {!canProceed ? "Select Options" : (selectedVariant && selectedVariant.stock_quantity <= 0 ? "Out of Stock" : "Order")}
          </span>
        </div>
      </button>

      <div className="mt-8 text-center">
        <p className="text-2xl italic text-heading underline cursor-pointer hover:opacity-80">
          More about {sewist || 'Sewist'}
        </p>
      </div>
    </div>
  );
}
