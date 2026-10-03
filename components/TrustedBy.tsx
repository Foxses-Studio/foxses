"use client";

import React from "react";
import Image from "next/image";

interface TrustedLogo {
  name: string;
  src: string;
  className?: string;
}

const trustedLogos: TrustedLogo[] = [
  { name: "Acadia Shops", src: "/trusted_by/acadiashops.png" },
  { name: "Canadian Nest", src: "/trusted_by/canadian_nest.png" },
  {
    name: "Cheshire Pathway Mediation",
    src: "/trusted_by/cheshirepathwaymediation.png",
    className: "max-h-16 sm:max-h-24 scale-125 sm:scale-140",
  },
  { name: "Fusion Pro", src: "/trusted_by/fusionpro.png" },
  { name: "Grey Lee Consulting", src: "/trusted_by/greyleeconsulting.png" },
  { name: "Safari", src: "/trusted_by/safari.png" },
  { name: "Southern Charm Floors", src: "/trusted_by/southerncharmfloors..png" },
  { name: "SRSA", src: "/trusted_by/srsa.png" },
];

export function TrustedBy() {
  return (
    <section className="w-full py-12 lg:py-16 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/60 transition-colors duration-300">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-8 lg:px-12 text-center">
        {/* Section Header */}
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 mb-10 sm:mb-12">
          TRUSTED BY GROWING TEAMS & INNOVATIVE BRANDS
        </p>

        {/* Logos Container */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-14 gap-y-10 max-w-6xl mx-auto">
          {trustedLogos.map((logo, index) => (
            <div
              key={index}
              className="group flex items-center justify-center p-2 h-16 sm:h-20 w-36 sm:w-44 rounded-lg transition-all duration-300 hover:scale-105"
            >
              {/* Logo Image */}
              <div className="relative w-full h-14 sm:h-16 flex items-center justify-center opacity-85 dark:opacity-90 hover:opacity-100 transition-all duration-300">
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={220}
                  height={80}
                  className={`w-auto object-contain grayscale dark:invert dark:brightness-150 transition-all duration-300 ${
                    logo.className || "max-h-12 sm:max-h-16"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedBy;
