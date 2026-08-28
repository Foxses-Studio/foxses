"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  FaChevronDown,
  FaBars,
  FaXmark,
  FaCloud,
  FaWpforms,
  FaFileInvoiceDollar,
  FaBoxesPacking,
  FaCartShopping,
  FaArrowRight,
  FaBuilding,
  FaUserTie,
  FaHeadset,
  FaLayerGroup,
  FaStore,
  FaBriefcase,
  FaGears,
  FaBook,
  FaCircleQuestion,
  FaNewspaper,
  FaBuildingUser,
  FaEnvelope,
  FaUsersGear,
  FaBullhorn,
  FaShieldHalved,
  FaCode,
  FaRobot,
  FaEnvelopeOpenText,
  FaChess,
  FaBookBookmark,
  FaCrown,
  FaGlobe,
  FaAward,
  FaStar,
  FaHandshake,
  FaLocationDot,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import gsap from "gsap";

export interface DropdownItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

export interface DropdownColumn {
  title: string;
  items: DropdownItem[];
}

export interface MenuItem {
  label: string;
  href: string;
  hasDropdown?: boolean;
  megaMenu?: DropdownColumn[];
  active?: boolean;
}

export interface NavbarProps {
  logoSrc?: string;
  logoAlt?: string;
  logoHref?: string;
  menuItems?: MenuItem[];
  onLoginClick?: () => void;
  onGetStartedClick?: () => void;
}

export const defaultProductsMegaMenu: DropdownColumn[] = [
  {
    title: "CORE PRODUCTS",
    items: [
      {
        icon: <FaBoxesPacking className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Foxses Inventory",
        description: "Real-time stock management & inventory tracking",
        href: "/products/inventory",
      },
      {
        icon: <FaFileInvoiceDollar className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Foxses Invoice",
        description: "Automated billing, invoicing & payment tracking",
        href: "/products/invoice",
      },
      {
        icon: <FaLayerGroup className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Foxses Templates",
        description: "Premium responsive web & app design templates",
        href: "/products/templates",
      },
    ],
  },
  {
    title: "FORMS & HR",
    items: [
      {
        icon: <FaWpforms className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Cloud Forms",
        description: "Smart form builder & data collection platform",
        href: "/products/cloud-forms",
      },
      {
        icon: <FaUsersGear className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Foxses HR",
        description: "Human resources, attendance, payroll & employee management",
        href: "/products/foxses-hr",
      },
    ],
  },
  {
    title: "OTHER PRODUCTS",
    items: [
      {
        icon: <FaCartShopping className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "F-Commerce",
        description: "Facebook commerce & social store automation solution",
        href: "/products/f-commerce",
      },
      {
        icon: <FaHeadset className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Web Support System",
        description: "Customer support & help desk ticketing system",
        href: "/products/web-support-system",
      },
    ],
  },
];

export const defaultSolutionsMegaMenu: DropdownColumn[] = [
  {
    title: "BUSINESS TYPES",
    items: [
      {
        icon: <FaBuilding className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Small Businesses",
        description: "Tailored management platform for small businesses",
        href: "/solutions/small-businesses",
      },
      {
        icon: <FaCartShopping className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Retail & E-commerce",
        description: "Online & offline retail store management solutions",
        href: "/solutions/retail-ecommerce",
      },
    ],
  },
  {
    title: "OPERATIONS & SERVICES",
    items: [
      {
        icon: <FaBriefcase className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Service Businesses",
        description: "Workflow automation for service providers & agencies",
        href: "/solutions/service-businesses",
      },
      {
        icon: <FaGears className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Business Operations",
        description: "Streamline daily operational & management workflows",
        href: "/solutions/business-operations",
      },
    ],
  },
];

