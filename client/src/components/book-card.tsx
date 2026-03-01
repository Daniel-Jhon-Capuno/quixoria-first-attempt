import { Link, useLocation } from "wouter";
import { Book } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Check, ShoppingBag } from "lucide-react";
import { useLibrary } from "@/hooks/use-books";
import { useCart, useAddToCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useWishlist } from "@/hooks/use-wishlist";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Heart, Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { user } = useAuth();
  const { data: library } = useLibrary();
  const { data: cartItems = [] } = useCart();
  const addToCart = useAddToCart();
  const [, setLocation] = useLocation();

  const isOwned  = library?.some((item: any) => item.bookId === book.id);
  const isInCart = cartItems?.some((item: any) => item.bookId === book.id);

  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(book.id);
  const [justAdded, setJustAdded] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(book.price / 100);

  const handleCartClick = () => {
    if (!user) { setLocation("/login"); return; }
    addToCart.mutate(book.id, {
      onSuccess: () => {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1800);
      },
    });
  };

  return (
    <div className="group relative h-full">
      <Card className="h-full overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/50 backdrop-blur-sm">
        <Link href={`/book/${book.id}`}>
          <div className="aspect-[2/3] w-full overflow-hidden bg-muted relative cursor-pointer">
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-4">
              <span className="text-white font-medium text-sm">View Details</span>
            </div>
            <img
              src={book.coverUrl}
              alt={book.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Wishlist heart */}
            {!isOwned && (
              <button
                onClick={e => { e.preventDefault(); e.stopPropagation(); toggle(book.id); }}
                className={`absolute top-2 left-2 z-20 w-7 h-7 rounded-full flex items-center justify-center shadow transition-all duration-150 ${
                  wishlisted ? "bg-red-500 text-white scale-110" : "bg-white/70 text-muted-foreground hover:bg-white hover:text-red-500 opacity-0 group-hover:opacity-100"
                }`}>
                <Heart className={`w-3.5 h-3.5 ${wishlisted ? "fill-current" : ""}`} />
              </button>
            )}
            {/* In-cart badge on the cover */}
            {isInCart && !isOwned && (
              <div className="absolute top-2 right-2 z-20 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow">
                In Cart
              </div>
            )}
          </div>
        </Link>

        <CardContent className="p-4">
          <div className="flex items-center gap-1 text-yellow-500 mb-2">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-medium text-muted-foreground pt-0.5">
              {book.rating ? Number(book.rating).toFixed(1) : "New"}
            </span>
          </div>

          <Link href={`/book/${book.id}`}>
            <h3 className="font-display font-bold text-lg leading-tight mb-1 text-primary hover:text-primary/80 transition-colors cursor-pointer line-clamp-1" title={book.title}>
              {book.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{book.author}</p>
          <div className="flex gap-2 mb-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
              {book.genre}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
          <span className="font-bold text-lg text-primary">{formattedPrice}</span>

          {isOwned ? (
            /* Already purchased */
            <Button variant="secondary" size="sm" className="pointer-events-none opacity-80" disabled>
              <Check className="w-4 h-4 mr-1" /> Owned
            </Button>
          ) : isInCart ? (
            /* In cart — icon only to save space, click opens cart drawer */
            <Button
              size="sm"
              variant="outline"
              className="rounded-lg border-primary text-primary hover:bg-primary/5 w-9 h-9 p-0"
              title="In Cart — click to view"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                window.dispatchEvent(new Event("open-cart"));
              }}
            >
              <ShoppingBag className="w-4 h-4" />
            </Button>
          ) : (
            /* Not owned, not in cart */
            <Button
              size="sm"
              className={`rounded-lg shadow-md hover:shadow-lg transition-all min-w-[72px] ${
                justAdded ? "bg-green-500 hover:bg-green-500 border-green-500" : ""
              }`}
              disabled={addToCart.isPending || justAdded}
              onClick={e => { e.preventDefault(); e.stopPropagation(); handleCartClick(); }}
            >
              {addToCart.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : justAdded ? (
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Added!
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <ShoppingCart className="w-4 h-4" /> Buy
                </span>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}