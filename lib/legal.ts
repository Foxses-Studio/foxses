import { readFileSync } from "node:fs";
import path from "node:path";

// Reads a legal document from content/legal/*.md and splits it into blocks.
// Only structure is interpreted (#, ##, ###, "* " bullets, blank-line
// paragraphs, **bold**); the wording itself is rendered exactly as written.

export type Inline = { text: string; bold?: boolean; href?: string };

export type Block =
  | { type: "p"; lines: Inline[][] }
  | { type: "ul"; items: Inline[][] }
  | { type: "h3"; id: string; text: string };

export interface LegalSection {
  id: string;
  /** The section number exactly as written, e.g. "1." — null if the heading has none */
  number: string | null;
  title: string;
  blocks: Block[];
}

export interface LegalDocument {
  title: string;
  lastUpdated: string | null;
  intro: Block[];
  sections: LegalSection[];
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** **bold** and bare foxses.com become inline marks; text is otherwise untouched */
function parseInline(line: string): Inline[] {
  const out: Inline[] = [];
  const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  for (const part of parts) {
    const bold = part.startsWith("**") && part.endsWith("**");
    const text = bold ? part.slice(2, -2) : part;
    text.split(/(\bfoxses\.com\b)/g).filter(Boolean).forEach((t) => {
      out.push(t === "foxses.com" ? { text: t, bold, href: "https://foxses.com" } : { text: t, bold });
    });
  }
  return out;
}

export function loadLegalDocument(slug: string): LegalDocument {
  const raw = readFileSync(path.join(process.cwd(), "content", "legal", `${slug}.md`), "utf8");
  const lines = raw.replace(/\r\n/g, "\n").split("\n");

  const doc: LegalDocument = { title: "", lastUpdated: null, intro: [], sections: [] };
  let target: Block[] = doc.intro;
  let para: string[] = [];
  let list: string[] = [];
  const usedIds = new Set<string>();
  const uniqueId = (base: string) => {
    let id = base || "section";
    let n = 2;
    while (usedIds.has(id)) id = `${base}-${n++}`;
    usedIds.add(id);
    return id;
  };

  const flush = () => {
    if (para.length) target.push({ type: "p", lines: para.map(parseInline) });
    if (list.length) target.push({ type: "ul", items: list.map(parseInline) });
    para = [];
    list = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      continue;
    }
    if (trimmed.startsWith("# ")) {
      flush();
      doc.title = trimmed.slice(2).trim();
      continue;
    }
    const updated = trimmed.replace(/^\*\*|\*\*$/g, "").match(/^Last Updated:\s*(.+)$/);
    if (updated && doc.sections.length === 0 && !doc.lastUpdated) {
      flush();
      doc.lastUpdated = updated[1].trim();
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flush();
      const heading = trimmed.slice(3).trim();
      const m = heading.match(/^(\d+(?:\.\d+)*\.)\s+(.*)$/);
      const section: LegalSection = {
        id: uniqueId(slugify(m ? m[2] : heading)),
        number: m ? m[1] : null,
        title: m ? m[2] : heading,
        blocks: [],
      };
      doc.sections.push(section);
      target = section.blocks;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flush();
      const text = trimmed.slice(4).trim();
      target.push({ type: "h3", id: uniqueId(slugify(text)), text });
      continue;
    }
    if (/^[*-]\s+/.test(trimmed)) {
      if (para.length) flush();
      list.push(trimmed.replace(/^[*-]\s+/, ""));
      continue;
    }
    if (list.length) flush();
    para.push(trimmed);
  }
  flush();
  return doc;
}
