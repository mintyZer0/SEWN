"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User, X, Plus, Minus, Menu } from "react-feather";
import { useRef, useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import SearchBar from "@/components/ui/search-bar";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showDelay = 100; // ms before showing
  const hideDelay = 100; // ms before hiding

  useEffect(() => {
    return () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  const handleProfileMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setIsProfileOpen(true), showDelay);
  };

  const handleProfileMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setIsProfileOpen(false), hideDelay);
  };
  const { cart, getCartCount, getCartTotal, updateQuantity, removeFromCart } =
    useCart();
  const navLinks = [
    { name: "Home", href: "/" },
    // {
    //   name: "Browse",
    //   href: "/browse/shop",
    //   dropdown: [
    //     { name: "Browse Products", href: "/browse/shop" },
    //     { name: "Browse Sellers", href: "/browse/sewers" },
    //   ],
    // },
    { name: "Shop", href: "/browse/shop" },
    { name: "Services", href: "/services" },
    { name: "Contacts", href: "/contacts" },
    { name: "About", href: "/about" },
    { name: "Seller Center", href: "/browse/sewers" },
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
      onClick: () => router.push("/user-profile"),
    },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-orchid-light shadow">
      <div className="grid items-center py-4 px-4 sm:px-8 w-full grid-cols-6 grid-rows-2">
        {/* Hamburger menu for mobile */}
        <div className="lg:hidden flex pr-4">
          <div className="drawer">
            <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
              {/* Page content here */}
              <label htmlFor="my-drawer-1" className="drawer-button">
                <Menu />
              </label>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer-1"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-base-200 min-h-full w-80 p-4">
                {/* Sidebar content here */}
                <li>
                  <a>Sidebar Item 1</a>
                </li>
                <li>
                  <a>Sidebar Item 2</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-1 relative col-start-1 col-end-1 row-start-1 row-end-3 gap-0">
          <Link href="/">
            <Image
              src="/assets/logo.png"
              alt="SEWN Logo"
              height={200}
              width={200}
              className="w-30 md:w-55 h-auto"
            />
          </Link>
        </div>
        {/* Centered nav links on desktop, hidden on mobile */}
        <nav className="hidden md:flex items-center justify-baseline text-white text-xs sm:text-2xl gap-x-2 sm:gap-x-20 col-start-2 col-end-6 row-start-1 row-end-1">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group">
              <Link
                href={link.href}
                className="hover:opacity-70 transition-opacity"
              >
                {link.name}
              </Link>

              {/* {link.dropdown && (
                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-orchid-light shadow-lg rounded-md py-2 min-w-[180px]">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm hover:opacity-80 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )} */}
            </div>
          ))}
        </nav>
        {/*search bar on the second row, hidden on mobile */}
        <div className="col-start-2 col-end-6 row-start-2 row-end-2 mt-2 ">
          <SearchBar />
        </div>

        {/* Icon buttons on the right */}
        <div className="flex flex-1 justify-end items-center gap-x-8 col-start-6 col-end-6 row-start-1 row-end-1">
          {iconButtons.map((button) => {
            const Icon = button.icon;
            const Label = button.label;
            return (
              <button
                key={button.label}
                onMouseEnter={
                  Label === "Profile" ? handleProfileMouseEnter : undefined
                }
                onMouseLeave={
                  Label === "Profile" ? handleProfileMouseLeave : undefined
                }
                onClick={button.onClick}
                className="text-white hover:opacity-80 hover:cursor-pointer transition-opacity relative"
                aria-label={button.label}
              >
                <Icon size={32} />
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
                          <Link
                            href="/user-profile"
                            className="block px-4 py-2 hover:bg-gray-100"
                          >
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
                <h2 className="text-2xl font-semibold text-heading">
                  Shopping Cart
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-heading hover:opacity-70"
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
                            src={item.img_src}
                            alt={item.product_name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-heading">
                            {item.product_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.sewer_name}
                          </p>
                          <p className="text-heading font-semibold">
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
                              className="text-heading hover:opacity-70"
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
                              className="text-heading hover:opacity-70"
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
                      <span className="text-lg font-semibold text-heading">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-heading">
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
