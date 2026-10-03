import React from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

// Shared building blocks for the product UI previews.
// Previews are laid out at a fixed "design size" and scaled to fit (see ScaledPreview),
// so sizes here are in design pixels.

export const DESKTOP_SIZE = { width: 960, height: 820 };
export const COMPACT_SIZE = { width: 420, height: 660 };

export interface NavItem {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

interface AppShellProps {
  product: string;
  url: string;
  nav: NavItem[];
  compact?: boolean;
  children: React.ReactNode;
}

export function AppShell({ product, url, nav, compact, children }: AppShellProps) {
  const size = compact ? COMPACT_SIZE : DESKTOP_SIZE;
  return (
    <div
      style={{ width: size.width, minHeight: size.height }}
      className="flex h-full flex-col overflow-hidden bg-white text-[16px] text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
    >
      {/* Window bar — kept deliberately quiet */}
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-4 dark:border-zinc-800 dark:bg-zinc-950">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </span>
        <span className="mx-auto rounded-[6px] border border-zinc-200 bg-white px-3 py-0.5 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
          {url}
        </span>
        <span className="text-zinc-400 dark:text-zinc-500">Sample data</span>
      </div>

      {compact ? (
        <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Image src="/all-logo/foxses_logo.png" alt="" width={20} height={22} className="h-5 w-auto" />
          <span className="font-semibold">{product}</span>
          <span className="ml-auto text-zinc-500 dark:text-zinc-400">
            {nav.find((n) => n.active)?.label}
          </span>
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        {!compact && (
          <aside className="flex w-[200px] shrink-0 flex-col border-r border-zinc-200 bg-zinc-50/70 px-3 py-4 dark:border-zinc-800 dark:bg-zinc-950/50">
            <div className="mb-5 flex items-center gap-2.5 px-2">
              <Image src="/all-logo/foxses_logo.png" alt="" width={22} height={24} className="h-6 w-auto" />
              <span className="font-semibold">{product}</span>
            </div>
            <ul className="space-y-0.5">
              {nav.map(({ icon: Icon, label, active }) => (
                <li
                  key={label}
                  className={`flex items-center gap-2.5 rounded-[6px] px-2.5 py-1.5 ${
                    active
                      ? "bg-white font-medium text-zinc-900 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-white dark:ring-zinc-800"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${active ? "text-[#f25b2a]" : ""}`}
                    strokeWidth={1.75}
                  />
                  {label}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex items-center gap-2.5 rounded-[6px] px-2 py-1.5">
              <Avatar initials="AK" />
              <span className="text-zinc-600 dark:text-zinc-300">Your workspace</span>
            </div>
          </aside>
        )}
        <main className={`min-w-0 flex-1 overflow-hidden ${compact ? "p-4" : "p-6"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h4 className="text-[22px] font-semibold leading-tight tracking-tight">{title}</h4>
        {subtitle && <p className="mt-0.5 text-zinc-500 dark:text-zinc-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-9 items-center gap-1.5 rounded-[6px] bg-[#f25b2a] px-3.5 font-medium text-white">
      {children}
    </span>
  );
}

export function Card({
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
    <div
      className={`rounded-[8px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
    >
      {title && (
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
          <span className="font-semibold">{title}</span>
          {aside && <span className="text-zinc-500 dark:text-zinc-400">{aside}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[8px] border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
        {accent && <span className="h-1.5 w-1.5 rounded-full bg-[#f25b2a]" />}
        {label}
      </div>
      <div
        className={`mt-1 text-[26px] font-semibold leading-none tracking-tight tabular-nums ${
          accent ? "text-[#f25b2a]" : ""
        }`}
      >
        {value}
      </div>
      {hint && <div className="mt-1.5 text-zinc-400 dark:text-zinc-500">{hint}</div>}
    </div>
  );
}

export type Tone = "neutral" | "success" | "warning" | "muted";

const TONES: Record<Tone, string> = {
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  warning: "bg-[#fff1ea] text-[#c2410c] dark:bg-[#f25b2a]/15 dark:text-[#ff8a5c]",
  muted: "bg-zinc-50 text-zinc-500 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-800",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-[4px] px-2 py-0.5 leading-tight ${TONES[tone]}`}>
      {children}
    </span>
  );
}

export function Avatar({ initials, tone = 0 }: { initials: string; tone?: number }) {
  const tones = [
    "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200",
    "bg-[#fde3d7] text-[#b8441d] dark:bg-[#f25b2a]/20 dark:text-[#ff9b73]",
    "bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200",
  ];
  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-medium ${
        tones[tone % tones.length]
      }`}
    >
      {initials}
    </span>
  );
}

/** Thin data line that draws itself once when the preview appears. */
export function Sparkline({
  points,
  width,
  height,
  baseline,
}: {
  points: number[];
  width: number;
  height: number;
  baseline?: number[];
}) {
  const toPath = (vals: number[]) => {
    const max = Math.max(...points, ...(baseline ?? []));
    const min = Math.min(...points, ...(baseline ?? []));
    const span = max - min || 1;
    return vals
      .map((v, i) => {
        const x = (i / (vals.length - 1)) * width;
        const y = height - 6 - ((v - min) / span) * (height - 12);
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  };
  const main = toPath(points);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={0}
          x2={width}
          y1={height * f}
          y2={height * f}
          className="stroke-zinc-100 dark:stroke-zinc-800"
          strokeWidth={1}
        />
      ))}
      {baseline && (
        <path
          d={toPath(baseline)}
          fill="none"
          className="stroke-zinc-300 dark:stroke-zinc-600"
          strokeWidth={1.5}
          strokeDasharray="4 4"
        />
      )}
      <path
        d={main}
        fill="none"
        stroke="#f25b2a"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={1}
        className="fx-draw-line"
      />
    </svg>
  );
}

export function Bars({
  values,
  height,
  highlight,
  labels,
}: {
  values: number[];
  height: number;
  highlight?: number;
  labels?: string[];
}) {
  const max = Math.max(...values) || 1;
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {values.map((v, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center gap-1.5">
          <div className="flex w-full flex-1 items-end">
            <div
              className={`fx-grow-bar w-full rounded-[3px] ${
                i === highlight ? "bg-[#f25b2a]" : "bg-zinc-200 dark:bg-zinc-700"
              }`}
              style={{ height: `${(v / max) * 100}%`, animationDelay: `${i * 40}ms` }}
            />
          </div>
          {labels && <span className="leading-none text-zinc-400 dark:text-zinc-500">{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}
