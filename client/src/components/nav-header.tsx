import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { BookOpen, Library, User, LogIn, LogOut, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function NavHeader() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:scale-110 transition-transform">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-primary">
            StorySteam
          </span>
        </Link>

        {/* Main Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <a className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/") 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-secondary hover:text-primary"
            }`}>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Store
              </div>
            </a>
          </Link>
          
          <Link href="/library">
            <a className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/library") 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-secondary hover:text-primary"
            }`}>
              <div className="flex items-center gap-2">
                <Library className="w-4 h-4" />
                Library
              </div>
            </a>
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {user.firstName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.firstName && <p className="font-medium">{user.firstName} {user.lastName}</p>}
                    {user.email && <p className="w-[200px] truncate text-xs text-muted-foreground">{user.email}</p>}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer w-full">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/library" className="cursor-pointer w-full">
                    <Library className="mr-2 h-4 w-4" />
                    <span>My Library</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30">
              <a href="/api/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
