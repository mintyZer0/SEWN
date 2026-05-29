"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { cart, removeFromCart, getCartTotal } = useCart();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-6 py-4 pt-8">
        <div className="flex items-center gap-2 text-primary">
          <ShoppingCart size={28} className="fill-primary/20" />
          <h1 className="text-3xl font-bold">Cart</h1>
        </div>
        <button 
          onClick={() => router.back()}
          className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
      </div>

      <div className="px-6 space-y-6 mt-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingCart size={64} className="text-gray-200 mb-4" />
            <p className="text-xl font-medium text-gray-500">Your cart is empty</p>
            <Link 
              href="/browse/shop"
              className="mt-6 bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg active:scale-95 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {cart.map((item: any) => (
              <div 
                key={item.id} 
                className="bg-[#A881AA] rounded-[30px] overflow-hidden shadow-md flex flex-col"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-[16/9] bg-gray-100">
                  <Image
                    src={item.img_src}
                    alt={item.product_name || item.name}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold leading-tight mb-1">
                    {item.product_name || item.name}
                  </h3>
                  <p className="text-sm opacity-90 mb-0.5">
                    {item.sewist_name || "SEWN Artisan"}
                  </p>
                  <p className="text-sm opacity-90 mb-0.5">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm opacity-90">
                    Price: ₱{item.price?.toLocaleString()}
                  </p>

                  <div className="w-full h-px bg-white/30 my-4"></div>

                  <div className="flex justify-end items-center">
                    <p className="text-xl font-bold">
                      Total ₱{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex-1 bg-[#7B3B7B] text-white py-2 rounded-xl font-bold text-sm shadow-inner active:scale-95 transition-all"
                    >
                      Remove
                    </button>
                    <Link
                      href={`/checkout?id=${item.id}`}
                      className="flex-1 bg-white text-[#7B3B7B] py-2 rounded-xl font-bold text-sm shadow-sm text-center active:scale-95 transition-all"
                    >
                      Checkout
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Overall Total Card */}
            <div className="bg-primary-light p-6 rounded-[24px] shadow-sm mb-10">
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium text-primary">Cart Total</span>
                <span className="text-2xl font-bold text-primary">₱{getCartTotal().toLocaleString()}</span>
              </div>
              <Link 
                href="/checkout"
                className="block w-full bg-primary text-white text-center py-4 rounded-2xl font-bold text-lg shadow-lg active:scale-95 transition-all"
              >
                Checkout All
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
