"use client";

import React from "react";
import Image from "next/image";

interface TrustedLogo {
  name: string;
  src: string;
  /** Intrinsic size of the trimmed monochrome mark */
  width: number;
  height: number;
}

// One-colour versions of each brand mark (public/trusted_by/mono), trimmed to
// their visible content so they can be sized consistently.
const trustedLogos: TrustedLogo[] = [
  { name: "Acadia Shops", src: "/trusted_by/mono/acadiashops.png", width: 978, height: 448 },
  { name: "Canadian Nest School", src: "/trusted_by/mono/canadian-nest.png", width: 1003, height: 295 },
  { name: "Cheshire Pathway Mediation", src: "/trusted_by/mono/cheshire-pathway.png", width: 614, height: 190 },
  { name: "Fusion Pro", src: "/trusted_by/mono/fusionpro.png", width: 224, height: 40 },
  { name: "Grey Lee Consulting", src: "/trusted_by/mono/greylee.png", width: 810, height: 190 },
  { name: "Keystone Safari", src: "/trusted_by/mono/keystone-safari.png", width: 184, height: 57 },
  { name: "Southern Charm Floors", src: "/trusted_by/mono/southern-charm.png", width: 114, height: 64 },
  { name: "Small Business Survival Alliance", src: "/trusted_by/mono/srsa.png", width: 139, height: 52 },
];

// Give every mark roughly the same visual area, so wide wordmarks and compact
// emblems carry equal weight.
const TARGET_AREA = 5800;
const MAX_HEIGHT = 56;
const MAX_WIDTH = 168;

function displaySize({ width, height }: TrustedLogo) {
  const aspect = width / height;
  let h = Math.min(MAX_HEIGHT, Math.sqrt(TARGET_AREA / aspect));
  let w = h * aspect;
  if (w > MAX_WIDTH) {
    w = MAX_WIDTH;
    h = w / aspect;
  }
  return { w: Math.round(w), h: Math.round(h) };
}

export function TrustedBy() {
  return (
    <section className="w-full py-12 lg:py-16 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 transition-colors duration-300">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 text-center">
        {/* Section Header */}
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-10 sm:mb-12">
          TRUSTED BY GROWING TEAMS & INNOVATIVE BRANDS
        </p>

        {/* Logos — equal cells, same colour, same visual weight */}
        <ul className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4 border-l border-t border-zinc-200/80 dark:border-zinc-800">
          {trustedLogos.map((logo) => {
            const { w, h } = displaySize(logo);
            return (
              <li
                key={logo.name}
                className="group flex h-24 sm:h-28 items-center justify-center border-r border-b border-zinc-200/80 dark:border-zinc-800 px-4"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  sizes="(min-width: 640px) 168px, 135px"
                  style={{ width: w, height: h }}
                  className="max-w-full object-contain opacity-70 scale-[0.8] sm:scale-100 transition-opacity duration-300 group-hover:opacity-90 dark:invert dark:opacity-70 dark:group-hover:opacity-100"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default TrustedBy;
