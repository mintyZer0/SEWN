import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 bottom-0 left-0 right-0 z-50">
      <div className="flex bg-secondary min-h-6 py-4 px-4 sm:px-8 w-dvw">
        <div className="flex flex-1">
          <Link href="">
            <Image
              src="/assets/logo.png"
              alt="logo"
              height={100}
              width={100}
              className="w-16 md:w-30 h-auto"
              // fill={true}
            ></Image>
          </Link>
        </div>
        <div className="flex items-center justify-center text-primary text-xs sm:text-lg gap-x-2 sm:gap-x-8">
          <Link href="">Home</Link>
          <Link href="">Shops</Link>
          <Link href="">Services</Link>
          <Link href="">Contacts</Link>
          <Link href="">About</Link>
        </div>
        <div className="flex flex-1 justify-end items-center gap-x-2">
          <Link href="">
            <Image
              src="/assets/placeholder-600x400.svg"
              alt="icon"
              width={40}
              height={40}
            ></Image>
          </Link>
          <Link href="">
            <Image
              src="/assets/placeholder-600x400.svg"
              alt="icon"
              width={40}
              height={40}
            ></Image>
          </Link>
          <Link href="">
            <Image
              src="/assets/placeholder-600x400.svg"
              alt="icon"
              width={40}
              height={40}
            ></Image>
          </Link>
        </div>
      </div>
    </header>
  );
}
