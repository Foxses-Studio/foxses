"use client";

import Navbar from "@/components/Navbar";

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
        logoSrc="/foxses-full-logo.png"
        logoAlt="Foxses Logo"
        menuItems={menuItems}
      />

      <main className="mx-auto max-w-[1600px] px-6 py-16 text-center lg:px-12">
        {/* আপনার বাকি কাস্টম ডিজাইন এখানে তৈরি করতে পারেন */}
      </main>
    </div>
  );
}





