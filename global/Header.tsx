"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, X, Plus, Minus } from "react-feather";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, getCartCount, getCartTotal, updateQuantity, removeFromCart } =
    useCart();
  const navLinks = [
    { name: "Home", href: "/" },
    {
      name: "Browse",
      href: "/browse/shop",
      dropdown: [
        { name: "Browse Products", href: "/browse/shop" },
        { name: "Browse Sellers", href: "/browse/sewers" },
      ],
    },
    { name: "Contacts", href: "/contacts" },
    { name: "About", href: "/about" },
  ];

  const iconButtons = [
    { icon: Search, href: "", label: "Search", onClick: undefined },
    {
      icon: ShoppingBag,
      href: "",
      label: "Cart",
      onClick: () => setIsCartOpen(!isCartOpen),
    },
    { icon: User, href: "", label: "Profile", onClick: undefined },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-secondary-gradient-b">
      <div className="flex items-center py-4 px-4 sm:px-8 w-full">
        <div className="flex flex-1">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="SEWN Logo"
              height={100}
              width={100}
              className="w-16 md:w-30 h-auto"
            />
          </Link>
        </div>

        <nav className="flex items-center justify-center text-primary text-xs sm:text-lg gap-x-2 sm:gap-x-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <Link
                href={link.href}
                className="hover:opacity-70 transition-opacity"
              >
                {link.name}
              </Link>

              {link.dropdown && (
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-secondary-gradient-b shadow-lg rounded-md py-2 min-w-[180px]">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-primary hover:opacity-80 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex flex-1 justify-end items-center gap-x-8">
          {iconButtons.map((button) => {
            const Icon = button.icon;
            const isCart = button.label === "Cart";
            return (
              <button
                key={button.label}
                onClick={button.onClick}
                className="text-primary hover:opacity-70 transition-opacity relative"
                aria-label={button.label}
              >
                <Icon size={24} />
                {isCart && getCartCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-50"
          onClick={() => setIsCartOpen(false)}
        >
          <div
            className="fixed right-0 top-0 h-full w-96 bg-secondary shadow-lg overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-primary">
                  Shopping Cart
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-primary hover:opacity-70"
                >
                  <X size={24} />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-center text-gray-600 py-8">
                  Your cart is empty
                </p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-white rounded-lg shadow"
                      >
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.imgSrc}
                            alt={item.productName}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-primary">
                            {item.productName}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.sewerName}
                          </p>
                          <p className="text-primary font-semibold">
                            ₱{item.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:opacity-70"
                          >
                            <X size={16} />
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="text-primary hover:opacity-70"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="text-primary hover:opacity-70"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-primary">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        ₱{getCartTotal().toFixed(2)}
                      </span>
                    </div>
                    <Link href="/checkout">
                      <button className="w-full bg-primary text-white py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
                        Checkout
                      </button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
