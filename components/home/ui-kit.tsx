import React from "react";

// Real-size UI primitives for the in-page product views (Sections 6 and 8).
// All numbers rendered with these are illustrative sample data.

export type Tone = "neutral" | "success" | "warning" | "muted";

const TONES: Record<Tone, string> = {
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  warning: "bg-[#fff1ea] text-[#c2410c] dark:bg-[#f25b2a]/15 dark:text-[#ff8a5c]",
  muted: "bg-transparent text-zinc-500 ring-1 ring-inset ring-zinc-200 dark:text-zinc-400 dark:ring-zinc-700",
};

export function Badge({ tone = "neutral", className = "", children }: { tone?: Tone; className?: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-[4px] px-2 py-0.5 text-[16px] leading-tight ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Quiet application frame with a single context label in the window bar */
export function Frame({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[8px] border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white ${className}`}
    >
      <div className="flex h-10 items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-4 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </span>
        <span className="truncate text-[16px] text-zinc-500 dark:text-zinc-400">{label}</span>
        <span className="ml-auto hidden text-[16px] text-zinc-400 dark:text-zinc-500 sm:inline">Sample data</span>
      </div>
      {children}
    </div>
  );
}

export function Panel({
  title,
  aside,
  className = "",
  children,
}: {
  title?: string;
  aside?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-[8px] border border-zinc-200 dark:border-zinc-800 ${className}`}>
      {title && (
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
          <span className="text-[16px] font-semibold">{title}</span>
          {aside && <span className="text-[16px] text-zinc-500 dark:text-zinc-400">{aside}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 truncate text-[16px] text-zinc-500 dark:text-zinc-400">
        {accent && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f25b2a]" aria-hidden="true" />}
        {label}
      </p>
      <p className={`mt-1 text-[24px] font-semibold leading-none tracking-tight tabular-nums ${accent ? "text-[#f25b2a]" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export function Rows({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">{children}</ul>;
}

export function Row({
  primary,
  secondary,
  end,
  className = "",
}: {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  end?: React.ReactNode;
  className?: string;
}) {
  return (
    <li className={`flex items-center justify-between gap-3 px-4 py-2.5 text-[16px] transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40 ${className}`}>
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-medium">{primary}</span>
        {secondary && <span className="block truncate text-zinc-500 dark:text-zinc-400">{secondary}</span>}
      </span>
      {end && <span className="shrink-0">{end}</span>}
    </li>
  );
}

export function Initials({ children, tone = 0 }: { children: string; tone?: number }) {
  const tones = [
    "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200",
    "bg-[#fde3d7] text-[#b8441d] dark:bg-[#f25b2a]/20 dark:text-[#ff9b73]",
    "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200",
  ];
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[16px] font-medium ${tones[tone % tones.length]}`}
    >
      {children}
    </span>
  );
}
