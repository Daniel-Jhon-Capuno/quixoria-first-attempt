import { ReactNode } from "react";
import { NavHeader } from "./nav-header";
import { Footer } from "./footer";
import { Toaster } from "@/components/ui/toaster";
import { HelpWidget } from "@/components/help-widget";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <NavHeader />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
      <Toaster />
      <HelpWidget />
    </div>
  );
}