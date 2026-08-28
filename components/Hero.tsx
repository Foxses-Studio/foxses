"use client";

import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  FaBoxesPacking,
  FaFileInvoiceDollar,
  FaUsersGear,
  FaWpforms,
  FaHeadset,
  FaLayerGroup,
  FaRobot,
  FaArrowRight,
  FaCheck,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";

interface ProductCategory {
  id: string;
  name: string;
}

const categories: ProductCategory[] = [
  { id: "all", name: "All Apps" },
  { id: "inventory", name: "Inventory" },
  { id: "invoice", name: "Invoice" },
  { id: "hr", name: "HR & Team" },
  { id: "forms", name: "Cloud Forms" },
  { id: "support", name: "Support Desk" },
];

interface ProductApp {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const foxsesApps: ProductApp[] = [
  {
    id: "inventory",
    categoryId: "inventory",
    name: "Foxses Inventory",
    description: "Real-time stock tracking and warehouse management.",
    icon: <FaBoxesPacking className="h-5 w-5 text-[#f25b2a]" />,
    href: "/products/inventory",
  },
  {
    id: "invoice",
    categoryId: "invoice",
    name: "Foxses Invoice",
    description: "Automated billing, invoicing, and payment tracking.",
    icon: <FaFileInvoiceDollar className="h-5 w-5 text-[#f25b2a]" />,
    href: "/products/invoice",
  },
  {
    id: "hr",
    categoryId: "hr",
    name: "Foxses HR",
    description: "Employee records, attendance, payroll, and team workflows.",
    icon: <FaUsersGear className="h-5 w-5 text-[#f25b2a]" />,
    href: "/products/foxses-hr",
  },
  {
    id: "forms",
    categoryId: "forms",
    name: "Cloud Forms",
    description: "Smart forms and data collection for your business.",
    icon: <FaWpforms className="h-5 w-5 text-[#f25b2a]" />,
    href: "/products/cloud-forms",
  },
  {
    id: "support",
    categoryId: "support",
    name: "Support System",
    description: "Customer helpdesk and automated support ticketing.",
    icon: <FaHeadset className="h-5 w-5 text-[#f25b2a]" />,
    href: "/products/web-support-system",
  },
  {
    id: "templates",
    categoryId: "all",
    name: "Foxses Templates",
    description: "Ready-to-use business layouts and document templates.",
    icon: <FaLayerGroup className="h-5 w-5 text-[#f25b2a]" />,
    href: "/products/templates",
  },
];

export default function Hero() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredApps =
    selectedCategory === "all"
      ? foxsesApps
      : foxsesApps.filter((app) => app.categoryId === selectedCategory);

  const handleGetStarted = () => {
    Swal.fire({
      title: "Get Started Free",
      text: "Start your 14-day trial with Foxses Studio.",
      icon: "success",
      confirmButtonText: "Create Account",
      confirmButtonColor: "#f25b2a",
      customClass: {
        popup: "rounded-[8px] shadow-none",
      },
    });
  };

  const handleSaraAIModal = () => {
    Swal.fire({
      title: "Sara AI Agent Studio",
      text: "Smart AI automation built across Foxses Inventory, Invoice, HR, Forms & Support.",
      icon: "info",
      confirmButtonText: "Learn More",
      confirmButtonColor: "#f25b2a",
      customClass: {
        popup: "rounded-[8px] shadow-none",
      },
    });
  };

