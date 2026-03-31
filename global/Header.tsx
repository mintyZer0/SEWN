"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, X, Plus, Minus, Menu } from "react-feather";
import { useRef, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import SearchBar from "@/components/ui/search-bar";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant?: "default" | "seller";
}

export default function Header({ variant = "default" }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showDelay = 100;
  const hideDelay = 100;

  const bgStyles = {
    default: "bg-orchid-light",
    seller: "bg-third-gradient",
  };

  // FIX 1: Added this missing function back!
  const handleProfileMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setIsProfileOpen(true), showDelay);
  };

  const handleProfileMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setIsProfileOpen(false), hideDelay);
  };
  
  const { cart, getCartCount, getCartTotal, updateQuantity, removeFromCart } = useCart();
  
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/browse/shop" },
    { name: "Sewers", href: "/browse/sewers" },
    { name: "Contacts", href: "/contacts" },
    { name: "About", href: "/about" },
    { name: "Sewer Center", href: "/sewer-center" },
  ];
  
  const router = useRouter();

  const iconButtons = [
    {
      icon: ShoppingBag,
      label: "Cart",
      onClick: () => setIsCartOpen(!isCartOpen),
    },
    {
      icon: User,
      label: "Profile",
      onClick: () => setIsProfileOpen(!isProfileOpen),
    },
  ];

  return (
    <header className={cn("sticky top-0 left-0 right-0 z-50 shadow overflow-x-hidden", bgStyles[variant])}>
      <div className="flex flex-col w-full py-4 px-4 sm:px-8 gap-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="md:hidden flex">
              <div className="drawer z-50">
                <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                  <label htmlFor="my-drawer-1" className="drawer-button cursor-pointer text-white">
                    <Menu size={28} />
                  </label>
                </div>
                <div className="drawer-side">
                  <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>
                  <ul className="menu bg-base-200 min-h-full w-80 p-4 mt-16 text-heading">
                    {navLinks.map((link) => (
                      <li key={link.name}>
                        <Link href={link.href}>{link.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <Link href="/">
              <Image
                src="/assets/logo.png"
                alt="SEWN Logo"
                height={200}
                width={200}
                className="w-24 md:w-55 h-auto object-contain"
              />
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 items-center justify-center text-white text-sm lg:text-xl gap-x-4 lg:gap-x-10">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group whitespace-nowrap">
                <Link href={link.href} className="hover:opacity-70 transition-opacity">
                  {link.name}
                </Link>
              </div>
            ))}
          </nav>

          <div className="hidden md:flex justify-end items-center gap-x-4 md:gap-x-8">
            {iconButtons.map((button) => {
              const Icon = button.icon;
              const Label = button.label;
              return (
                <button
                  key={button.label}
                  onMouseEnter={Label === "Profile" ? handleProfileMouseEnter : undefined}
                  onMouseLeave={Label === "Profile" ? handleProfileMouseLeave : undefined}
                  onClick={button.onClick}
                  className="text-white hover:opacity-80 hover:cursor-pointer transition-opacity relative"
                  aria-label={button.label}
                >
                  <Icon size={28} className="md:w-8 md:h-8" />
                  {Label === "Cart" && getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                  {Label === "Profile" && (
                    <div
                      className={`absolute right-0 mt-2 w-48 bg-secondary rounded-md shadow-lg py-2 z-10 transform transition-all duration-100 ease-out origin-top-right ${
                        isProfileOpen
                          ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
                          : "opacity-0 scale-60 pointer-events-none -translate-y-1"
                      }`}
                      onMouseEnter={handleProfileMouseEnter}
                      onMouseLeave={handleProfileMouseLeave}
                    >
                      <div className="px-2 text-sm text-black">
                        <ul className="text-primary text-lg">
                          <li>
                            <Link href="/user-profile" className="block px-4 py-2 hover:bg-gray-100">
                              User Profile
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full flex justify-center pb-2 md:pb-0">
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        <div className="flex md:hidden flex-1 justify-end items-center gap-x-4 absolute right-4 top-4 z-50">
          {iconButtons.map((button) => {
            const Icon = button.icon;
            const Label = button.label;
            return (
              <button
                key={button.label}
                onMouseEnter={Label === "Profile" ? handleProfileMouseEnter : undefined}
                onMouseLeave={Label === "Profile" ? handleProfileMouseLeave : undefined}
                onClick={button.onClick}
                className="text-white hover:opacity-80 hover:cursor-pointer transition-opacity relative"
                aria-label={button.label}
              >
                <Icon size={24} />
                {Label === "Cart" && getCartCount() > 0 && (
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
        <div className="fixed inset-0 bg-black/30 z-50" onClick={() => setIsCartOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-secondary shadow-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-heading">Shopping Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-heading hover:opacity-70">
                  <X size={24} />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-center text-gray-600 py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item: any) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-white rounded-lg shadow">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image src={item.img_src} alt={item.product_name || item.name} fill className="object-cover rounded" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-heading">{item.product_name || item.name}</h3>
                          <p className="text-sm text-gray-600">{item.sewer_name}</p>
                          <p className="text-heading font-semibold">₱{item.price?.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:opacity-70">
                            <X size={16} />
                          </button>
                          <div className="flex items-center gap-2">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-heading hover:opacity-70">
                              <Minus size={16} />
                            </button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-heading hover:opacity-70">
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-300 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-heading">Total:</span>
                      <span className="text-2xl font-bold text-heading">₱{getCartTotal().toFixed(2)}</span>
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