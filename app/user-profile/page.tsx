import { divIcon } from "leaflet";
import React from "react";
import { User, ShoppingBag, Ruler, Bell } from "lucide-react";
import Link from "next/link";

export default function UserProfile() {
  return (
    <div className="flex min-h-screen gap-4 p-10">
      <aside className="flex w-64 p-6">
        <div className="flex flex-col">
          <div className="flex gap-2 ">
            <User className="text-heading" />
            <h3 className="text-heading text-2xl">Account</h3>
          </div>
          <ul className="border-l-2 border-primary ml-8 pl-4">
            <li>
              <Link href="/"> Hello</Link>
            </li>
          </ul>
        </div>
        <ul className=""></ul>
        <ul className=""></ul>
      </aside>
      <main></main>
    </div>
  );
}
