"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "react-feather";
import { useCart } from "@/context/CartContext";
import { getS3PublicUrl } from "@/lib/s3-client";

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
      img_src: getS3PublicUrl(product.img_src),
    };

    useCart().addToCart(cartItem as any);
  };

  return (
    <div className="relative flex flex-col w-full bg-[#E6D4E6] rounded-sm overflow-hidden hover:shadow-lg transition-all group active:scale-[0.98]">
      <Link href={checkoutHref} className="flex flex-col h-full">
        <div className="relative w-full aspect-[4/5] bg-gray-100">
            <Image
            src={getS3PublicUrl(product.img_src)}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 320px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={handleAddToCart}
            className="absolute top-2 right-2 bg-white/80 hover:bg-primary hover:text-white text-primary p-2 rounded-full shadow-md transition-all z-10 scale-90 sm:scale-100"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
        <div className="flex flex-col p-3 sm:p-4">
          <div className="text-center sm:text-left">
            <h4 className="text-[15px] sm:text-2xl font-bold text-gray-900 leading-tight truncate">{product.name}</h4>
            <h5 className="text-[11px] sm:text-lg text-gray-700 mt-0.5 truncate">{product.location || product.type}</h5>
            <h6 className="text-[11px] sm:text-md italic text-gray-500 mt-1">
              ₱{typeof product.price === "number" ? product.price.toFixed(2) : product.price}
            </h6>
          </div>
          <div className="flex px-1 pt-3 gap-2 items-center justify-between text-[10px] sm:text-sm">
            <div className="flex gap-1 items-center bg-primary/10 px-1.5 py-0.5 rounded-full">
              <Star size={12} fill="#7b3b7b" stroke="#7b3b7b" className="sm:size-4" />
              <span className="font-bold text-primary">{product.rating ? product.rating.toFixed(1) : '4.5'}</span>  
            </div>
            <div className="text-gray-500">
              <span className="font-medium">{product.sold || 0} sold</span> 
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
