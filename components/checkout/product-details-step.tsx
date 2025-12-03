"use client";

import Image from "next/image";

interface ProductDetailsStepProps {
  productName: string;
  productImage: string;
  productDescription: string;
  price: number;
  details: string[];
  onNext: () => void;
}

export default function ProductDetailsStep({
  productName,
  productImage,
  productDescription,
  price,
  details,
  onNext,
}: ProductDetailsStepProps) {
  return (
    <div className="py-8 max-w-dvw">
      <h2 className="text-6xl font-light text-primary mb-8 max-w-7xl px-10">
        Product Details
      </h2>

      <div className="flex flex-row gap-8 mb-6">
        <div className="shrink-0">
          <div className="relative -left-10 bg-orchid-vertical-b rounded-[80px] w-170">
            <span className="absolute top-1/2 -right-20 text-white text-6xl writing-mode-vertical transform -rotate-90">
              {productName}
            </span>
            <div className="relative p-20 pl-30 pr-10">
              <div className="relative rounded-3xl h-150 w-100 p-10">
                <Image
                  src={productImage}
                  alt={productName}
                  fill
                  className="object-cover w-full rounded-4xl"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between space-y-6 max-w-dvw px-4 mx-10 mr-30">
          <div className="flex flex-col justify-center text-left ">
            <h3 className="text-6xl font-semi text-primary mb-1">
              {productName}
            </h3>
            <p className="text-3xl font-semibold mb-6">by Ysabelle Santiago</p>

            <p className="text-2xl leading-relaxed mb-6 text-gray-700">
              {productDescription}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col mb-6 px-10 mx-30">
        <h4 className="text-4xl font-semibold text-primary mb-3">Details:</h4>
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

      <div
        className="relative h-60 max-w-dvw mx-50 m-20 cursor-pointer"
        onClick={onNext}
      >
        <Image
          src={productImage}
          alt={`${productName} detail`}
          fill
          className="object-cover rounded-2xl brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-7xl font-bold">Order</span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-2xl italic text-primary underline cursor-pointer hover:opacity-80">
          More about Ysabelle
        </p>
      </div>
    </div>
  );
}
