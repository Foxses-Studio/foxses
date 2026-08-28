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
  FaAngleRight,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";

interface ProductCategory {
  id: string;
  name: string;
}

const categories: ProductCategory[] = [
  { id: "all", name: "All Suite" },
  { id: "inventory", name: "Inventory & Stock" },
  { id: "invoice", name: "Invoice & Finance" },
  { id: "hr", name: "HR & Team" },
  { id: "forms", name: "Forms & Data" },
  { id: "support", name: "Helpdesk Support" },
];

interface ProductApp {
  id: string;
  categoryId: string;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  href: string;
}

const foxsesApps: ProductApp[] = [
  {
    id: "inventory",
    categoryId: "inventory",
    name: "Foxses Inventory",
    subtitle: "Stock & Warehouse",
    description: "Real-time stock tracking, multi-location inventory & automated reorder alerts.",
    icon: <FaBoxesPacking className="h-6 w-6 text-zinc-900 dark:text-white" />,
    badge: "Core App",
    href: "/products/inventory",
  },
  {
    id: "invoice",
    categoryId: "invoice",
    name: "Foxses Invoice",
    subtitle: "Billing & Accounting",
    description: "Automated billing, professional invoicing, tax tracking & payment reminders.",
    icon: <FaFileInvoiceDollar className="h-6 w-6 text-zinc-900 dark:text-white" />,
    badge: "Finance",
    href: "/products/invoice",
  },
  {
    id: "hr",
    categoryId: "hr",
    name: "Foxses HR",
    subtitle: "Employee & Payroll",
    description: "Attendance logging, payroll processing, leave management & team analytics.",
    icon: <FaUsersGear className="h-6 w-6 text-zinc-900 dark:text-white" />,
    badge: "People",
    href: "/products/foxses-hr",
  },
  {
    id: "forms",
    categoryId: "forms",
    name: "Cloud Forms",
    subtitle: "Form Builder & Surveys",
    description: "Drag-and-drop form creation, responses collection & data organization.",
    icon: <FaWpforms className="h-6 w-6 text-zinc-900 dark:text-white" />,
    badge: "Cloud Tool",
    href: "/products/cloud-forms",
  },
  {
    id: "support",
    categoryId: "support",
    name: "Support System",
    subtitle: "Helpdesk & Ticketing",
    description: "Customer ticket tracking, live agent desk & support workflow automation.",
    icon: <FaHeadset className="h-6 w-6 text-zinc-900 dark:text-white" />,
    badge: "Customer Success",
    href: "/products/web-support-system",
  },
  {
    id: "templates",
    categoryId: "all",
    name: "Foxses Templates",
    subtitle: "Business & Web Assets",
    description: "Ready-to-use business documents, web layouts & productivity templates.",
    icon: <FaLayerGroup className="h-6 w-6 text-zinc-900 dark:text-white" />,
    badge: "Productivity",
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
      title: "Welcome to Foxses Studio",
      text: "Start your free 14-day trial and connect all your business tools today.",
      icon: "success",
      confirmButtonText: "Create Free Account",
      confirmButtonColor: "#0d0d0d",
      customClass: {
        popup: "rounded-[8px] shadow-none",
      },
    });
  };

  const handleSaraAIModal = () => {
    Swal.fire({
      title: "Sara AI Agent Studio",
      text: "Meet Sara AI — your intelligent assistant designed to automate workflows across Foxses Inventory, Invoice, HR, Forms & Support System.",
      icon: "info",
      confirmButtonText: "Explore Sara AI",
      confirmButtonColor: "#0d0d0d",
      customClass: {
        popup: "rounded-[8px] shadow-none",
      },
    });
  };

  return (
    <section className="relative overflow-hidden bg-white dark:bg-zinc-950 pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-zinc-200/80 dark:border-zinc-800">
      
      {/* Background Subtle Gradient & Grid Patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] pointer-events-none" />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 text-center">
        
        {/* Top Feature Announcement Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 px-4 py-1.5 text-[16px] text-zinc-900 dark:text-zinc-200 transition-all hover:border-zinc-400 dark:hover:border-zinc-700 mb-8 cursor-pointer shadow-none" onClick={handleSaraAIModal}>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold flex items-center gap-1.5">
            <FaWandMagicSparkles className="h-4 w-4 text-orange-500" />
            Introducing Sara AI Agent Studio
          </span>
          <span className="text-zinc-400 dark:text-zinc-500">|</span>
          <span className="text-zinc-600 dark:text-zinc-400 font-normal">Next-Gen Connected Apps</span>
          <FaAngleRight className="h-3.5 w-3.5 text-zinc-500" />
        </div>

        {/* Main Headline */}
        <h1 className="mx-auto max-w-5xl text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl lg:text-7xl leading-[1.15]">
          Your whole business operations, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-white bg-clip-text text-transparent">
            connected in one unified platform
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-3xl text-[16px] sm:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
          Foxses Studio builds simple, practical, and connected cloud software to run your inventory, invoicing, HR, forms, and customer support—all working seamlessly together.
        </p>

        {/* Category Filter Pills (Monday.com style) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-[8px] px-4 py-2 text-[16px] font-medium transition-all shadow-none cursor-pointer border ${
                selectedCategory === cat.id
                  ? "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white"
                  : "bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="w-full sm:w-auto bg-[#0d0d0d] hover:bg-zinc-800 text-white rounded-[8px] text-[16px] font-semibold px-8 h-12 shadow-none gap-2"
          >
            <span>Get Started For Free</span>
            <FaArrowRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const el = document.getElementById("featured-apps-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto rounded-[8px] border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white text-[16px] font-medium px-8 h-12 shadow-none"
          >
            Explore All Products
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[16px] text-zinc-500 dark:text-zinc-400 font-medium">
          <span className="flex items-center gap-2">
            <FaCheck className="h-4 w-4 text-emerald-600" />
            No credit card needed
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="flex items-center gap-2">
            <FaCheck className="h-4 w-4 text-emerald-600" />
            Free 14-day trial
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="flex items-center gap-2">
            <FaCheck className="h-4 w-4 text-emerald-600" />
            Instant cloud setup
          </span>
        </div>

        {/* Featured Apps & AI Spotlight Grid (Zoho / Salesforce Style) */}
        <div id="featured-apps-section" className="mt-14 sm:mt-16 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left AI Spotlight Banner Card (Zia / Sara AI Card) */}
            <div className="lg:col-span-4 rounded-[8px] bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-8 text-white flex flex-col justify-between border border-zinc-800 shadow-none relative overflow-hidden group">
              
              {/* Decorative Glow */}
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-orange-600/20 blur-3xl group-hover:bg-orange-500/30 transition-all" />
              
              <div>
                <div className="inline-flex items-center gap-2 rounded-[8px] bg-white/10 px-3 py-1 text-[16px] font-medium text-orange-400 border border-white/10 mb-6">
                  <FaRobot className="h-4 w-4" />
                  <span>INTELLIGENT AI</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                  Introducing <br />
                  <span className="text-orange-400">Sara AI Agent Studio</span>
                </h3>

                <p className="text-[16px] text-zinc-300 leading-relaxed font-normal mb-6">
                  Deploy autonomous AI agents that analyze inventory, generate automated invoices, streamline HR workflows, and respond to support tickets automatically.
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                <Button
                  onClick={handleSaraAIModal}
                  className="w-full bg-white text-zinc-950 hover:bg-zinc-100 font-semibold rounded-[8px] text-[16px] h-11 justify-between shadow-none"
                >
                  <span>Explore Sara AI</span>
                  <FaArrowRight className="h-4 w-4" />
                </Button>
                <span className="text-[16px] text-zinc-400 text-center">Connected across all Foxses apps</span>
              </div>
            </div>

            {/* Right Connected Products Cards Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="group rounded-[8px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 flex flex-col justify-between hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-none"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-[8px] bg-zinc-100 dark:bg-zinc-800 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                        {app.icon}
                      </div>
                      <span className="text-[16px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                        {app.badge}
                      </span>
                    </div>

                    <h4 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {app.name}
                    </h4>
                    <span className="text-[16px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-2">
                      {app.subtitle}
                    </span>

                    <p className="text-[16px] text-zinc-600 dark:text-zinc-300 font-normal leading-relaxed mb-6">
                      {app.description}
                    </p>
                  </div>

                  <Link
                    href={app.href}
                    className="inline-flex items-center gap-2 text-[16px] font-semibold text-zinc-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors pt-3 border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <span>Explore Product</span>
                    <FaArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Stats & Trust Bar */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">10,000+</span>
            <span className="text-[16px] font-normal text-zinc-500 dark:text-zinc-400 mt-1">Growing Businesses</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">99.9%</span>
            <span className="text-[16px] font-normal text-zinc-500 dark:text-zinc-400 mt-1">Cloud Uptime</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">6+</span>
            <span className="text-[16px] font-normal text-zinc-500 dark:text-zinc-400 mt-1">Connected Products</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">24/7</span>
            <span className="text-[16px] font-normal text-zinc-500 dark:text-zinc-400 mt-1">Dedicated Support</span>
          </div>
        </div>

      </div>
    </section>
  );
}
