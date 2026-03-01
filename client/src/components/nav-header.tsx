import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Library, User, LogIn, LogOut, ShoppingBag, Receipt, Heart } from "lucide-react";
import { NotificationsBell } from "@/components/notifications-bell";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { CartDrawer } from "@/components/cart-drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useCart } from "@/hooks/use-cart";
import logoImg from "@/assets/logo1.png";

export function NavHeader() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { data: cartItems = [] } = useCart();
  const cartCount = cartItems.length;

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/",        label: "Store",   icon: <ShoppingBag className="w-4 h-4" /> },
    { href: "/library", label: "Library", icon: <Library className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <img src={logoImg} alt="Quixoria Logo" className="w-full h-full object-contain drop-shadow-sm" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-primary hidden sm:inline">
              Quixoria
            </span>
          </Link>

          {/* Nav + Actions */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Nav links — hidden on mobile (handled by bottom nav) */}
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive(link.href)
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-secondary hover:text-primary"
                  }`}>
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="hidden sm:block h-6 w-px bg-border mx-1" />

            <div className="flex items-center gap-2">

              {/* Notifications */}
              {user && <NotificationsBell />}

              {/* Wishlist */}
              {user && (
                <Link href="/wishlist"
                  className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors relative ${isActive("/wishlist") ? "bg-secondary" : ""}`}
                  title="Wishlist">
                  <Heart className={`w-5 h-5 ${isActive("/wishlist") ? "text-red-500 fill-red-500" : "text-muted-foreground hover:text-red-500"}`} />
                </Link>
              )}

              {/* Cart with badge */}
              <div className="relative">
                <CartDrawer />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 z-10 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-[10px] font-black rounded-full flex items-center justify-center px-1 pointer-events-none shadow">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-visible">
                      <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors">
                        <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.firstName?.[0] || user.username?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online dot */}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 mt-2 rounded-xl" align="end" forceMount>
                    {/* User info — no "Online" label */}
                    <div className="flex items-center gap-2 p-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.profileImageUrl || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.firstName?.[0] || user.username?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col leading-none">
                        <p className="font-bold text-sm">
                          {user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.username}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{user.email || user.username}</p>
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
                    <DropdownMenuItem asChild className="rounded-lg m-1">
                      <Link href="/wishlist" className="cursor-pointer w-full flex items-center">
                        <Heart className="mr-2 h-4 w-4 text-red-500" />
                        <span>Wishlist</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg m-1">
                      <Link href="/orders" className="cursor-pointer w-full flex items-center">
                        <Receipt className="mr-2 h-4 w-4" />
                        <span>Order History</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="m-1">
                      <ConfirmDialog
                        trigger={
                          <button className="w-full flex items-center px-2 py-1.5 text-sm rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                          </button>
                        }
                        title="Log Out"
                        description="Are you sure you want to log out of your account?"
                        confirmLabel="Log Out"
                        cancelLabel="Stay"
                        variant="destructive"
                        onConfirm={() => logout()}
                      />
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="rounded-xl px-6 h-10 font-bold">
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around h-16 px-2">
          {navLinks.map(link => {
            const active = isActive(link.href);
            return (
              <Link key={link.href} href={link.href}
                className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}>
                <div className={`p-1.5 rounded-xl transition-all ${active ? "bg-primary/10" : ""}`}>
                  {link.icon}
                </div>
                <span className={`text-[10px] font-bold ${active ? "text-primary" : "text-muted-foreground"}`}>
                  {link.label}
                </span>
              </Link>
            );
          })}

          {/* Cart tab with badge */}
          <button
            className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl text-muted-foreground relative"
            onClick={() => window.dispatchEvent(new Event("open-cart"))}
          >
            <div className="p-1.5 rounded-xl relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-destructive text-destructive-foreground text-[9px] font-black rounded-full flex items-center justify-center px-1">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">Cart</span>
          </button>

          {/* Profile tab */}
          {user ? (
            <Link href="/profile"
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all ${
                isActive("/profile") ? "text-primary" : "text-muted-foreground"
              }`}>
              <div className={`p-1 rounded-xl ${isActive("/profile") ? "bg-primary/10" : ""}`}>
                <Avatar className="h-6 w-6 border border-primary/20">
                  <AvatarImage src={user.profileImageUrl || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                    {user.firstName?.[0] || user.username?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-[10px] font-bold">Profile</span>
            </Link>
          ) : (
            <Link href="/login"
              className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl text-muted-foreground">
              <div className="p-1.5 rounded-xl">
                <LogIn className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold">Sign In</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Spacer so mobile content isn't hidden behind bottom nav */}
      <div className="sm:hidden h-16" />
    </>
  );
}