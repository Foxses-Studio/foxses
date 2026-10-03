"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { PRODUCT_META, PRODUCT_ORDER } from "./shared";
import { EASE, gsap, MQ, useGsap } from "@/lib/motion";

// Section 15 — footer. Every link points somewhere that exists today:
// sections on this page or the public Foxses Pay package. Add product,
// legal and social URLs here as those pages go live — nothing renders
// without a real destination.

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const FOOTER_NAV: { title: string; links: FooterLink[] }[] = [
  {
    title: "Products",
    links: PRODUCT_ORDER.map((p) => ({ label: PRODUCT_META[p].name, href: "#products" })),
  },
  {
    title: "Solutions",
    links: [
      { label: "Business Owners", href: "#teams" },
      { label: "Operations", href: "#teams" },
      { label: "Finance", href: "#teams" },
      { label: "HR & People", href: "#teams" },
      { label: "Customer Support", href: "#teams" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Resources", href: "#resources" },
      { label: "Foxses Pay on npm", href: "https://www.npmjs.com/package/@foxses/pay", external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Why Foxses", href: "#why" },
      { label: "Security", href: "#security" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
];

/** Add only real pages, e.g. { label: "Privacy Policy", href: "/privacy" } */
const LEGAL_LINKS: FooterLink[] = [];
/** Add only real profiles, e.g. { label: "LinkedIn", href: "https://…" } */
const SOCIAL_LINKS: FooterLink[] = [];

function FooterAnchor({ link }: { link: FooterLink }) {
  return (
    <a
      href={link.href}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group inline-flex items-center gap-1.5 rounded-[4px] text-[16px] text-zinc-700 transition-colors duration-200 hover:text-[#f25b2a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a] dark:text-zinc-300"
    >
      {link.label}
      {link.external && (
        <span aria-hidden="true" className="text-zinc-400 transition-transform group-hover:translate-x-0.5">
          ↗
        </span>
      )}
      {link.external && <span className="sr-only">(opens in a new tab)</span>}
    </a>
  );
}

export default function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>("Products");
  const year = new Date().getFullYear();

  useGsap(ref, (mm) => {
    mm.add(MQ.motion, () => {
      // Starts as soon as the footer's top edge appears, so it can never stay hidden
      gsap.from("[data-footer-nav] > *", {
        autoAlpha: 0,
        y: 18,
        duration: 0.8,
        ease: EASE,
        stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: "top bottom-=60", toggleActions: "play none none none" },
      });
      // The wordmark settles into place once the footer is well in view
      gsap.from("[data-footer-mark]", {
        autoAlpha: 0,
        y: 48,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 65%", toggleActions: "play none none none" },
      });
    });
  });

  return (
    <footer ref={ref} className="w-full bg-[#f4f4f1] text-zinc-900 dark:bg-[#0b0b0d] dark:text-white">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <div className="lg:border-x lg:border-zinc-200/70 lg:px-10 xl:px-14 dark:lg:border-zinc-800/70">
          {/* Level 1 — brand + navigation */}
          <div data-footer-nav className="grid grid-cols-1 gap-12 pt-20 pb-14 lg:grid-cols-[minmax(0,32fr)_minmax(0,68fr)] lg:pt-24">
            <div>
              <Image src="/all-logo/foxses-full-logo-for-light-them.png" alt="Foxses" width={150} height={40} className="h-11 w-auto dark:hidden" />
              <Image src="/all-logo/foxses-full-logo-for-dark-them.png" alt="Foxses" width={150} height={40} className="hidden h-11 w-auto dark:block" />
              <p className="mt-6 max-w-[300px] text-lg leading-snug text-zinc-600 dark:text-zinc-400">
                Business software, connected in one place.
              </p>
            </div>

            <nav aria-label="Footer">
              {/* Desktop / tablet columns */}
              <div className="hidden grid-cols-2 gap-x-8 gap-y-12 sm:grid lg:grid-cols-4">
                {FOOTER_NAV.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-[16px] font-medium uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">{group.title}</h3>
                    <ul className="mt-5 space-y-3">
                      {group.links.map((l) => (
                        <li key={l.label}>
                          <FooterAnchor link={l} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Mobile accordions */}
              <div className="border-t border-zinc-200 dark:border-zinc-800 sm:hidden">
                {FOOTER_NAV.map((group) => {
                  const isOpen = open === group.title;
                  const panelId = `footer-${group.title.toLowerCase()}`;
                  return (
                    <div key={group.title} className="border-b border-zinc-200 dark:border-zinc-800">
                      <h3>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => setOpen(isOpen ? null : group.title)}
                          className="flex w-full items-center justify-between py-4 text-left text-[16px] font-medium uppercase tracking-[0.12em] text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#f25b2a] dark:text-zinc-300"
                        >
                          {group.title}
                          {isOpen ? <Minus className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                        </button>
                      </h3>
                      <div
                        id={panelId}
                        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <ul className="space-y-3 overflow-hidden" inert={!isOpen}>
                          {group.links.map((l, i) => (
                            <li key={l.label} className={i === group.links.length - 1 ? "pb-5" : ""}>
                              <FooterAnchor link={l} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Level 2 — utility */}
          <div className="flex flex-col gap-4 border-t border-zinc-200 py-6 text-[16px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
            <p suppressHydrationWarning>© {year} Foxses Studio</p>
            {(LEGAL_LINKS.length > 0 || SOCIAL_LINKS.length > 0) && (
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {[...LEGAL_LINKS, ...SOCIAL_LINKS].map((l) => (
                  <li key={l.label}>
                    <FooterAnchor link={l} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Level 3 — signature */}
          <div aria-hidden="true" className="relative overflow-hidden border-t border-zinc-200 pt-8 dark:border-zinc-800">
            <p
              data-footer-mark
              className="select-none pb-6 text-center text-[22vw] font-bold leading-[0.9] tracking-[-0.04em] text-zinc-900/[0.06] lg:text-[17vw] min-[1600px]:text-[260px] dark:text-white/[0.05]"
            >
              FOXSES
              <span className="ml-[0.04em] inline-block h-[0.12em] w-[0.12em] rounded-full bg-[#f25b2a]/80 align-baseline" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
