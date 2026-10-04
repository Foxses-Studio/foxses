import React from "react";
import { Check, Link2, Mail, Paperclip, Send } from "lucide-react";
import { STORY, type StageId } from "./workflow-data";

// The one product interface shown for each workflow stage. Illustrative data only.

type Tone = "neutral" | "success" | "warning";

const TONES: Record<Tone, string> = {
  neutral: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  warning: "bg-[#fff1ea] text-[#c2410c] dark:bg-[#f25b2a]/15 dark:text-[#ff8a5c]",
};

function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-[4px] px-2 py-0.5 text-[16px] leading-tight ${TONES[tone]}`}>
      {children}
    </span>
  );
}

/** A value that is shared with other stages — shown as a linked reference */
function Linked({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#f25b2a]/25 bg-[#fff6f0] px-2 py-0.5 font-medium text-zinc-900 dark:bg-[#f25b2a]/10 dark:text-white">
      <Link2 className="h-3.5 w-3.5 text-[#f25b2a]" aria-hidden="true" />
      {children}
    </span>
  );
}

function Header({ title, meta, badge }: { title: string; meta: string; badge: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4 dark:border-zinc-800 sm:px-6">
      <div>
        <p className="text-lg font-semibold leading-tight text-zinc-900 dark:text-white">{title}</p>
        <p className="mt-0.5 text-[16px] text-zinc-500 dark:text-zinc-400">{meta}</p>
      </div>
      {badge}
    </div>
  );
}

function Fields({ rows }: { rows: [string, React.ReactNode][] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
      {rows.map(([k, v]) => (
        <div key={k}>
          <dt className="text-[16px] text-zinc-500 dark:text-zinc-400">{k}</dt>
          <dd className="mt-1 text-[16px] text-zinc-900 dark:text-white">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Footnote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-auto flex items-center gap-2 border-t border-zinc-100 px-5 py-3 text-[16px] text-zinc-600 dark:border-zinc-800 dark:text-zinc-300 sm:px-6">
      <span className="h-1.5 w-1.5 rounded-full bg-[#f25b2a]" aria-hidden="true" />
      {children}
    </div>
  );
}

function CustomerView() {
  return (
    <>
      <Header title="New customer activity" meta="Today · 09:41" badge={<Badge tone="warning">New order</Badge>} />
      <div className="flex items-center gap-3 px-5 pt-5 sm:px-6">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fde3d7] text-[16px] font-semibold text-[#b8441d] dark:bg-[#f25b2a]/20 dark:text-[#ff9b73]">
          AM
        </span>
        <div className="min-w-0">
          <p className="text-[16px] font-semibold text-zinc-900 dark:text-white">{STORY.customer}</p>
          <p className="flex min-w-0 items-center gap-1.5 text-[16px] text-zinc-500 dark:text-zinc-400">
            <Mail className="h-4 w-4 shrink-0" aria-hidden="true" /> <span className="truncate">{STORY.email}</span>
          </p>
        </div>
      </div>
      <Fields
        rows={[
          ["Order", STORY.order],
          ["Item", STORY.item],
        ]}
      />
      <Footnote>Customer context created</Footnote>
    </>
  );
}

function OrderView() {
  return (
    <>
      <Header title={`Order ${STORY.order}`} meta="Placed today · 09:42" badge={<Badge>Processing</Badge>} />
      <Fields rows={[["Customer", <Linked key="c">{STORY.customer}</Linked>], ["Placed", "Today, 09:42"]]} />
      <div className="mx-5 mb-5 overflow-hidden rounded-[8px] border border-zinc-200 dark:border-zinc-800 sm:mx-6">
        <table className="w-full text-left text-[16px]">
          <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-2 font-normal">Item</th>
              <th className="py-2 text-right font-normal">Qty</th>
              <th className="px-4 py-2 text-right font-normal">Price</th>
            </tr>
          </thead>
          <tbody className="text-zinc-900 dark:text-white">
            <tr className="border-t border-zinc-100 dark:border-zinc-800">
              <td className="px-4 py-2.5 font-medium">{STORY.item}</td>
              <td className="py-2.5 text-right tabular-nums">1</td>
              <td className="px-4 py-2.5 text-right tabular-nums">{STORY.amount}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Footnote>Same customer, now with an order</Footnote>
    </>
  );
}

function InventoryView() {
  return (
    <>
      <Header title={STORY.item} meta={`SKU ${STORY.sku}`} badge={<Badge tone="success">In stock</Badge>} />
      <Fields
        rows={[
          ["Current stock", <span key="s" className="text-[22px] font-semibold tabular-nums">47</span>],
          ["Related order", <Linked key="o">{STORY.order}</Linked>],
        ]}
      />
      <div className="px-5 pb-5 sm:px-6">
        <p className="mb-2 text-[16px] text-zinc-500 dark:text-zinc-400">Recent activity</p>
        <ul className="space-y-2 text-[16px]">
          <li className="flex items-center justify-between gap-3">
            <span className="text-zinc-900 dark:text-white">Order {STORY.order} · 1 unit</span>
            <span className="text-zinc-400">09:43</span>
          </li>
          <li className="flex items-center justify-between gap-3 text-zinc-500 dark:text-zinc-400">
            <span>Stock count updated</span>
            <span className="text-zinc-400">Yesterday</span>
          </li>
        </ul>
      </div>
      <Footnote>The order is visible to operations</Footnote>
    </>
  );
}

function InvoiceView() {
  return (
    <>
      <Header title={`Invoice ${STORY.invoice}`} meta="Due Oct 18" badge={<Badge tone="warning">Awaiting payment</Badge>} />
      <Fields
        rows={[
          ["Customer", <Linked key="c">{STORY.customer}</Linked>],
          ["Order", <Linked key="o">{STORY.order}</Linked>],
        ]}
      />
      <div className="mx-5 mb-5 flex items-center justify-between rounded-[8px] border border-zinc-200 px-4 py-3 text-[16px] dark:border-zinc-800 sm:mx-6">
        <span className="text-zinc-600 dark:text-zinc-300">{STORY.item} × 1</span>
        <span className="text-[22px] font-semibold tabular-nums text-zinc-900 dark:text-white">{STORY.amount}</span>
      </div>
      <Footnote>Billing starts from the same order</Footnote>
    </>
  );
}

function PaymentView() {
  const steps = [
    ["Created", "09:44"],
    ["Sent", "09:45"],
    ["Paid", "09:48"],
  ];
  return (
    <>
      <Header title="Payment status" meta={`${STORY.invoice} · ${STORY.customer}`} badge={<Badge tone="success">Paid</Badge>} />
      <div className="flex items-baseline justify-between px-5 pt-5 sm:px-6">
        <span className="text-[16px] text-zinc-500 dark:text-zinc-400">Amount</span>
        <span className="text-[28px] font-semibold tabular-nums text-zinc-900 dark:text-white">{STORY.amount}</span>
      </div>
      <ol className="flex flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:gap-2 sm:px-6">
        {steps.map(([label, time], i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                i === steps.length - 1
                  ? "bg-[#f25b2a] text-white"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              }`}
            >
              <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <span className="text-[16px] leading-tight">
              <span className="block font-medium text-zinc-900 dark:text-white">{label}</span>
              <span className="text-zinc-400">{time}</span>
            </span>
            {i < steps.length - 1 && <span className="mx-1 hidden h-px flex-1 bg-zinc-200 dark:bg-zinc-700 sm:block" />}
          </li>
        ))}
      </ol>
      <Footnote>Payment status stays with the invoice</Footnote>
    </>
  );
}

