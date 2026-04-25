import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
  variant?: "primary" | "orchid" | "sewist";
}

export default function Footer({ variant = "primary" }: FooterProps) {
  const bgStyles = {
    primary: "bg-primary",
    orchid: "bg-orchid-light",
    sewist: "third-gradient",
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
    <footer className={cn("w-full overflow-hidden", bgStyles[variant])}>
      <div className="flex flex-col md:grid md:grid-cols-12 h-auto md:h-120 place-items-center md:items-center p-8 md:px-16 md:py-16">
        <div className="relative h-64 w-full md:h-120 md:w-120 md:col-span-5 flex justify-center items-center md:justify-start">
          <Image
            src="/assets/logo-white.png"
            fill
            alt="logo"
            className="object-contain"
          />
        </div>

        <div className="md:col-span-7 flex flex-col md:flex-row items-center md:items-start justify-start gap-8 md:gap-30 w-full md:-mt-12">
          {footerSections.map((sections) => (
            <div
              key={sections.title}
              className="flex flex-col items-center md:items-start h-auto gap-2 md:gap-3 text-center md:text-left"
            >
              <h3 className="text-white font-bold text-2xl md:text-3xl mb-1 md:mb-2">{sections.title}</h3>
              {sections.links.map((link) => (
                <Link
                  className="text-base md:text-lg text-white hover:opacity-80 transition-opacity"
                  key={link.name}
                  href={link.href}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full px-8 md:px-16 pb-8 text-center">
        <div className="w-full h-px bg-white/30 mb-8"></div>
        <p className="text-white text-base md:text-lg opacity-80 uppercase tracking-widest">
          © 2025, SEWNTUKAN
        </p>
      </div>
    </footer>
  );
}