export const defaultResourcesMegaMenu: DropdownColumn[] = [
  {
    title: "LEARN",
    items: [
      {
        icon: <FaBullhorn className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Announcements Hub",
        description: "Latest product updates, news & announcements",
        href: "/resources/announcements",
      },
      {
        icon: <FaShieldHalved className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Security Solutions",
        description: "Data protection, privacy & security guidelines",
        href: "/resources/security",
      },
      {
        icon: <FaCode className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Developer Center",
        description: "SDKs, REST APIs & developer documentation",
        href: "/resources/developer-center",
      },
      {
        icon: <FaNewspaper className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Blog",
        description: "Articles, tech insights & industry stories",
        href: "/resources/blog",
      },
    ],
  },
  {
    title: "EXPLORE",
    items: [
      {
        icon: <FaRobot className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Sara AI",
        description: "Foxses AI assistant & intelligent business automation",
        href: "/resources/sara-ai",
      },
      {
        icon: <FaEnvelopeOpenText className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Newsletter",
        description: "Weekly tech, product & strategy digest",
        href: "/resources/newsletter",
      },
      {
        icon: <FaChess className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "The Long Game",
        description: "Long-term business growth & strategy insights",
        href: "/resources/long-game",
      },
    ],
  },
  {
    title: "SUPPORT",
    items: [
      {
        icon: <FaBookBookmark className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Knowledge Base",
        description: "Articles, FAQs & step-by-step troubleshooting",
        href: "/resources/knowledge-base",
      },
      {
        icon: <FaCrown className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Concierge",
        description: "Dedicated VIP & premium customer assistance",
        href: "/resources/concierge",
      },
      {
        icon: <FaEnvelope className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Contact Us",
        description: "Get in touch with our support & sales team",
        href: "/resources/contact",
      },
    ],
  },
];

export const defaultCompanyMegaMenu: DropdownColumn[] = [
  {
    title: "ABOUT COMPANY",
    items: [
      {
        icon: <FaBuildingUser className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "About Foxses Studio",
        description: "Learn about our mission, vision & leadership team",
        href: "/company/about",
      },
      {
        icon: <FaGlobe className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Our Story & Impact",
        description: "Discover our journey, values & global business impact",
        href: "/company/story",
      },
      {
        icon: <FaUserTie className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Careers",
        description: "Join the Foxses Studio team and grow with us",
        href: "/company/careers",
      },
    ],
  },
  {
    title: "SUCCESS & STORIES",
    items: [
      {
        icon: <FaAward className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Case Studies",
        description: "Real-world customer success stories & enterprise results",
        href: "/company/case-studies",
      },
      {
        icon: <FaStar className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Customer Reviews",
        description: "Testimonials and ratings from global business clients",
        href: "/company/reviews",
      },
      {
        icon: <FaBullhorn className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Press & Media",
        description: "Newsroom, press releases & brand media assets",
        href: "/company/press",
      },
    ],
  },
  {
    title: "CONNECT & NETWORK",
    items: [
      {
        icon: <FaEnvelope className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Contact Us",
        description: "Get in touch with our support & enterprise sales team",
        href: "/company/contact",
      },
      {
        icon: <FaHandshake className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Partners Program",
        description: "Become a Foxses reseller, affiliate or integration partner",
        href: "/company/partners",
      },
      {
        icon: <FaLocationDot className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />,
        title: "Office Locations",
        description: "Find our global office hubs and contact addresses",
        href: "/company/locations",
      },
    ],
  },
];

const defaultMenuItems: MenuItem[] = [
  {
    label: "Products",
    href: "/products",
    hasDropdown: true,
    megaMenu: defaultProductsMegaMenu,
  },
  {
    label: "Solutions",
    href: "/solutions",
    hasDropdown: true,
    megaMenu: defaultSolutionsMegaMenu,
  },
  { label: "Pricing", href: "/pricing", hasDropdown: false },
  {
    label: "Resources",
    href: "/resources",
    hasDropdown: true,
    megaMenu: defaultResourcesMegaMenu,
  },
  {
    label: "Company",
    href: "/company",
    hasDropdown: true,
    megaMenu: defaultCompanyMegaMenu,
  },
];

