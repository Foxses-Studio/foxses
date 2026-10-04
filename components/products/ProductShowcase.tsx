"use client";

import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowRight, Check, LayoutGrid } from "lucide-react";
import {
  CATEGORIES,
  PRODUCTS,
  productsIn,
  type CategoryId,
  type Product,
  type ProductId,
} from "./product-data";
import ScaledPreview from "./ScaledPreview";
import { AutoProgress, useAutoplayPause } from "@/components/home/AutoProgress";
import { COMPACT_SIZE, DESKTOP_SIZE } from "./previews/ui";
import InventoryPreview from "./previews/InventoryPreview";
import FormsPreview from "./previews/FormsPreview";
import InvoicePreview from "./previews/InvoicePreview";
import HRPreview from "./previews/HRPreview";
import SupportPreview from "./previews/SupportPreview";
import CloudPreview from "./previews/CloudPreview";

const PREVIEWS: Record<ProductId, React.ComponentType<{ compact?: boolean }>> = {
  inventory: InventoryPreview,
  forms: FormsPreview,
  invoice: InvoicePreview,
  hr: HRPreview,
  support: SupportPreview,
  cloud: CloudPreview,
};

const LEAVE_MS = 160;

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}

const byId = (id: ProductId) => PRODUCTS.find((p) => p.id === id) as Product;

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [category, setCategory] = useState<CategoryId>("all");
  const [selected, setSelected] = useState<ProductId>("inventory");
  const [shown, setShown] = useState<ProductId>("inventory");
  const [leaving, setLeaving] = useState(false);

  const compact = useMediaQuery("(max-width: 639px)");
  const wide = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const product = byId(shown);
  const Preview = PREVIEWS[shown];
  const categoryProducts = productsIn(category);

  // Scroll entrance — once
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    []
  );

  // Old story fades out briefly, then the new one settles in
  const showProduct = useCallback(
    (id: ProductId) => {
      setSelected(id);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
      if (reducedMotion) {
        setShown(id);
        setLeaving(false);
        return;
      }
      setLeaving(true);
      leaveTimer.current = setTimeout(() => {
        setShown(id);
        setLeaving(false);
      }, LEAVE_MS);
    },
    [reducedMotion]
  );

  // Autoplay: step through the products in the current category; a
  // single-product category hands over to the next category
  const panelRef = useRef<HTMLDivElement>(null);
  const { paused, hoverProps } = useAutoplayPause(panelRef);
  const autoNext = () => {
    const list = productsIn(category);
    if (list.length > 1) {
      const i = list.findIndex((p) => p.id === selected);
      showProduct(list[(i + 1) % list.length].id);
      return;
    }
    const cats = CATEGORIES.filter((c) => c.id !== "all");
    const ci = cats.findIndex((c) => c.id === category);
    selectCategory(cats[(ci + 1) % cats.length].id);
  };

  const selectCategory = (id: CategoryId) => {
    setCategory(id);
    const list = productsIn(id);
    if (!list.some((p) => p.id === selected)) showProduct(list[0].id);
  };

  // Tabs: arrow keys move between categories (automatic activation)
  const onTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = CATEGORIES.length - 1;
    let next = -1;
    if (e.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next < 0) return;
    e.preventDefault();
    selectCategory(CATEGORIES[next].id);
    tabRefs.current[next]?.focus();
  };

  const reveal = (extra = "") =>
    `transition-all duration-700 ease-out motion-reduce:transition-none ${extra} ${
      isVisible
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-3 motion-reduce:opacity-100 motion-reduce:translate-y-0"
    }`;

  const story = leaving
    ? "opacity-0 -translate-y-2 transition-all duration-150 ease-in"
    : "fx-enter";

  const cta = (className: string) => (
    <a
      href={product.href}
      className={`group w-fit items-center gap-2 rounded-[4px] text-[16px] font-medium text-zinc-900 dark:text-white hover:text-[#f25b2a] dark:hover:text-[#f25b2a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f25b2a] transition-colors ${className}`}
    >
      {product.cta}
      <ArrowRight
        className="h-4 w-4 text-[#f25b2a] transition-transform duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </a>
  );

  const activeTabId = `products-tab-${category}`;

  return (
    <section
      ref={sectionRef}
      id="products"
      aria-labelledby="products-heading"
      className="relative w-full bg-[#fafaf8] dark:bg-[#0c0c0e] border-b border-zinc-200/80 dark:border-zinc-800 transition-colors duration-300"
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <div className="lg:border-x border-zinc-200/70 dark:border-zinc-800/70 py-20 sm:py-28 lg:py-32 lg:px-10 xl:px-14">
          {/* HEADER */}
          <div className="mx-auto max-w-[980px] text-center">
            <p
              className={`inline-flex items-center gap-2 text-[16px] font-medium uppercase tracking-[0.16em] text-[#f25b2a] ${reveal()}`}
            >
              <LayoutGrid className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Foxses Products
            </p>
            <h2
              id="products-heading"
              className={`mt-4 text-[30px] sm:text-5xl lg:text-[56px] font-semibold tracking-tight leading-[1.08] text-zinc-900 dark:text-white ${reveal("delay-100")}`}
            >
              Everything your business needs.
              <br />
              <span className="text-[#f25b2a] font-bold">Built into Foxses.</span>
            </h2>
            <p
              className={`mx-auto mt-5 max-w-[640px] text-[16px] sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed ${reveal("delay-200")}`}
            >
              From daily operations to finance and customer support, Foxses gives your team the
              tools to run your business from one connected platform.
            </p>
          </div>

          {/* CATEGORY TABS */}
          <div className={`mt-10 sm:mt-12 ${reveal("delay-300")}`}>
            <div
              role="tablist"
              aria-label="Product categories"
              className="mx-auto flex max-w-full flex-wrap justify-center gap-2 lg:w-max lg:flex-nowrap lg:gap-1 lg:rounded-[8px] lg:border lg:border-zinc-200 lg:bg-white lg:p-1 dark:lg:border-zinc-800 dark:lg:bg-zinc-900"
            >
              {CATEGORIES.map((c, i) => {
                const active = c.id === category;
                return (
                  <button
                    key={c.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    id={`products-tab-${c.id}`}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-controls="products-panel"
                    tabIndex={active ? 0 : -1}
                    onClick={() => selectCategory(c.id)}
                    onKeyDown={(e) => onTabKeyDown(e, i)}
                    className={`h-10 whitespace-nowrap rounded-[6px] border px-4 text-[16px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a] ${
                      active
                        ? "border-[#f25b2a]/30 bg-[#fff6f0] font-medium text-zinc-900 dark:bg-[#f25b2a]/10 dark:text-white"
                        : "border-zinc-200 bg-white text-zinc-500 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white lg:border-transparent lg:bg-transparent dark:lg:bg-transparent"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SHOWCASE */}
          <div
            ref={panelRef}
            {...hoverProps}
            id="products-panel"
            role="tabpanel"
            aria-labelledby={activeTabId}
            className={`relative mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,40fr)_minmax(0,60fr)] overflow-hidden rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 transition-all duration-700 delay-300 ease-out motion-reduce:transition-none ${
              isVisible ? "opacity-100" : "opacity-0 motion-reduce:opacity-100"
            }`}
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[2px] overflow-hidden">
              <AutoProgress cycleKey={`${category}-${selected}`} duration={7000} paused={paused} onDone={autoNext} className="h-full w-full" />
            </span>

            {/* Product story */}
            <div className="flex min-w-0 flex-col p-6 sm:p-10 xl:p-12">
              {categoryProducts.length > 1 && (
                <div
                  role="group"
                  aria-label="Choose a product"
                  className="mb-8 flex flex-wrap gap-x-4 gap-y-1 border-b border-zinc-100 dark:border-zinc-800"
                >
                  {categoryProducts.map((p) => {
                    const active = p.id === selected;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => showProduct(p.id)}
                        className={`shrink-0 border-b-2 pb-2.5 text-[16px] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a] ${
                          active
                            ? "border-[#f25b2a] font-medium text-zinc-900 dark:text-white"
                            : "border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                        }`}
                      >
                        {p.shortName}
                      </button>
                    );
                  })}
                </div>
              )}

              <div key={shown} className={`flex flex-1 flex-col ${story}`} aria-live="polite">
                <p className="text-[16px] font-medium uppercase tracking-[0.14em] text-[#f25b2a]">
                  {product.categoryLabel}
                </p>
                <p className="mt-3 flex flex-wrap items-center gap-2.5 text-lg font-semibold text-zinc-900 dark:text-white">
                  {product.name}
                  {product.status && (
                    <span className="rounded-[4px] border border-[#f25b2a]/30 bg-[#fff6f0] px-2 py-0.5 text-[16px] font-medium text-[#c2410c] dark:bg-[#f25b2a]/10 dark:text-[#ff8a5c]">
                      {product.status}
                    </span>
                  )}
                </p>
                <h3 className="mt-5 text-[28px] sm:text-4xl lg:text-[34px] xl:text-[40px] font-semibold tracking-tight leading-[1.12] text-zinc-900 dark:text-white">
                  {product.headline.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="mt-5 max-w-[460px] text-[16px] sm:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {product.description}
                </p>
                <ul className="mt-7 space-y-3">
                  {product.capabilities.map((c) => (
                    <li
                      key={c}
                      className="flex items-center gap-3 text-[16px] text-zinc-800 dark:text-zinc-200"
                    >
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fff6f0] dark:bg-[#f25b2a]/15">
                        <Check className="h-3 w-3 text-[#f25b2a]" strokeWidth={3} aria-hidden="true" />
                      </span>
                      {c}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto hidden pt-10 lg:block">{cta("inline-flex")}</div>
              </div>
            </div>

            {/* Product UI — anchored to the bottom-right edge for depth */}
            <div className="relative min-w-0 border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 lg:border-l lg:border-t-0">
              <div
                className={`p-4 sm:p-8 lg:absolute lg:inset-0 lg:pb-0 lg:pr-0 lg:pl-10 lg:pt-12 transition-all duration-700 delay-500 ease-out motion-reduce:transition-none ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
                }`}
              >
                <figure
                  role="img"
                  aria-label={`Preview of the ${product.name} interface with sample data`}
                  className={`overflow-hidden rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:h-full lg:rounded-b-none lg:rounded-r-none lg:border-b-0 lg:border-r-0 ${story}`}
                  key={`preview-${shown}`}
                >
                  <div aria-hidden="true" className="lg:h-full">
                    <ScaledPreview
                      fill={wide}
                      width={compact ? COMPACT_SIZE.width : DESKTOP_SIZE.width}
                      height={compact ? COMPACT_SIZE.height : DESKTOP_SIZE.height}
                    >
                      <Preview compact={compact} />
                    </ScaledPreview>
                  </div>
                </figure>
              </div>
              <div className="px-6 pb-6 sm:px-10 sm:pb-10 lg:hidden">{cta("inline-flex")}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
