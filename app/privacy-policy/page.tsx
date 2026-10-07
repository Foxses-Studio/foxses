import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { loadLegalDocument } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Security | Foxses",
  description:
    "What information Foxses Studio collects, how it is used and protected, and the choices you have regarding your information.",
  alternates: { canonical: "https://foxses.com/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  const doc = loadLegalDocument("privacy-policy");
  return <LegalPage doc={doc} eyebrow="Privacy & Security" visual="privacy" titleBreakAfter="Privacy Policy &" />;
}