export default function Navbar({
  logoSrc = "/all-logo/foxses-full-logo.png",
  logoAlt = "Foxses Logo",
  logoHref = "/",
  menuItems = defaultMenuItems,
  onLoginClick,
  onGetStartedClick,
}: NavbarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const sidebarRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidebarOpen && sidebarRef.current && backdropRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );

      gsap.fromTo(
        sidebarRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.4, ease: "power3.out" }
      );

      gsap.fromTo(
        ".gsap-sidebar-item",
        { opacity: 0, x: 25 },
        {
          opacity: 1,
          x: 0,
          duration: 0.35,
          stagger: 0.04,
          ease: "power2.out",
          delay: 0.1,
        }
      );
    }
  }, [sidebarOpen]);

  const closeSidebar = (callback?: () => void) => {
    if (sidebarRef.current && backdropRef.current) {
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
      });

      gsap.to(sidebarRef.current, {
        x: "100%",
        duration: 0.35,
        ease: "power3.in",
        onComplete: () => {
          setSidebarOpen(false);
          callback?.();
        },
      });
    } else {
      setSidebarOpen(false);
      callback?.();
    }
  };

  const toggleDropdown = (label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleLogin = () => {
    closeSidebar(() => {
      if (onLoginClick) {
        onLoginClick();
      } else {
        Swal.fire({
          title: "Login",
          text: "Log in to your Foxses account.",
          icon: "info",
          confirmButtonText: "Continue",
          confirmButtonColor: "#0d0d0d",
        });
      }
    });
  };

  const handleGetStarted = () => {
    closeSidebar(() => {
      if (onGetStartedClick) {
        onGetStartedClick();
      } else {
        Swal.fire({
          title: "Get Started Free",
          text: "Start your free trial today. No credit card required.",
          icon: "success",
          confirmButtonText: "Create Account",
          confirmButtonColor: "#0d0d0d",
        });
      }
    });
  };

  const getMegaMenuData = (item: MenuItem): DropdownColumn[] => {
    if (item.megaMenu) return item.megaMenu;
    if (item.label === "Products") return defaultProductsMegaMenu;
    if (item.label === "Solutions") return defaultSolutionsMegaMenu;
    if (item.label === "Resources") return defaultResourcesMegaMenu;
    if (item.label === "Company") return defaultCompanyMegaMenu;
    return defaultProductsMegaMenu;
  };

  return (
    <>
      <header className="relative sticky top-0 z-40 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800 shadow-none transition-all">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-8 lg:px-12">
          
          {/* Left Side: Logo */}
          <div className="flex items-center">
            <Link href={logoHref} className="flex items-center gap-2 group">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={240}
                height={60}
                className="h-12 sm:h-[58px] w-auto object-contain transition-all"
                priority
              />
            </Link>
          </div>

          {/* Middle: Desktop Navigation Menu */}
          <nav className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-8">
            {menuItems.map((item, index) =>
              item.hasDropdown ? (
                <div key={`${item.label}-${index}`} className="group py-2">
                  <div className="inline-flex items-center gap-1.5 text-[16px] font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors cursor-pointer">
                    <span>{item.label}</span>
                    <FaChevronDown className="h-3 w-3 text-zinc-600 dark:text-zinc-400 transition-transform duration-300 group-hover:rotate-180" />
                  </div>

                  {/* Mega Menu Container */}
                  <div className="absolute left-0 right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out w-full z-50">
                    <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[8px] p-6 sm:p-8 shadow-none grid grid-cols-2 lg:grid-cols-3 divide-x divide-zinc-200 dark:divide-zinc-800">
                        
                        {/* Columns rendering */}
                        {getMegaMenuData(item).map((column, colIdx) => (
                          <div key={`col-${colIdx}`} className={`${colIdx > 0 ? "pl-6" : "pr-4"}`}>
                            <h4 className="text-[16px] font-semibold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase mb-4">
                              {column.title}
                            </h4>

                            <div className="flex flex-col space-y-4">
                              {column.items.map((subItem, itemIdx) => (
                                <Link
                                  key={`sub-${itemIdx}`}
                                  href={subItem.href}
                                  className="group/item flex items-start gap-3.5 p-2.5 rounded-[8px] hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 transition-colors"
                                >
                                  <div className="p-2 rounded-[8px] bg-zinc-100 dark:bg-zinc-800 group-hover/item:bg-white dark:group-hover/item:bg-zinc-700 transition-colors flex-shrink-0">
                                    {subItem.icon}
                                  </div>
                                  <div className="flex flex-col text-left">
                                    <span className="text-[16px] font-medium text-zinc-900 dark:text-white group-hover/item:text-orange-600 dark:group-hover/item:text-orange-400 transition-colors">
                                      {subItem.title}
                                    </span>
                                    <span className="text-[16px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">
                                      {subItem.description}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>

                            {/* Extra View All link on last column if applicable */}
                            {colIdx === getMegaMenuData(item).length - 1 && (
                              <div className="mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                                <Link
                                  href={item.href}
                                  className="inline-flex items-center gap-2 text-[16px] font-medium text-zinc-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                                >
                                  <span>View all {item.label}</span>
                                  <FaArrowRight className="h-3.5 w-3.5" />
                                </Link>
                              </div>
                            )}
                          </div>
                        ))}

                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={`${item.label}-${index}`}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-[16px] font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors py-2"
                >
                  <span>{item.label}</span>
                </Link>
              )
            )}
          </nav>

          {/* Right Side: Desktop Buttons + Mobile Login & Right Sidebar Hamburger Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleLogin}
              className="text-[16px] font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors px-2 py-1"
            >
              Login
            </button>

            <div className="hidden md:flex items-center gap-3 xl:gap-4">
              <Button
                variant="default"
                size="default"
                onClick={handleGetStarted}
                className="bg-[#0d0d0d] hover:bg-zinc-800 text-white rounded-[8px] text-[16px] font-medium shadow-none px-5 py-2 h-10"
              >
                Get Started Free
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Right Sidebar Menu"
              className="text-zinc-900 dark:text-zinc-100 rounded-[8px] shadow-none h-11 w-11 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
            >
              <FaBars className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* GSAP Animated Right-Side Slide-Over Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          <div
            ref={backdropRef}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => closeSidebar()}
          />

          <aside
            ref={sidebarRef}
            className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] bg-white dark:bg-zinc-950 h-full flex flex-col justify-between p-6 border-l border-zinc-200 dark:border-zinc-800 shadow-none overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 gsap-sidebar-item">
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={200}
                  height={50}
                  className="h-12 w-auto object-contain"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => closeSidebar()}
                  className="rounded-[8px] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  <FaXmark className="h-6 w-6" />
                </Button>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="py-6 flex flex-col space-y-2">
                {menuItems.map((item, index) => (
                  <div key={`sidebar-${item.label}-${index}`} className="gsap-sidebar-item">
                    {item.hasDropdown ? (
                      <>
                        <button
                          type="button"
                          onClick={() => toggleDropdown(item.label)}
                          className="w-full flex items-center justify-between rounded-[8px] px-4 py-3 text-[16px] font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors text-left"
                        >
                          <span>{item.label}</span>
                          <FaChevronDown
                            className={`h-4 w-4 text-zinc-500 transition-transform ${
                              expandedItems[item.label] ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Expandable Mobile Submenu */}
                        {expandedItems[item.label] && (
                          <div className="ml-4 pl-3 border-l border-zinc-200 dark:border-zinc-800 py-2 space-y-3 my-1">
                            {getMegaMenuData(item).map((column, colIdx) => (
                              <div key={`mob-col-${colIdx}`} className="flex flex-col space-y-2">
                                <span className="text-[16px] font-semibold text-zinc-400 uppercase tracking-wider">
                                  {column.title}
                                </span>
                                {column.items.map((subItem, itemIdx) => (
                                  <Link
                                    key={`mob-sub-${itemIdx}`}
                                    href={subItem.href}
                                    onClick={() => closeSidebar()}
                                    className="flex items-start gap-2.5 p-2 rounded-[8px] hover:bg-zinc-100 dark:hover:bg-zinc-900"
                                  >
                                    <div className="p-1.5 rounded-[8px] bg-zinc-100 dark:bg-zinc-800">
                                      {subItem.icon}
                                    </div>
                                    <div className="flex flex-col text-left">
                                      <span className="text-[16px] font-medium text-zinc-900 dark:text-white">
                                        {subItem.title}
                                      </span>
                                      <span className="text-[16px] text-zinc-500 dark:text-zinc-400">
                                        {subItem.description}
                                      </span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => closeSidebar()}
                        className="block rounded-[8px] px-4 py-3 text-[16px] font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Sidebar Bottom Action Buttons */}
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col space-y-3 gsap-sidebar-item">
              <button
                onClick={handleLogin}
                className="w-full py-3 text-center text-[16px] font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 transition-colors"
              >
                Login
              </button>

              <Button
                variant="default"
                onClick={handleGetStarted}
                className="w-full justify-center rounded-[8px] bg-[#0d0d0d] text-white text-[16px] font-medium shadow-none py-3"
              >
                Get Started Free
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