  return (
    <section className="relative bg-white dark:bg-zinc-950 pt-8 pb-16 lg:pt-12 lg:pb-20 border-b border-zinc-200/80 dark:border-zinc-800">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 text-center">
        
        {/* Top Feature Pill */}
        <div
          onClick={handleSaraAIModal}
          className="inline-flex items-center gap-2 rounded-full border border-[#f25b2a]/30 bg-[#fff6f0] dark:bg-[#f25b2a]/10 px-4 py-1 text-[16px] text-[#f25b2a] font-medium transition-colors hover:border-[#f25b2a] mb-6 cursor-pointer shadow-none"
        >
          <FaWandMagicSparkles className="h-3.5 w-3.5 text-[#f25b2a]" />
          <span>Sara AI Studio</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-zinc-600 dark:text-zinc-300 font-normal">Connected Apps 2.0</span>
          <FaArrowRight className="h-3 w-3 text-[#f25b2a] ml-1" />
        </div>

        {/* Clean, Sleek Headline */}
        <h1 className="mx-auto max-w-4xl text-3xl font-semibold text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl tracking-tight leading-tight">
          Connected Cloud Software <br className="hidden sm:inline" />
          <span className="text-[#f25b2a] font-bold">Built for Modern Businesses</span>
        </h1>

        {/* Short, Concise Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-[16px] sm:text-lg text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed">
          Manage inventory, invoicing, HR, forms, and customer support in one connected platform.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="default"
            onClick={handleGetStarted}
            className="w-full sm:w-auto bg-[#f25b2a] hover:bg-[#d84b1b] text-white rounded-[8px] text-[16px] font-medium px-7 h-11 shadow-none gap-2 border-none"
          >
            <span>Get Started Free</span>
            <FaArrowRight className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="outline"
            size="default"
            onClick={() => {
              const el = document.getElementById("apps-grid");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto rounded-[8px] border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-[16px] font-medium px-6 h-11 shadow-none hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            Explore Apps
          </Button>
        </div>

        {/* Trust Points */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[16px] text-zinc-500 dark:text-zinc-400 font-normal">
          <span className="flex items-center gap-1.5">
            <FaCheck className="h-3.5 w-3.5 text-[#f25b2a]" /> No credit card required
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="flex items-center gap-1.5">
            <FaCheck className="h-3.5 w-3.5 text-[#f25b2a]" /> 14-day free trial
          </span>
        </div>

        {/* Category Pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-[8px] px-3.5 py-1.5 text-[16px] font-medium transition-all shadow-none cursor-pointer border ${
                selectedCategory === cat.id
                  ? "bg-[#f25b2a] text-white border-[#f25b2a]"
                  : "bg-zinc-100/80 text-zinc-700 border-zinc-200 hover:bg-zinc-200/60 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Connected Apps Grid */}
        <div id="apps-grid" className="mt-10 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Left AI Spotlight Banner Card */}
            <div className="lg:col-span-4 rounded-[8px] border border-[#f25b2a]/20 bg-gradient-to-b from-[#fff6f0] to-white dark:from-zinc-900 dark:to-zinc-950 p-6 flex flex-col justify-between shadow-none">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#f25b2a]/10 px-2.5 py-1 text-[16px] font-semibold text-[#f25b2a] mb-4">
                  <FaRobot className="h-4 w-4" />
                  <span>AI AUTOMATION</span>
                </div>

                <h3 className="text-2xl font-semibold text-zinc-900 dark:text-white mb-2">
                  Sara AI Studio
                </h3>

                <p className="text-[16px] text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed mb-6">
                  Intelligent AI automation designed to assist inventory control, invoicing, HR tasks, and customer support tickets.
                </p>
              </div>

              <Button
                onClick={handleSaraAIModal}
                className="w-full bg-[#f25b2a] hover:bg-[#d84b1b] text-white font-medium rounded-[8px] text-[16px] h-10 justify-between shadow-none border-none"
              >
                <span>Learn About Sara AI</span>
                <FaArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Right Connected Products Cards Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="group rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 flex flex-col justify-between hover:border-[#f25b2a]/50 transition-colors shadow-none"
                >
                  <div>
                    <div className="p-2.5 w-fit rounded-[8px] bg-[#fff6f0] dark:bg-zinc-800 mb-3">
                      {app.icon}
                    </div>

                    <h4 className="text-lg font-semibold text-zinc-900 dark:text-white group-hover:text-[#f25b2a] transition-colors">
                      {app.name}
                    </h4>

                    <p className="text-[16px] text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed mt-1.5 mb-4">
                      {app.description}
                    </p>
                  </div>

                  <Link
                    href={app.href}
                    className="inline-flex items-center gap-1.5 text-[16px] font-medium text-[#f25b2a] hover:text-[#d84b1b] transition-colors pt-3 border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <span>View Product</span>
                    <FaArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
