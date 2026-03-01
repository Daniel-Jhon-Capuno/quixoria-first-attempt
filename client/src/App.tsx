import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useUser } from "@/hooks/useAuth";
import { lazy, Suspense } from "react";

// Lazy load all pages so a single broken page cannot crash the whole app
const Home       = lazy(() => import("@/pages/home"));
const Library    = lazy(() => import("@/pages/library"));
const BookDetails = lazy(() => import("@/pages/book-details"));
const Profile    = lazy(() => import("@/pages/profile"));
const Reader     = lazy(() => import("@/pages/reader"));
const Checkout   = lazy(() => import("@/pages/checkout"));
const AuthPage   = lazy(() => import("@/pages/auth"));
const Wishlist   = lazy(() => import("@/pages/wishlist"));
const Orders     = lazy(() => import("@/pages/orders"));
const NotFound   = lazy(() => import("@/pages/not-found"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <span className="text-muted-foreground text-sm">Loading...</span>
  </div>
);

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { data: user, isLoading } = useUser();
  if (isLoading) return <PageLoader />;
  if (!user) return <Redirect to="/login" />;
  return <Component />;
}

function Router() {
  const { data: user, isLoading } = useUser();
  if (isLoading) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/login">{user ? <Redirect to="/" /> : <AuthPage />}</Route>

        <Route path="/" component={Home} />
        <Route path="/book/:id" component={BookDetails} />
        <Route path="/wishlist" component={Wishlist} />

        <Route path="/library"><ProtectedRoute component={Library} /></Route>
        <Route path="/profile"><ProtectedRoute component={Profile} /></Route>
        <Route path="/reader/:id"><ProtectedRoute component={Reader} /></Route>
        <Route path="/checkout"><ProtectedRoute component={Checkout} /></Route>
        <Route path="/orders"><ProtectedRoute component={Orders} /></Route>

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;