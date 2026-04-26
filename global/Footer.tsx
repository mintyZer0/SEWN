import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterProps {
  variant?: "primary" | "orchid" | "sewist";
}

export default function Footer({ variant = "primary" }: FooterProps) {
  const isSewist = variant === "sewist";
  
  const bgStyles = {
    primary: "bg-primary",
    orchid: "bg-orchid-light",
    sewist: "third-gradient",
  };

  const textColors = isSewist ? "text-primary-dark" : "text-white";
  const separatorColor = isSewist ? "bg-primary-dark/20" : "bg-white/30";
  const logoSrc = isSewist ? "/assets/logo.png" : "/assets/logo-white.png";

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
            src={logoSrc}
            fill
            sizes="(max-width: 768px) 100vw, 480px"
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
              <h3 className={cn("font-bold text-2xl md:text-3xl mb-1 md:mb-2", textColors)}>{sections.title}</h3>
              {sections.links.map((link) => (
                <Link
                  className={cn("text-base md:text-lg hover:opacity-80 transition-opacity", textColors)}
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
        <div className={cn("w-full h-px mb-8", separatorColor)}></div>
        <p className={cn("text-base md:text-lg opacity-80 uppercase tracking-widest", textColors)}>
          © 2025, SEWNTUKAN
        </p>
      </div>
    </footer>
  );
}