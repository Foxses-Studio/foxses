"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, Minus, Plus, X } from "lucide-react";
import gsap from "gsap";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  defaultMenuItems,
  LOGIN_HREF,
  MENU_BY_LABEL,
  SIGNUP_HREF,
  type DropdownColumn,
  type MenuItem,
} from "@/components/nav/nav-data";

export type { DropdownColumn, DropdownItem, MenuItem } from "@/components/nav/nav-data";

export interface NavbarProps {
  lightLogoSrc?: string;
  darkLogoSrc?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoHref?: string;
  menuItems?: MenuItem[];
  onLoginClick?: () => void;
  onGetStartedClick?: () => void;
}

const CLOSE_DELAY_MS = 120;
const slug = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const columnsFor = (item: MenuItem): DropdownColumn[] => item.megaMenu ?? MENU_BY_LABEL[item.label] ?? [];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a]";

export default function Navbar({
  lightLogoSrc = "/all-logo/foxses-full-logo-for-light-them.png",
  darkLogoSrc = "/all-logo/foxses-full-logo-for-dark-them.png",
  logoSrc = "/all-logo/foxses-full-logo.png",
  logoAlt = "Foxses",
  logoHref = "/",
  menuItems = defaultMenuItems,
  onLoginClick,
  onGetStartedClick,
}: NavbarProps) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const openMenuRef = useRef<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const sidebarRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /* ---------- Desktop dropdowns ---------- */

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  // When a hover has just opened a menu, the click that follows shouldn't close it
  const openedAt = useRef(0);
  // A menu opened by click (or keyboard) stays open when the pointer leaves
  const pinned = useRef(false);
  const focusFirstIn = useRef<string | null>(null);
  const openNow = (label: string, at: number) => {
    cancelClose();
    if (openMenuRef.current !== label) openedAt.current = at;
    setOpenMenu(label);
  };
  const closeSoon = () => {
    if (pinned.current) return;
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY_MS);
  };
  const closeMenu = useCallback((refocus = false) => {
    const current = openMenuRef.current;
    pinned.current = false;
    setOpenMenu(null);
    if (refocus && current) triggerRefs.current[current]?.focus();
  }, []);

  // Escape and outside clicks close an open dropdown
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu(true);
    };
    const onDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [openMenu, closeMenu]);

  useEffect(() => () => cancelClose(), []);

  // Keep a ref of the open menu for event handlers; move focus in after ArrowDown
  useEffect(() => {
    openMenuRef.current = openMenu;
    if (!openMenu) pinned.current = false;
    if (openMenu && focusFirstIn.current === openMenu) {
      focusFirstIn.current = null;
      document.getElementById(`nav-menu-${slug(openMenu)}`)?.querySelector<HTMLElement>("a")?.focus();
    }
  }, [openMenu]);

  // Slightly more compact, with a visible edge, once the page has scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- Mobile drawer ---------- */

  useEffect(() => {
    if (!sidebarOpen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && sidebarRef.current && backdropRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.fromTo(sidebarRef.current, { x: "100%" }, { x: "0%", duration: 0.35, ease: "power3.out" });
    }
    closeButtonRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [sidebarOpen]);

  const closeSidebar = useCallback((after?: () => void) => {
    const done = () => {
      setSidebarOpen(false);
      setExpanded(null);
      menuButtonRef.current?.focus();
      after?.();
    };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !sidebarRef.current || !backdropRef.current) return done();
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.2, ease: "power2.in" });
    gsap.to(sidebarRef.current, { x: "100%", duration: 0.3, ease: "power3.in", onComplete: done });
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [sidebarOpen, closeSidebar]);

  /* ---------- Account actions ---------- */

  const accountAction = (kind: "login" | "signup", className: string, children: React.ReactNode, inDrawer = false) => {
    const handler = kind === "login" ? onLoginClick : onGetStartedClick;
    if (handler) {
      return (
        <button type="button" onClick={() => (inDrawer ? closeSidebar(handler) : handler())} className={className}>
          {children}
        </button>
      );
    }
    return (
      <Link href={kind === "login" ? LOGIN_HREF : SIGNUP_HREF} onClick={inDrawer ? () => closeSidebar() : undefined} className={className}>
        {children}
      </Link>
    );
  };

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`));

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-[background-color,border-color] duration-300 ${
          scrolled || openMenu
            ? "border-zinc-200/80 bg-white/90 dark:border-zinc-800 dark:bg-zinc-950/90"
            : "border-transparent bg-white/75 dark:bg-zinc-950/75"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 transition-[padding] duration-300 sm:px-8 lg:px-12 ${
            scrolled ? "py-2.5" : "py-3.5"
          }`}
        >
          {/* Logo */}
          <Link href={logoHref} aria-label="Foxses home" className={`flex shrink-0 items-center rounded-[6px] ${focusRing}`}>
            <Image src={lightLogoSrc || logoSrc} alt={logoAlt} width={240} height={60} priority className="h-11 w-auto object-contain dark:hidden" />
            <Image src={darkLogoSrc || logoSrc} alt={logoAlt} width={240} height={60} priority className="hidden h-11 w-auto object-contain dark:block" />
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-2">
              {menuItems.map((item) => {
                const columns = columnsFor(item);
                const id = `nav-menu-${slug(item.label)}`;
                const open = openMenu === item.label;

                if (!item.hasDropdown || columns.length === 0) {
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={`inline-flex h-10 items-center whitespace-nowrap rounded-[8px] px-2.5 text-[16px] font-medium transition-colors xl:px-3 duration-200 hover:text-[#f25b2a] ${focusRing} ${
                          isActive(item.href) ? "text-[#f25b2a]" : "text-zinc-800 dark:text-zinc-200"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li
                    key={item.label}
                    onMouseEnter={(e) => openNow(item.label, e.timeStamp)}
                    onMouseLeave={closeSoon}
                    onBlur={(e) => {
                      // Tabbing out of an open menu closes it
                      const next = e.relatedTarget as Node | null;
                      if (openMenuRef.current === item.label && next && !e.currentTarget.contains(next)) closeMenu();
                    }}
                  >
                    <button
                      ref={(el) => {
                        triggerRefs.current[item.label] = el;
                      }}
                      type="button"
                      aria-expanded={open}
                      aria-controls={id}
                      onClick={(e) => {
                        if (!open) {
                          pinned.current = true;
                          return openNow(item.label, e.timeStamp);
                        }
                        if (e.timeStamp - openedAt.current > 400) setOpenMenu(null);
                        else pinned.current = true;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          focusFirstIn.current = item.label;
                          pinned.current = true;
                          if (open) document.getElementById(id)?.querySelector<HTMLElement>("a")?.focus();
                          else openNow(item.label, e.timeStamp);
                        }
                      }}
                      className={`inline-flex h-10 items-center gap-1 whitespace-nowrap rounded-[8px] px-2.5 text-[16px] font-medium transition-colors xl:gap-1.5 xl:px-3 duration-200 hover:text-[#f25b2a] ${focusRing} ${
                        open || isActive(item.href) ? "text-[#f25b2a]" : "text-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        strokeWidth={2}
                        className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Mega menu — same layout and styling as before */}
                    <div
                      id={id}
                      inert={!open}
                      className={`absolute left-0 right-0 top-full z-50 w-full pt-3 transition-[opacity,transform] duration-200 ease-out ${
                        open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-2 scale-[0.98] opacity-0"
                      }`}
                    >
                      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
                        <div className="grid grid-cols-2 divide-x divide-zinc-200 rounded-[8px] border border-zinc-200 bg-white p-6 shadow-none dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8 lg:grid-cols-3">
                          {columns.map((column, colIdx) => (
                            <div key={column.title} className={colIdx > 0 ? "pl-6" : "pr-4"}>
                              <h4 className="mb-4 text-[16px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                {column.title}
                              </h4>
                              <ul className="flex flex-col space-y-4">
                                {column.items.map((sub) => {
                                  const Icon = sub.icon;
                                  return (
                                    <li key={sub.title}>
                                      <Link
                                        href={sub.href}
                                        onClick={() => setOpenMenu(null)}
                                        className={`group/item flex items-start gap-3.5 rounded-[8px] p-2.5 transition-colors hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 ${focusRing}`}
                                      >
                                        <span className="flex-shrink-0 rounded-[8px] bg-zinc-100 p-2 transition-colors group-hover/item:bg-white dark:bg-zinc-800 dark:group-hover/item:bg-zinc-700">
                                          <Icon aria-hidden="true" strokeWidth={1.75} className="h-5 w-5 text-zinc-800 transition-colors group-hover/item:text-[#f25b2a] dark:text-zinc-200" />
                                        </span>
                                        <span className="flex flex-col text-left">
                                          <span className="text-[16px] font-medium text-zinc-900 transition-colors group-hover/item:text-[#f25b2a] dark:text-white">
                                            {sub.title}
                                          </span>
                                          <span className="mt-0.5 text-[16px] leading-snug text-zinc-500 dark:text-zinc-400">
                                            {sub.description}
                                          </span>
                                        </span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>

                              {colIdx === columns.length - 1 && (
                                <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                                  <Link
                                    href={item.href}
                                    onClick={() => setOpenMenu(null)}
                                    className={`group/all inline-flex items-center gap-2 rounded-[4px] text-[16px] font-medium text-zinc-900 transition-colors hover:text-[#f25b2a] dark:text-white ${focusRing}`}
                                  >
                                    View all {item.label}
                                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover/all:translate-x-0.5" />
                                  </Link>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            {accountAction(
              "login",
              `hidden h-10 items-center whitespace-nowrap rounded-[8px] px-3 text-[16px] font-medium text-zinc-800 transition-colors hover:text-[#f25b2a] dark:text-zinc-200 sm:inline-flex ${focusRing}`,
              "Log in"
            )}
            {accountAction(
              "signup",
              `group hidden h-10 items-center gap-1.5 whitespace-nowrap rounded-[8px] bg-[#f25b2a] px-4 text-[16px] font-medium text-white transition-colors hover:bg-[#d84b1b] md:inline-flex ${focusRing}`,
              <>
                Get Started
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </>
            )}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              aria-controls="mobile-menu"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] text-zinc-900 transition-colors hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800 lg:hidden ${focusRing}`}
            >
              <Menu aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div ref={backdropRef} className="fixed inset-0 bg-black/50" onClick={() => closeSidebar()} aria-hidden="true" />
          <aside
            ref={sidebarRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="relative z-10 flex h-full w-full max-w-[380px] flex-col overflow-y-auto border-l border-zinc-200 bg-white no-scrollbar dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <Link href={logoHref} onClick={() => closeSidebar()} aria-label="Foxses home" className={`rounded-[6px] ${focusRing}`}>
                <Image src={lightLogoSrc || logoSrc} alt={logoAlt} width={200} height={50} className="h-10 w-auto object-contain dark:hidden" />
                <Image src={darkLogoSrc || logoSrc} alt={logoAlt} width={200} height={50} className="hidden h-10 w-auto object-contain dark:block" />
              </Link>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={() => closeSidebar()}
                  aria-label="Close menu"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-[8px] text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 ${focusRing}`}
                >
                  <X aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
                </button>
              </div>
            </div>

            <nav aria-label="Mobile" className="flex-1 px-5 py-4">
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {menuItems.map((item) => {
                  const columns = columnsFor(item);
                  if (!item.hasDropdown || columns.length === 0) {
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={() => closeSidebar()}
                          className={`flex min-h-[52px] items-center text-[16px] font-medium text-zinc-900 transition-colors hover:text-[#f25b2a] dark:text-zinc-100 ${focusRing}`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  }
                  const open = expanded === item.label;
                  const panelId = `mobile-${slug(item.label)}`;
                  return (
                    <li key={item.label}>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        onClick={() => setExpanded(open ? null : item.label)}
                        className={`flex min-h-[52px] w-full items-center justify-between text-left text-[16px] font-medium transition-colors hover:text-[#f25b2a] ${focusRing} ${
                          open ? "text-[#f25b2a]" : "text-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        {item.label}
                        {open ? <Minus aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4 text-zinc-500" />}
                      </button>
                      <div
                        id={panelId}
                        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <ul className="overflow-hidden" inert={!open}>
                          {columns.flatMap((c) => c.items).map((sub) => {
                            const Icon = sub.icon;
                            return (
                              <li key={`${sub.title}-${sub.href}`}>
                                <Link
                                  href={sub.href}
                                  onClick={() => closeSidebar()}
                                  className={`group/sub flex min-h-[44px] items-center gap-3 rounded-[8px] px-2 py-2 text-[16px] text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-[#f25b2a] dark:text-zinc-300 dark:hover:bg-zinc-900 ${focusRing}`}
                                >
                                  <Icon aria-hidden="true" strokeWidth={1.75} className="h-[18px] w-[18px] shrink-0 text-zinc-500 group-hover/sub:text-[#f25b2a]" />
                                  {sub.title}
                                </Link>
                              </li>
                            );
                          })}
                          <li className="pb-3">
                            <Link
                              href={item.href}
                              onClick={() => closeSidebar()}
                              className={`inline-flex min-h-[44px] items-center gap-2 px-2 text-[16px] font-medium text-zinc-900 hover:text-[#f25b2a] dark:text-white ${focusRing}`}
                            >
                              View all {item.label}
                              <ArrowRight aria-hidden="true" className="h-4 w-4" />
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex flex-col gap-3 border-t border-zinc-200 px-5 py-5 dark:border-zinc-800">
              {accountAction(
                "login",
                `flex h-12 items-center justify-center rounded-[8px] border border-zinc-200 text-[16px] font-medium text-zinc-900 transition-colors hover:border-[#f25b2a]/40 hover:text-[#f25b2a] dark:border-zinc-800 dark:text-zinc-100 ${focusRing}`,
                "Log in",
                true
              )}
              {accountAction(
                "signup",
                `flex h-12 items-center justify-center gap-2 rounded-[8px] bg-[#f25b2a] text-[16px] font-medium text-white transition-colors hover:bg-[#d84b1b] ${focusRing}`,
                <>
                  Get Started
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </>,
                true
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
