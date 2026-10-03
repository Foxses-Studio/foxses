import React from "react";
import {
  AlignLeft,
  AtSign,
  Calendar,
  ChevronDown,
  ClipboardList,
  FileText,
  Inbox,
  LayoutDashboard,
  Settings,
  Type,
} from "lucide-react";
import { AppShell, Avatar, Badge, Card, PageHeader, PrimaryButton } from "./ui";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: ClipboardList, label: "Forms", active: true },
  { icon: Inbox, label: "Submissions" },
  { icon: FileText, label: "Templates" },
  { icon: Settings, label: "Settings" },
];

const FIELDS = [
  { icon: Type, label: "Full name", type: "Short text" },
  { icon: AtSign, label: "Email address", type: "Email" },
  { icon: ChevronDown, label: "Service needed", type: "Dropdown", selected: true },
  { icon: Calendar, label: "Preferred date", type: "Date" },
  { icon: AlignLeft, label: "Message", type: "Long text" },
];

const SUBMISSIONS = [
  { who: "Nadia Rahman", initials: "NR", when: "2 min ago", what: "Consultation" },
  { who: "James Porter", initials: "JP", when: "18 min ago", what: "Installation" },
  { who: "Lena Fischer", initials: "LF", when: "1 h ago", what: "Consultation" },
  { who: "Omar Haddad", initials: "OH", when: "3 h ago", what: "Maintenance" },
];

function Input({ label, value, select }: { label: string; value?: string; select?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block font-medium">{label}</span>
      <span className="flex h-9 items-center justify-between rounded-[6px] border border-zinc-200 px-3 text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
        {value ?? " "}
        {select && <ChevronDown className="h-4 w-4" />}
      </span>
    </label>
  );
}

export default function FormsPreview({ compact }: { compact?: boolean }) {
  const preview = (
    <Card className={compact ? "" : "h-full"}>
      <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
        <span className="block font-semibold">Customer intake</span>
        <span className="text-zinc-500 dark:text-zinc-400">Live preview</span>
      </div>
      <div className="space-y-3 px-5 py-4">
        <Input label="Full name" value="Jane Cooper" />
        <Input label="Email address" value="jane@company.com" />
        <div className="rounded-[6px] ring-2 ring-[#f25b2a]/40 ring-offset-4 ring-offset-white dark:ring-offset-zinc-900">
          <Input label="Service needed" value="Select an option" select />
        </div>
        {!compact && <Input label="Preferred date" value="DD / MM / YYYY" />}
        <span className="inline-flex h-9 items-center rounded-[6px] bg-[#f25b2a] px-4 font-medium text-white">
          Submit
        </span>
      </div>
    </Card>
  );

  return (
    <AppShell product="Forms" url="forms.foxses.com" nav={NAV} compact={compact}>
      <PageHeader
        title="Customer intake"
        subtitle="Form · Published"
        action={!compact && <PrimaryButton>Share form</PrimaryButton>}
      />

      {compact ? (
        <>
          {preview}
          <Card title="Responses" aside="128 total" className="mt-3">
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {SUBMISSIONS.slice(0, 3).map((s, i) => (
                <li key={s.who} className="flex items-center gap-3 px-4 py-2.5">
                  <Avatar initials={s.initials} tone={i} />
                  <span className="flex-1 font-medium">{s.who}</span>
                  <span className="text-zinc-500 dark:text-zinc-400">{s.when}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      ) : (
        <div className="grid h-[560px] grid-cols-[200px_1fr_220px] gap-3">
          <Card title="Fields">
            <ul className="space-y-1 p-2">
              {FIELDS.map(({ icon: Icon, label, type, selected }) => (
                <li
                  key={label}
                  className={`flex items-center gap-2.5 rounded-[6px] px-2.5 py-2 ${
                    selected
                      ? "bg-[#fff6f0] ring-1 ring-[#f25b2a]/30 dark:bg-[#f25b2a]/10"
                      : ""
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${selected ? "text-[#f25b2a]" : "text-zinc-400"}`}
                    strokeWidth={1.75}
                  />
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate font-medium">{label}</span>
                    <span className="text-zinc-500 dark:text-zinc-400">{type}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {preview}

          <div className="flex flex-col gap-3">
            <div className="rounded-[8px] border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-zinc-500 dark:text-zinc-400">Responses</span>
              <span className="mt-1 block text-[26px] font-semibold leading-none tabular-nums">128</span>
              <span className="mt-1.5 block text-zinc-400 dark:text-zinc-500">12 this week</span>
            </div>
            <Card title="Recent" className="flex-1">
              <ul className="space-y-3 px-4 py-3">
                {SUBMISSIONS.map((s, i) => (
                  <li key={s.who} className="flex items-center gap-2.5">
                    <Avatar initials={s.initials} tone={i} />
                    <span className="min-w-0 leading-tight">
                      <span className="block truncate font-medium">{s.who}</span>
                      <span className="text-zinc-500 dark:text-zinc-400">{s.when}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="px-4 pb-3">
                <Badge tone="muted">Stored in Submissions</Badge>
              </div>
            </Card>
          </div>
        </div>
      )}
    </AppShell>
  );
}
