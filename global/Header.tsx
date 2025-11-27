import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="sticky top-0 bottom-0 left-0 right-0 z-50">
      <div className="flex bg-secondary min-h-6 py-6 px-8 w-dvw">
        <div className="flex flex-1">
          <Link href="">
            <Image
              src="/assets/placeholder-600x400.svg"
              alt="logo"
              height={40}
              width={40}
            ></Image>
          </Link>
        </div>
        <div className="flex align-center justify-center text-primary text-2x1 gap-x-8">
          <Link href="">Home</Link>
          <Link href="">Shops</Link>
          <Link href="">Services</Link>
          <Link href="">Contacts</Link>
          <Link href="">About</Link>
        </div>
        <div className="flex flex-1 justify-end gap-x-2">
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
