import React from "react";
import Link from "next/link";

function Header() {
  return (
    <header>
      <div className="flex bg-white min-h-4 p-4 w-dvw">
        <div>
          <h1>Logo</h1>
        </div>
        <div className="flex align-center justify-center bg-white gap-x-4 ml-auto mr-auto">
          <Link href="">Home</Link>
          <Link href="">Shops</Link>
          <Link href="">Services</Link>
          <Link href="">Contacts</Link>
          <Link href="">About</Link>
        </div>
        <div className="flex gap-x-2">
          <h1>icon</h1>
          <h1>icon</h1>
          <h1>icon</h1>
        </div>
      </div>
    </header>
  );
}

export default Header;
