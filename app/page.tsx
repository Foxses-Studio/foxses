"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

export default function Home() {
  // নেভিগেশন মেনু আইটেমসমূহ
  const menuItems = [
    { label: "Products", href: "/products", hasDropdown: true },
    { label: "Solutions", href: "/solutions", hasDropdown: true },
    { label: "Pricing", href: "/pricing", hasDropdown: false },
    { label: "Resources", href: "/resources", hasDropdown: true },
    { label: "Company", href: "/company", hasDropdown: true },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <Navbar
        logoSrc="/all-logo/foxses-full-logo.png"
        logoAlt="Foxses Logo"
        menuItems={menuItems}
      />

      <main className="w-full">
        <Hero />
      </main>
    </div>
  );
}





