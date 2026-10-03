"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import EcosystemSection from "@/components/EcosystemSection";
import ProductShowcase from "@/components/products/ProductShowcase";
import WorkflowSection from "@/components/workflow/WorkflowSection";
import TeamsSection from "@/components/home/TeamsSection";
import WhySection from "@/components/home/WhySection";
import TourSection from "@/components/home/TourSection";
import IntegrationsSection from "@/components/home/IntegrationsSection";
import SecuritySection from "@/components/home/SecuritySection";
import StoriesSection from "@/components/home/StoriesSection";
import PricingSection from "@/components/home/PricingSection";
import ResourcesSection from "@/components/home/ResourcesSection";
import FinalCtaSection from "@/components/home/FinalCtaSection";
import SiteFooter from "@/components/home/SiteFooter";

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
        <TeamsSection />
        <WhySection />
        <TourSection />
        <IntegrationsSection />
        <SecuritySection />
        <StoriesSection />
        <PricingSection />
        <ResourcesSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}