function SupportView() {
  const context: [string, React.ReactNode][] = [
    ["Customer", STORY.customer],
    ["Related order", STORY.order],
    ["Related invoice", STORY.invoice],
    ["Payment status", <Badge key="p" tone="success">Paid</Badge>],
  ];
  return (
    <div className="grid h-full grid-cols-1 sm:grid-cols-[1fr_210px]">
      <div className="flex min-w-0 flex-col">
        <Header title="Where can I find my invoice?" meta={`${STORY.customer} · via email · 10:15`} badge={<Badge tone="warning">Open</Badge>} />
        <div className="flex-1 space-y-3 px-5 py-4 text-[16px] sm:px-6">
          <p className="max-w-[90%] rounded-[8px] bg-zinc-100 px-3 py-2 leading-snug text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
            Hi, I paid for order {STORY.order} this morning. Where can I find my invoice?
          </p>
          <p className="ml-auto max-w-[90%] rounded-[8px] border border-zinc-200 px-3 py-2 leading-snug text-zinc-800 dark:border-zinc-700 dark:text-zinc-200">
            Hi Alex — I can see {STORY.invoice} is paid. I&apos;ve sent a copy to your email.
          </p>
        </div>
        <div className="mx-5 mb-4 flex items-center gap-2 rounded-[8px] border border-zinc-200 px-3 py-2 text-[16px] text-zinc-400 dark:border-zinc-700 sm:mx-6">
          <span className="flex-1">Write a reply…</span>
          <Paperclip className="h-4 w-4" aria-hidden="true" />
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#f25b2a] text-white">
            <Send className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
      <aside className="hidden border-l border-zinc-100 bg-zinc-50/70 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900/60 sm:block">
        <p className="mb-3 text-[16px] font-semibold text-zinc-900 dark:text-white">Context</p>
        <dl className="space-y-3 text-[16px]">
          {context.map(([k, v]) => (
            <div key={k}>
              <dt className="text-zinc-500 dark:text-zinc-400">{k}</dt>
              <dd className="mt-0.5 font-medium text-zinc-900 dark:text-white">{v}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}

export const STAGE_VIEWS: Record<StageId, React.ComponentType> = {
  customer: CustomerView,
  order: OrderView,
  inventory: InventoryView,
  invoice: InvoiceView,
  payment: PaymentView,
  support: SupportView,
};
