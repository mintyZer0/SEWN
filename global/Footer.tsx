import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
  variant?: "primary" | "orchid" | "seller";
}

export default function Footer({ variant = "primary" }: FooterProps) {
  const bgStyles = {
    primary: "bg-primary",
    orchid: "bg-orchid-light",
    seller: "third-gradient",
  };
  const footerSections = [
    {
      title: "Browse",
      links: [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop" },
        { name: "Services", href: "/services" },
      ],
    },
    {
      title: "Info",
      links: [
        { name: "Contacts", href: "/contact" },
        { name: "About", href: "/about" },
      ],
    },
    {
      title: "Socials",
      links: [
        { name: "Facebook", href: "https://facebook.com" },
        { name: "Instagram", href: "https://instagram.com" },
      ],
    },
  ];
  return (
    <footer>
      <div
        className={cn(
          "grid grid-cols-5 h-150 place-items-center gap-2",
          bgStyles[variant],
        )}
      >
        <div className="relative h-70 w-70 col-span-2">
          <Image
            src="/assets/logo.png"
            fill
            alt="logo"
            className="p-4 object-contain rounded-full bg-white"
          ></Image>
        </div>
        {footerSections.map((sections) => (
          <div
            key={sections.title}
            className="flex flex-col place-items-start h-40 gap-8"
          >
            <h3 className="text-white font-bold text-3xl">{sections.title}</h3>
            {sections.links.map((link) => (
              <Link
                className="text-lg text-white"
                key={link.name}
                href={link.href}
              >
                {link.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
