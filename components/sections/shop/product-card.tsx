"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "react-feather";
import { useCart } from "@/context/CartContext";
import { Product as ProductType } from "@/data/products";

type Product = {
  id: string;
  imgSrc: string;
  productName: string;
  sewerName: string;
  price: number;
  rating: number;
  sold: number;
};

export interface ProductCardProps {
  product: Product;
}
export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product as ProductType);
  };

  return (
    <div className="relative flex flex-col h-160 w-80 bg-primary-light hover:shadow-lg transition-shadow">
      <Link
        href={`/checkout?id=${product.id}`}
        className="flex flex-col h-full"
      >
        <div className="flex-1 relative">
          <Image
            src={product.imgSrc}
            alt={product.productName}
            fill
            className="object-cover"
          />
          <button
            onClick={handleAddToCart}
            className="absolute top-2 right-2 bg-secondary hover:bg-primary hover:text-white text-primary p-2 rounded-full shadow-lg transition-colors z-10"
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
        <div className="flex flex-col h-40">
          <div className="text-center">
            <h4 className="text-2xl font-medium ">{product.productName}</h4>
            <h5 className="text-lg">{product.sewerName}</h5>
            <h6 className="text-md italic text-gray-400">
              ₱
              {typeof product.price === "number"
                ? product.price.toFixed(2)
                : product.price}
            </h6>
          </div>
          <div className="flex flex-1 p-4 gap-2 align-bottom items-end justify-between">
            <div className="flex gap-2">
              <Star fill="fill-primary" stroke="#7b3b7b" />
              <span>{product.rating}</span>
            </div>
            <div>
              <span>{product.sold} sold</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
