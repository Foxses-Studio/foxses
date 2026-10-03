"use client";

import React, { useRef } from "react";
import { Eyebrow, Heading, ProductTag, Section, tabKeyHandler, useSwap, type ProductKey } from "./shared";
import { Badge } from "./ui-kit";
import { revealOnScroll, useGsap } from "@/lib/motion";

// Section 11 — business stories.
// There are no verified customer stories yet, so every entry is a
// `use-case`. A real customer story can be added with `type: "customer"`;
// labels, quote and person then render automatically — never for use cases.

type Fragment =
  | { kind: "stock"; title: string; value: string }
  | { kind: "invoice"; title: string; status: string }
  | { kind: "request"; title: string; from: string }
  | { kind: "form"; title: string; meta: string }
  | { kind: "team"; title: string; value: string }
  | { kind: "attendance"; title: string; ratio: number };

interface Story {
  type: "use-case" | "customer";
  category: string;
  headline: string[];
  description: string;
  products: ProductKey[];
  fragments: Fragment[];
  // customer-only (verified data)
  company?: string;
  logo?: string;
  quote?: string;
  person?: string;
  role?: string;
  result?: string;
  href?: string;
}

const STORIES: Story[] = [
  {
    type: "use-case",
    category: "Online business",
    headline: ["Products, billing and", "customer requests — together."],
    description: "Inventory, invoices and support in one place instead of three.",
    products: ["inventory", "invoice", "support"],
    fragments: [
      { kind: "stock", title: "Ceramic mug 350ml", value: "47 in stock" },
      { kind: "invoice", title: "INV-1048", status: "Paid" },
      { kind: "request", title: "Where's my order?", from: "Alex Morgan" },
    ],
  },
  {
    type: "use-case",
    category: "Service business",
    headline: ["Clients and billing,", "easier to follow."],
    description: "From the first enquiry to the invoice and every question after.",
    products: ["forms", "invoice", "support"],
    fragments: [
      { kind: "form", title: "New enquiry", meta: "Consultation · Lena Fischer" },
      { kind: "invoice", title: "INV-2031", status: "Pending" },
      { kind: "request", title: "Can we reschedule?", from: "Lena Fischer" },
    ],
  },
  {
    type: "use-case",
    category: "Growing team",
    headline: ["Room for your people", "and operations to grow."],
    description: "Employee records, stock and everyday paperwork stay organized as you hire.",
    products: ["hr", "inventory", "forms"],
    fragments: [
      { kind: "team", title: "Team", value: "24 people · 6 departments" },
      { kind: "attendance", title: "Present today", ratio: 0.875 },
      { kind: "form", title: "Equipment request", meta: "Operations · Rafael Ortiz" },
    ],
  },
];

function FragmentCard({ f }: { f: Fragment }) {
  const base = "w-[290px] max-w-full rounded-[8px] border border-zinc-200 bg-white px-4 py-3 text-[16px] text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white";
  switch (f.kind) {
    case "stock":
      return (
        <div className={base}>
          <p className="text-zinc-500 dark:text-zinc-400">Inventory</p>
          <p className="mt-1 flex items-center justify-between gap-2 font-medium">{f.title}<span className="shrink-0 whitespace-nowrap tabular-nums text-zinc-500 dark:text-zinc-400">{f.value}</span></p>
        </div>
      );
    case "invoice":
      return (
        <div className={base}>
          <p className="text-zinc-500 dark:text-zinc-400">Invoice</p>
          <p className="mt-1 flex items-center justify-between gap-2 font-medium">{f.title}<Badge tone={f.status === "Paid" ? "success" : "neutral"}>{f.status}</Badge></p>
        </div>
      );
    case "request":
      return (
        <div className={base}>
          <p className="text-zinc-500 dark:text-zinc-400">Support · {f.from}</p>
          <p className="mt-1 font-medium">{f.title}</p>
        </div>
      );
    case "form":
      return (
        <div className={base}>
          <p className="text-zinc-500 dark:text-zinc-400">Form submission</p>
          <p className="mt-1 font-medium">{f.title}</p>
          <p className="text-zinc-500 dark:text-zinc-400">{f.meta}</p>
        </div>
      );
    case "team":
      return (
        <div className={base}>
          <p className="text-zinc-500 dark:text-zinc-400">{f.title}</p>
          <p className="mt-1 font-medium">{f.value}</p>
        </div>
      );
    case "attendance":
      return (
        <div className={base}>
          <p className="flex justify-between text-zinc-500 dark:text-zinc-400">{f.title}<span className="tabular-nums text-zinc-900 dark:text-white">{Math.round(f.ratio * 24)} / 24</span></p>
          <div className="mt-2 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div className="h-full rounded-full bg-[#f25b2a]" style={{ width: `${f.ratio * 100}%` }} />
          </div>
        </div>
      );
  }
}

/** Three layered fragments of one business — a static composition, not a workflow */
function StoryVisual({ story }: { story: Story }) {
  const positions = ["left-[6%] top-[10%]", "right-[6%] top-[38%]", "left-[14%] bottom-[10%]"];
  return (
    <div aria-hidden="true" className="relative h-full min-h-[250px] overflow-hidden bg-[#fafaf8] dark:bg-zinc-900/40 sm:min-h-[440px]">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(24,24,27,0.06)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)] dark:bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)]" />
      {story.fragments.map((f, i) => (
        <div key={i} className={`absolute ${positions[i]} ${i === 2 ? "max-sm:hidden" : ""}`}>
          <FragmentCard f={f} />
        </div>
      ))}
    </div>
  );
}

