"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "react-feather";
import { useCart } from "@/context/CartContext";
import { resolvePublicMediaUrl } from "@/lib/media-url";

type Product = {
  id: string;
  user_id: string;
  name: string; 
  price: number;
  img_src: string;
  location: string; 
  type: string;
  created_at: string;
  is_active: boolean;
  rating: number; 
  sold: number;   
  description?: string;
};

export interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const checkoutHref = `/checkout?id=${product.id}`;
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Map ONLY needed fields for cart (no type assertion needed)
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      img_src: resolvePublicMediaUrl(product.img_src),
    };

    useCart().addToCart(cartItem as any);
  };

  return (
    <div className="relative flex flex-col h-160 w-80 bg-primary-light hover:shadow-lg transition-shadow">
      <Link href={checkoutHref} className="flex flex-col h-full">
        <div className="flex-1 relative">
          <Image
            src={resolvePublicMediaUrl(product.img_src)}
            alt={product.name}
            fill
            sizes="320px"
            className="object-cover"
          />
          <button
            onClick={handleAddToCart}
            className="absolute top-2 right-2 bg-secondary hover:bg-primary hover:text-white text-heading p-2 rounded-full shadow-lg transition-colors z-10"
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
        <div className="flex flex-col h-40">
          <div className="text-center">
            <h4 className="text-2xl font-medium">{product.name}</h4>
            <h5 className="text-lg">{product.location || product.type}</h5>
            <h6 className="text-md italic text-gray-400">
              ₱{typeof product.price === "number" ? product.price.toFixed(2) : product.price}
            </h6>
          </div>
          <div className="flex flex-1 p-4 gap-2 align-bottom items-end justify-between">
            <div className="flex gap-2">
              <Star fill="fill-primary" stroke="#7b3b7b" />
              <span>{product.rating ? product.rating.toFixed(1) : 'N/A'}</span>  
            </div>
            <div>
              <span>{product.sold || 0} sold</span> 
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
