import React from "react";
import { Inbox, LayoutDashboard, MessageSquare, Paperclip, Send, Settings, Users } from "lucide-react";
import { AppShell, Avatar, Badge, Card } from "./ui";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Inbox, label: "Tickets", active: true },
  { icon: Users, label: "Customers" },
  { icon: MessageSquare, label: "Conversations" },
  { icon: Settings, label: "Settings" },
];

const TICKETS = [
  { id: "#2081", subject: "Order arrived damaged", who: "Priya Shah", time: "4m", active: true, status: "Open" },
  { id: "#2079", subject: "Change billing email", who: "Tom Becker", time: "22m", status: "Open" },
  { id: "#2076", subject: "Where is my refund?", who: "Ana Costa", time: "1h", status: "Pending" },
  { id: "#2072", subject: "Account access", who: "Leo Martin", time: "3h", status: "Pending" },
  { id: "#2070", subject: "Update shipping address", who: "Hana Ito", time: "5h", status: "Open" },
  { id: "#2068", subject: "Invoice copy request", who: "Marc Dubois", time: "1d", status: "Pending" },
];

function Filters({ compact }: { compact?: boolean }) {
  return (
    <div className={`flex gap-1 border-b border-zinc-100 dark:border-zinc-800 ${compact ? "px-3" : "px-2"} py-2`}>
      {[
        ["Open", "12"],
        ["Pending", "5"],
        ["Resolved", "34"],
      ].map(([label, count], i) => (
        <span
          key={label}
          className={`flex items-center gap-1 rounded-[6px] px-1.5 py-1 ${
            i === 0
              ? "bg-[#fff6f0] font-medium text-zinc-900 ring-1 ring-[#f25b2a]/30 dark:bg-[#f25b2a]/10 dark:text-white"
              : "text-zinc-500 dark:text-zinc-400"
          }`}
        >
          {label}
          <span className={i === 0 ? "text-[#f25b2a]" : ""}>{count}</span>
        </span>
      ))}
    </div>
  );
}

function Conversation({ compact }: { compact?: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-2.5 dark:border-zinc-800">
        <span className="leading-tight">
          <span className="block font-semibold">Order arrived damaged</span>
          <span className="text-zinc-500 dark:text-zinc-400">#2081 · via email</span>
        </span>
        <Badge tone="warning">Open</Badge>
      </div>
      <div className="flex-1 space-y-3 px-4 py-4">
        <div className="flex gap-2.5">
          <Avatar initials="PS" tone={1} />
          <div className="max-w-[85%] rounded-[8px] bg-zinc-100 px-3 py-2 leading-snug dark:bg-zinc-800">
            Hi, my order #58213 arrived today but the mug is cracked. Can you help?
          </div>
        </div>
        <div className="flex flex-row-reverse gap-2.5">
          <Avatar initials="ME" />
          <div className="max-w-[85%] rounded-[8px] border border-zinc-200 px-3 py-2 leading-snug dark:border-zinc-700">
            Sorry about that, Priya. I&apos;ve started a replacement — you&apos;ll get tracking details shortly.
          </div>
        </div>
        {!compact && (
          <div className="text-center text-zinc-400 dark:text-zinc-500">Status changed to Open · 2m ago</div>
        )}
      </div>
      <div className="m-3 flex items-center gap-2 rounded-[8px] border border-zinc-200 px-3 py-2 text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
        <span className="flex-1">Write a reply…</span>
        <Paperclip className="h-4 w-4" />
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#f25b2a] text-white">
          <Send className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

export default function SupportPreview({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <AppShell product="Support" url="support.foxses.com" nav={NAV} compact>
        <Card>
          <Filters compact />
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {TICKETS.slice(0, 3).map((t) => (
              <li key={t.id} className={`px-4 py-2.5 ${t.active ? "bg-zinc-50 dark:bg-zinc-800/50" : ""}`}>
                <span className="flex justify-between font-medium">
                  {t.subject}
                  <span className="font-normal text-zinc-400">{t.time}</span>
                </span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {t.who} · {t.id}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="mt-3 h-[300px]">
          <Conversation compact />
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell product="Support" url="support.foxses.com" nav={NAV}>
      <div className="grid h-[620px] grid-cols-[280px_1fr_190px] gap-3">
        <Card className="overflow-hidden">
          <Filters />
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {TICKETS.map((t) => (
              <li
                key={t.id}
                className={`relative px-3 py-2.5 leading-tight ${t.active ? "bg-zinc-50 dark:bg-zinc-800/50" : ""}`}
              >
                {t.active && <span className="absolute inset-y-0 left-0 w-[3px] bg-[#f25b2a]" />}
                <span className="flex justify-between gap-2">
                  <span className="truncate font-medium">{t.subject}</span>
                  <span className="shrink-0 text-zinc-400">{t.time}</span>
                </span>
                <span className="mt-0.5 flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                  {t.who}
                  <span>{t.status}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="overflow-hidden">
          <Conversation />
        </Card>

        <div className="flex flex-col gap-3">
          <Card title="Customer">
            <div className="space-y-1 px-4 py-3 leading-tight">
              <span className="flex items-center gap-2.5">
                <Avatar initials="PS" tone={1} />
                <span className="font-medium">Priya Shah</span>
              </span>
              <span className="block pt-2 text-zinc-500 dark:text-zinc-400">priya@email.com</span>
              <span className="block text-zinc-500 dark:text-zinc-400">3 previous tickets</span>
            </div>
          </Card>
          <Card title="Details">
            <dl className="space-y-2 px-4 py-3 leading-tight">
              {[
                ["Status", "Open"],
                ["Priority", "High"],
                ["Assignee", "You"],
                ["Channel", "Email"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <dt className="text-zinc-500 dark:text-zinc-400">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
