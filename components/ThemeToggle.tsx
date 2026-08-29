"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  className?: string;
  showText?: boolean;
}

export function ThemeToggle({ className = "", showText = false }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-[8px] h-10 w-10 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${className}`}
        aria-label="Loading Theme Switcher"
      >
        <FaSun className="h-5 w-5 text-amber-500 opacity-50" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size={showText ? "default" : "icon"}
      onClick={toggleTheme}
      className={`group relative rounded-[8px] ${
        showText ? "px-3.5 py-2 h-10 w-auto gap-2" : "h-10 w-10"
      } text-zinc-800 dark:text-zinc-200 hover:bg-amber-500/10 dark:hover:bg-amber-400/10 hover:border-amber-500/30 transition-all duration-300 hover:scale-110 active:scale-90 border border-zinc-200/80 dark:border-zinc-800 ${className}`}
      title={`Switch to ${isDark ? "Light" : "Dark"} mode`}
      aria-label="Toggle dark/light theme"
    >
      {isDark ? (
        <FaMoon className="h-4 w-4 text-amber-300 transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110" />
      ) : (
        <FaSun className="h-4 w-4 text-amber-500 transition-transform duration-500 group-hover:rotate-90 group-hover:scale-120" />
      )}
      {showText && (
        <span className="text-[14px] font-medium transition-colors group-hover:text-amber-500">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </Button>
  );
}