export default function StoriesSection() {
  const ref = useRef<HTMLElement>(null);
  const { selected, shown, leaving, select } = useSwap(0, 170);
  const story = STORIES[shown];
  const isCustomer = story.type === "customer";

  useGsap(ref, (_mm, el) => revealOnScroll(el));

  const visualMotion = leaving ? "opacity-0 -translate-x-2 transition-all duration-150" : "fx-slide-in";
  const textMotion = leaving ? "opacity-0 transition-opacity duration-150" : "fx-enter";

  return (
    <Section ref={ref} id="stories" tone="white" labelledBy="stories-heading">
      <div className="mx-auto max-w-[760px] text-center">
        <Eyebrow>{STORIES.some((s) => s.type === "customer") ? "Customer stories" : "Built for your business"}</Eyebrow>
        <Heading id="stories-heading" lead="However you work," accent="keep it connected." />
      </div>

      <div
        id="story-panel"
        role="tabpanel"
        aria-labelledby={`story-tab-${selected}`}
        data-reveal="soft"
        className="mt-16 grid grid-cols-1 overflow-hidden border-y border-zinc-200 dark:border-zinc-800 md:grid-cols-2 lg:mt-20"
      >
        <div className="order-2 border-zinc-200 dark:border-zinc-800 md:order-1 md:border-r">
          <div key={`v-${shown}`} className={`h-full ${visualMotion}`}>
            <StoryVisual story={story} />
          </div>
        </div>

        <div className="relative order-1 flex flex-col justify-center px-0 py-12 md:order-2 md:px-12 lg:px-16">
          <span aria-hidden="true" className="pointer-events-none absolute right-4 top-4 select-none text-[120px] font-semibold leading-none tracking-tighter text-zinc-900/[0.04] dark:text-white/[0.04] max-md:hidden">
            {String(shown + 1).padStart(2, "0")}
          </span>
          <div key={`t-${shown}`} className={`relative ${textMotion}`}>
            <p className="text-[16px] font-medium uppercase tracking-[0.14em] text-[#f25b2a]">
              {isCustomer ? `Customer story · ${story.company}` : story.category}
            </p>
            <h3 className="mt-4 text-[28px] sm:text-[34px] lg:text-[40px] font-semibold tracking-tight leading-[1.12]">
              {story.headline.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </h3>
            <p className="mt-4 max-w-[440px] text-[16px] sm:text-lg text-zinc-600 dark:text-zinc-400">{story.description}</p>

            {isCustomer && story.quote && (
              <blockquote className="mt-6 border-l-2 border-[#f25b2a] pl-4 text-lg text-zinc-800 dark:text-zinc-200">
                {story.quote}
                {story.person && (
                  <footer className="mt-2 text-[16px] text-zinc-500">
                    {story.person}
                    {story.role ? `, ${story.role}` : ""}
                  </footer>
                )}
              </blockquote>
            )}

            <div className="mt-8">
              <p className="text-[16px] uppercase tracking-[0.14em] text-zinc-400">{isCustomer ? "Used with" : "Relevant tools"}</p>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                {story.products.map((p) => (
                  <ProductTag key={p} product={p} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Business scenarios"
        onKeyDown={tabKeyHandler(STORIES.length, selected, select, "horizontal")}
        data-reveal
        className="-mx-4 flex overflow-x-auto no-scrollbar px-4 md:mx-0 md:grid md:grid-cols-3 md:px-0"
      >
        {STORIES.map((s, i) => {
          const active = i === selected;
          return (
            <button
              key={s.category}
              id={`story-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls="story-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => select(i)}
              className="group relative shrink-0 border-t-2 border-transparent pr-8 pt-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a]"
            >
              <span aria-hidden="true" className={`absolute -top-[2px] left-0 h-[2px] bg-[#f25b2a] transition-all duration-500 ${active ? "w-full" : "w-0"}`} />
              <span className={`block tabular-nums text-[16px] ${active ? "text-[#f25b2a]" : "text-zinc-400"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span className={`mt-1 block whitespace-nowrap text-[16px] uppercase tracking-[0.12em] ${active ? "font-semibold text-zinc-900 dark:text-white" : "text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white"}`}>
                {s.category}
              </span>
            </button>
          );
        })}
      </div>
    </Section>
  );
}
