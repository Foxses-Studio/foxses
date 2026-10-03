"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Renders a fixed-size UI mockup and scales it to the available width, like a
 * screenshot that stays crisp. By default the wrapper keeps the mockup's aspect
 * ratio; with `fill` it takes its parent's height and the mockup grows taller
 * (never shorter than `height`) so the frame is always filled.
 */
export default function ScaledPreview({
  width,
  height,
  fill = false,
  children,
}: {
  width: number;
  height: number;
  fill?: boolean;
  children: React.ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ scale: number; height: number } | null>(null);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const scale = entry.contentRect.width / width;
      setBox({ scale, height: entry.contentRect.height / scale });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const scale = box?.scale ?? null;
  const innerHeight = fill && box ? Math.max(height, box.height) : height;

  return (
    <div
      ref={outerRef}
      className={`relative w-full overflow-hidden ${fill ? "h-full" : ""}`}
      style={fill ? undefined : { aspectRatio: `${width} / ${height}` }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width,
          height: innerHeight,
          transform: `scale(${scale ?? 1})`,
          visibility: scale === null ? "hidden" : "visible",
        }}
      >
        {children}
      </div>
    </div>
  );
}
