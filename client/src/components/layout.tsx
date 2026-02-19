import { ReactNode } from "react";
import { NavHeader } from "./nav-header";
import { Toaster } from "@/components/ui/toaster";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <NavHeader />
      <main className="flex-1 w-full">
        {children}
      </main>
      <footer className="border-t py-8 bg-white/30 text-center text-sm text-muted-foreground mt-auto">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Quixoria. Your cozy corner for digital reading.</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
