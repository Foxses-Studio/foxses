import React from "react";
import type { Block, Inline } from "@/lib/legal";

// Renders parsed policy blocks. Purely presentational — no wording is added.

function InlineText({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((p, i) => {
        const content = p.bold ? <strong className="font-semibold text-zinc-900 dark:text-white">{p.text}</strong> : p.text;
        return p.href ? (
          <a
            key={i}
            href={p.href}
            className="rounded-[2px] font-medium text-[#c2410c] underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f25b2a] dark:text-[#ff8a5c]"
          >
            {content}
          </a>
        ) : (
          <React.Fragment key={i}>{content}</React.Fragment>
        );
      })}
    </>
  );
}

export default function PolicyBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "h3") {
          return (
            <h3 key={b.id} id={b.id} className="mt-9 scroll-mt-28 text-lg font-semibold tracking-tight text-zinc-900 first:mt-0 dark:text-white sm:text-xl">
              {b.text}
            </h3>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={i} className="mt-4 space-y-2 pl-5 marker:text-[#f25b2a] [list-style-type:disc]">
              {b.items.map((item, j) => (
                <li key={j} className="pl-1">
                  <InlineText parts={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mt-4 first:mt-0">
            {b.lines.map((line, j) => (
              <React.Fragment key={j}>
                {j > 0 && <br />}
                <InlineText parts={line} />
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
