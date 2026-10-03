"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import EcosystemSection from "@/components/EcosystemSection";
import ProductShowcase from "@/components/products/ProductShowcase";
import WorkflowSection from "@/components/workflow/WorkflowSection";

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
        lightLogoSrc="/all-logo/foxses-full-logo-for-light-them.png"
        darkLogoSrc="/all-logo/foxses-full-logo-for-dark-them.png"
        logoAlt="Foxses Logo"
        menuItems={menuItems}
      />

      <main className="w-full">
        <Hero />
        <TrustedBy />
        <EcosystemSection />
        <ProductShowcase />
        <WorkflowSection />
      </main>
    </div>
  );
}





