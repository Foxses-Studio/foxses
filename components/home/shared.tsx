import React from "react";
import {
  ClipboardList,
  Globe,
  LifeBuoy,
  Package,
  Receipt,
  Users,
  type LucideIcon,
} from "lucide-react";

// Layout + type primitives shared by the homepage sections below Section 5,
// matching the container, guides and type scale of the sections above.

export type ProductKey = "inventory" | "invoice" | "hr" | "forms" | "support" | "cloud";

export const PRODUCT_META: Record<ProductKey, { name: string; short: string; icon: LucideIcon }> = {
  inventory: { name: "Foxses Inventory", short: "Inventory", icon: Package },
  invoice: { name: "Foxses Invoice", short: "Invoice", icon: Receipt },
  hr: { name: "Foxses HR", short: "HR", icon: Users },
  forms: { name: "Foxses Forms", short: "Forms", icon: ClipboardList },
  support: { name: "Foxses Support", short: "Support", icon: LifeBuoy },
  cloud: { name: "Foxses Cloud", short: "Cloud", icon: Globe },
};

export const PRODUCT_ORDER: ProductKey[] = ["inventory", "invoice", "hr", "forms", "support", "cloud"];

type Tone = "white" | "warm" | "dark";

const TONE_CLASSES: Record<Tone, string> = {
  white: "bg-white text-zinc-900 dark:bg-zinc-950 dark:text-white",
  warm: "bg-[#fafaf8] text-zinc-900 dark:bg-[#0c0c0e] dark:text-white",
  dark: "bg-[#111113] text-white dark:bg-[#09090b]",
};

const GUIDE_CLASSES: Record<Tone, string> = {
  white: "border-zinc-200/70 dark:border-zinc-800/70",
  warm: "border-zinc-200/70 dark:border-zinc-800/70",
  dark: "border-white/[0.07]",
};

export const Section = React.forwardRef<
  HTMLElement,
  {
    id?: string;
    tone?: Tone;
    labelledBy?: string;
    className?: string;
    innerClassName?: string;
    children: React.ReactNode;
  }
>(function Section({ id, tone = "white", labelledBy, className = "", innerClassName = "", children }, ref) {
  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={labelledBy}
      className={`relative w-full overflow-hidden border-b ${
        tone === "dark" ? "border-zinc-800" : "border-zinc-200/80 dark:border-zinc-800"
      } ${TONE_CLASSES[tone]} ${className}`}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12">
        <div className={`lg:border-x ${GUIDE_CLASSES[tone]} py-24 sm:py-28 lg:py-36 lg:px-10 xl:px-14 ${innerClassName}`}>
          {children}
        </div>
      </div>
    </section>
  );
});

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      data-reveal
      className={`text-[16px] font-medium uppercase tracking-[0.16em] text-[#f25b2a] ${className}`}
    >
      {children}
    </p>
  );
}

export function Heading({
  id,
  lead,
  accent,
  className = "",
}: {
  id: string;
  lead: React.ReactNode;
  accent: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      data-reveal
      className={`mt-4 text-[34px] sm:text-5xl lg:text-[56px] font-semibold tracking-tight leading-[1.06] ${className}`}
    >
      {lead}
      <br />
      <span className="font-bold text-[#f25b2a]">{accent}</span>
    </h2>
  );
}

export function Lede({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      data-reveal
      className={`mt-5 max-w-[560px] text-[16px] sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 ${className}`}
    >
      {children}
    </p>
  );
}

/** Small "icon + name" product label — never a button */
export function ProductTag({ product, dark = false }: { product: ProductKey; dark?: boolean }) {
  const { short, icon: Icon } = PRODUCT_META[product];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[16px] ${
        dark ? "text-zinc-300" : "text-zinc-700 dark:text-zinc-300"
      }`}
    >
      <Icon className="h-4 w-4 text-[#f25b2a]" strokeWidth={1.75} aria-hidden="true" />
      {short}
    </span>
  );
}

export function TextLink({
  href,
  children,
  external = false,
  dark = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  dark?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex w-fit items-center gap-2 rounded-[4px] text-[16px] font-medium transition-colors hover:text-[#f25b2a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f25b2a] ${
        dark ? "text-white" : "text-zinc-900 dark:text-white"
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className="text-[#f25b2a] transition-transform duration-300 group-hover:translate-x-1"
      >
        {external ? "↗" : "→"}
      </span>
    </a>
  );
}

/** Keyboard support for a horizontal or vertical tablist with automatic activation */
export function tabKeyHandler(
  count: number,
  current: number,
  select: (i: number) => void,
  orientation: "horizontal" | "vertical" | "both" = "both"
) {
  return (e: React.KeyboardEvent<HTMLElement>) => {
    const next =
      ((orientation !== "vertical" && e.key === "ArrowRight") ||
        (orientation !== "horizontal" && e.key === "ArrowDown"))
        ? (current + 1) % count
        : (orientation !== "vertical" && e.key === "ArrowLeft") ||
            (orientation !== "horizontal" && e.key === "ArrowUp")
          ? (current - 1 + count) % count
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? count - 1
              : -1;
    if (next < 0) return;
    e.preventDefault();
    select(next);
    const tabs = e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]');
    tabs[next]?.focus();
  };
}

/** Swap content with a short leave phase, then let the new content enter */
export function useSwap<T>(initial: T, leaveMs = 160) {
  const [selected, setSelected] = React.useState(initial);
  const [shown, setShown] = React.useState(initial);
  const [leaving, setLeaving] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const select = React.useCallback(
    (value: T) => {
      setSelected(value);
      if (timer.current) clearTimeout(timer.current);
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setShown(value);
        setLeaving(false);
        return;
      }
      setLeaving(true);
      timer.current = setTimeout(() => {
        setShown(value);
        setLeaving(false);
      }, leaveMs);
    },
    [leaveMs]
  );

  return { selected, shown, leaving, select };
}
