"use client";

import React from "react";

export function AnimatedGridBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 3. Dotted Matrix Background Pattern */}
      <div className="absolute inset-0 bg-dot-matrix opacity-60 dark:opacity-75 [mask-image:radial-gradient(ellipse_90%_90%_at_50%_35%,#000_70%,transparent_100%)]" />

      {/* 4. Vertical Dashed Grid Guidelines */}
      <div className="absolute inset-0 max-w-[1600px] mx-auto grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="border-r border-dashed border-zinc-200/70 dark:border-zinc-800/80 h-full"
          />
        ))}
      </div>
    </div>
  );
}
