import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Library, User, LogIn, LogOut, ShoppingBag, Search, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function NavHeader() {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");

  const isActive = (path: string) => location === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setLocation(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:scale-110 transition-transform">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-primary hidden sm:inline">
            Quixoria
          </span>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search books, authors..." 
            className="pl-9 bg-secondary/50 border-transparent focus:bg-background transition-colors rounded-xl h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        {/* User Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <nav className="flex items-center gap-1">
            <Link href="/" className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
              isActive("/") 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-secondary hover:text-primary"
            }`}>
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Store</span>
            </Link>
            
            <Link href="/library" className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
              isActive("/library") 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-secondary hover:text-primary"
            }`}>
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">Library</span>
            </Link>
          </nav>

          <div className="h-6 w-px bg-border hidden sm:block mx-1" />

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="rounded-xl hidden sm:flex items-center gap-2 text-muted-foreground hover:text-primary hover:bg-secondary h-10 px-3">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs font-bold">₱0.00</span>
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-visible">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.firstName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mt-2 rounded-xl" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImageUrl || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.firstName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-bold text-sm">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">Online</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-lg m-1">
                    <Link href="/profile" className="cursor-pointer w-full flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg m-1">
                    <Link href="/library" className="cursor-pointer w-full flex items-center">
                      <Library className="mr-2 h-4 w-4" />
                      <span>My Library</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer rounded-lg m-1">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="rounded-xl px-6 h-10 font-bold">
                <a href="/api/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
