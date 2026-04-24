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
  variant?: "default" | "sewist";
}

export default function Header({ variant = "default" }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const bgStyles = {
    default: "bg-orchid-light",
    sewist: "third-gradient",
  };

  const { cart, getCartCount, getCartTotal, updateQuantity, removeFromCart } = useCart();
  
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/browse/shop" },
    { name: "Sewists", href: "/browse/sewists" },
    { name: "Contacts", href: "/contacts" },
    { name: "About", href: "/about" },
    { name: "Sewist Center", href: process.env.NODE_ENV === "production" ? "https://sewist.sewn.com" : "http://sewist.sewn.local:3000" },
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
    <header className={cn("sticky top-0 left-0 right-0 z-[1001] shadow", bgStyles[variant])}>
      {/* Desktop Layout: 2 rows */}
      <div className="hidden md:grid grid-cols-6 grid-rows-2 items-center py-4 px-8 w-full gap-0">
        {/* Logo: Spans 2 rows */}
        <div className="col-start-1 col-end-2 row-start-1 row-end-3 flex items-center">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="SEWN Logo"
              height={200}
              width={200}
              className="w-30 md:w-55 h-auto object-contain"
            />
          </Link>
        </div>

        {/* Navigation: Desktop Row 1 */}
        <nav className="flex items-center justify-start text-white text-xs sm:text-2xl gap-x-2 sm:gap-x-20 col-start-2 col-end-6 row-start-1 row-end-1">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group whitespace-nowrap">
              <Link href={link.href} className="hover:opacity-70 transition-opacity">
                {link.name}
              </Link>
            </div>
          ))}
        </nav>

        {/* Search Bar: Desktop Row 2 */}
        <div className="col-start-2 col-end-6 row-start-2 row-end-2 px-0 mt-2">
          <SearchBar />
        </div>

        {/* Icons: Desktop Col 6 Row 1 */}
        <div className="col-start-6 col-end-7 row-start-1 row-end-1 flex justify-end items-center gap-x-8">
          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="text-white hover:opacity-80 hover:cursor-pointer transition-opacity relative"
            aria-label="Cart"
          >
            <ShoppingBag size={32} />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>

          {/* Profile Icon */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="text-white hover:opacity-80 hover:cursor-pointer transition-opacity relative"
            aria-label="Profile"
          >
            <User size={32} />
            <div
              className={`absolute right-0 mt-2 w-48 bg-secondary rounded-md shadow-lg py-2 z-10 transform transition-all duration-100 ease-out origin-top-right ${
                isProfileOpen
                  ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
                  : "opacity-0 scale-60 pointer-events-none -translate-y-1"
              }`}
            >
              <div className="px-2 text-sm text-black">
                <ul className="text-primary text-lg text-left">
                  <li>
                    <Link href="/user-profile" className="block px-4 py-2 hover:bg-gray-50">
                      User Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/logout" className="block px-4 py-2 hover:bg-gray-50">
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Layout: Flex Row */}
      <div className="md:hidden flex items-center justify-between py-4 px-4 w-full gap-3">
        {/* Logo */}
        <div className="flex-none">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="SEWN Logo"
              height={200}
              width={200}
              className="w-24 h-auto object-contain"
            />
          </Link>
        </div>

        {/* Search Bar - Grows to fill space between Logo and Menu */}
        <div className="flex-1 pr-10">
          <div className="relative flex items-center bg-white rounded-full px-3 py-1.5 shadow-inner w-full">
            <Search size={16} className="text-gray-400 mr-2 shrink-0" />
            <input
              type="search"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm w-full text-black placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Menu */}
        <div className="flex-none">
          {/* Hamburger Menu */}
          <div className="drawer drawer-end w-fit">
            <input id="mobile-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content w-fit">
              <label htmlFor="mobile-drawer" className="drawer-button cursor-pointer text-white">
                <Menu size={28} />
              </label>
            </div>
            <div className="drawer-side z-[1002]">
              <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu min-h-full w-80 p-4 pt-12 text-heading bg-secondary">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
                {/* Profile Links for Mobile */}
                <div className="divider my-2"></div>
                <li>
                  <Link href="/user-profile">User Profile</Link>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      setIsCartOpen(true);
                      const drawer = document.getElementById("mobile-drawer") as HTMLInputElement;
                      if (drawer) drawer.checked = false;
                    }} 
                    className="flex items-center justify-between w-full"
                  >
                    <span>Shopping Cart</span>
                    {getCartCount() > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 ml-2">
                        {getCartCount()}
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <Link href="/auth/logout">Logout</Link>
                </li>
              </ul>
            </div>
          </div>
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
                          <p className="text-sm text-gray-600">{item.sewist_name}</p>
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
