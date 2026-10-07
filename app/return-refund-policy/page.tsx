import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { loadLegalDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Return-Refund Policy | Foxses",
  description:
    "How refunds and cancellations are handled for Foxses Studio software, SaaS products, digital services and subscriptions.",
  alternates: { canonical: "https://foxses.com/return-refund-policy" },
};

export default function ReturnRefundPolicyPage() {
  const doc = loadLegalDocument("return-refund-policy");
  return <LegalPage doc={doc} eyebrow="Returns & Refunds" visual="refund" titleBreakAfter="Return &" />;
}
