import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User } from "react-feather";

export default function Header() {
  const navLinks = [
    { name: "Home", href: "" },
    { name: "Shops", href: "" },
    { name: "Services", href: "" },
    { name: "Contacts", href: "" },
    { name: "About", href: "" },
  ];

  const iconButtons = [
    { icon: Search, href: "", label: "Search" },
    { icon: ShoppingBag, href: "", label: "Cart" },
    { icon: User, href: "", label: "Profile" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-secondary">
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
            <Link key={link.href} href={link.href}>
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 justify-end items-center gap-x-8">
          {iconButtons.map((button) => {
            const Icon = button.icon;
            return (
              <Link
                key={button.href}
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
