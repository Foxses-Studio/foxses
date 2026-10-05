import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/home/SiteFooter";
import NotFoundView from "@/components/not-found/NotFoundView";

export const metadata: Metadata = {
  title: "Page not ready yet · Foxses",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Navbar />
      <main className="w-full">
        <NotFoundView />
      </main>
      <SiteFooter />
    </div>
  );
}
