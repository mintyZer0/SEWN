import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User } from "react-feather";

export default function Header() {
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
    { icon: Search, href: "", label: "Search" },
    { icon: ShoppingBag, href: "", label: "Cart" },
    { icon: User, href: "", label: "Profile" },
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
            return (
              <Link
                key={button.label}
                href={button.href}
                className="text-primary hover:opacity-70 transition-opacity"
                aria-label={button.label}
              >
                <Icon size={24} />
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
