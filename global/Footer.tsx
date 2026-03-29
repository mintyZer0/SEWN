import Image from "next/image";
import Link from "next/link";

export default function Footer() {
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
    <footer className="w-full bg-primary overflow-hidden">
      <div className="flex flex-col md:grid md:grid-cols-5 h-auto md:h-150 place-items-center md:place-items-start gap-8 md:gap-2 p-8 md:py-16">
        <div className="relative h-40 w-40 md:h-70 md:w-70 md:col-span-2 flex justify-center items-center">
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
            className="flex flex-col items-center md:items-start h-auto gap-4 md:gap-8 text-center md:text-left"
          >
            <h3 className="text-white font-bold text-2xl md:text-3xl">{sections.title}</h3>
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
    </footer>
  );
}