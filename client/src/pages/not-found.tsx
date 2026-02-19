import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <AlertTriangle className="h-24 w-24 text-primary opacity-20" />
        </div>
        <h1 className="text-4xl font-bold font-display text-primary">404 Page Not Found</h1>
        <p className="text-muted-foreground text-lg">
          Looks like this page got lost in the library archives. Let's get you back to the reading nook.
        </p>
        <Link href="/">
          <Button size="lg" className="w-full sm:w-auto mt-4">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
