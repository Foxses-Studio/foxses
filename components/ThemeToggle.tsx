"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showText?: boolean;
}

// True only after hydration, so the icon never mismatches the server render
const useMounted = () =>
  useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

export function ThemeToggle({ className = "", showText = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      disabled={!mounted}
      aria-label={label}
      title={label}
      className={`group inline-flex items-center justify-center gap-2 rounded-[8px] border border-zinc-200/80 text-zinc-700 transition-colors duration-200 hover:border-[#f25b2a]/40 hover:text-[#f25b2a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a] disabled:opacity-60 dark:border-zinc-800 dark:text-zinc-300 ${
        showText ? "h-10 px-3.5" : "h-10 w-10"
      } ${className}`}
    >
      {isDark ? (
        <Moon aria-hidden="true" strokeWidth={1.75} className="h-[18px] w-[18px]" />
      ) : (
        <Sun aria-hidden="true" strokeWidth={1.75} className="h-[18px] w-[18px]" />
      )}
      {showText && <span className="text-[16px] font-medium">{isDark ? "Dark" : "Light"}</span>}
    </button>
  );
}
