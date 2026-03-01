import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ShoppingCart, Trash2, ShoppingBag, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useCart, useRemoveFromCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { ConfirmDialog } from "@/components/confirm-dialog";

export function CartDrawer() {
  const [open, setOpen] = useState(false);

  // Listen for external "open-cart" events (e.g. from BookCard "In Cart" button)
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-cart", handler);
    return () => window.removeEventListener("open-cart", handler);
  }, []);
  const { user } = useAuth();
  const { data: cartItems = [] } = useCart();
  const removeFromCart = useRemoveFromCart();
  const [, navigate] = useLocation();

  const total = cartItems.reduce((sum: number, item: any) => sum + item.book.price, 0);
  const formattedTotal = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(total / 100);

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      setOpen(false);
      return;
    }
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative rounded-xl h-10 w-10 p-0">
          <ShoppingCart className="h-5 w-5" />
          {cartItems.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full bg-primary text-primary-foreground">
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-primary">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart
            {cartItems.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {cartItems.length} item{cartItems.length > 1 ? "s" : ""}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <ShoppingBag className="w-16 h-16 text-muted-foreground/30" />
              <div>
                <p className="font-medium text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground/70">Browse the store and add some books!</p>
              </div>
              <Button variant="outline" onClick={() => setOpen(false)} asChild>
                <Link href="/">Browse Store</Link>
              </Button>
            </div>
          ) : (
            cartItems.map((item: any) => {
              const price = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(item.book.price / 100);
              return (
                <div key={item.id} className="flex gap-3 p-3 bg-secondary/30 rounded-xl">
                  <img
                    src={item.book.coverUrl}
                    alt={item.book.title}
                    className="w-14 h-20 object-cover rounded-lg shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm line-clamp-2 text-primary">{item.book.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.book.author}</p>
                    <p className="text-sm font-bold text-primary mt-1">{price}</p>
                  </div>
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                        disabled={removeFromCart.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    }
                    title="Remove from Cart"
                    description={`Remove "${item.book.title}" from your cart?`}
                    confirmLabel="Remove"
                    variant="destructive"
                    onConfirm={() => removeFromCart.mutate(item.bookId)}
                  />
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-primary">{formattedTotal}</span>
            </div>

            <ConfirmDialog
              trigger={
                <Button className="w-full rounded-xl py-6 text-lg font-bold">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Checkout
                </Button>
              }
              title="Proceed to Checkout?"
              description={`You have ${cartItems.length} book${cartItems.length > 1 ? "s" : ""} in your cart totalling ${formattedTotal}. Ready to proceed?`}
              confirmLabel="Yes, Checkout"
              onConfirm={handleCheckout}
            />

            <Button variant="outline" className="w-full rounded-xl" asChild>
              <Link href="/orders" onClick={() => setOpen(false)}>
                <Receipt className="w-4 h-4 mr-2" />
                Purchase History
              </Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}