import { useBooks } from "@/hooks/use-books";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart, useAddToCart } from "@/hooks/use-cart";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function WishlistPage() {
  const { data: books, isLoading } = useBooks();
  const { wishlist, toggle } = useWishlist();
  const { data: cartItems = [] } = useCart();
  const addToCart = useAddToCart();
  const [, setLocation] = useLocation();

  const wishlistedBooks = (books ?? []).filter(b => wishlist.includes(b.id));

  return (
    <Layout>
      {/* Header bar */}
      <div className="bg-white/30 border-b py-4">
        <div className="container mx-auto px-4 flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          <span className="text-sm font-bold text-primary uppercase tracking-wider">My Wishlist</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary">Wishlist</h1>
          <p className="text-sm text-muted-foreground">
            {wishlistedBooks.length} saved book{wishlistedBooks.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-primary/5 animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && wishlistedBooks.length === 0 && (
          <div className="text-center py-24 rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5">
            <Heart className="w-14 h-14 text-primary/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">Tap the ♥ on any book to save it for later.</p>
            <Button asChild>
              <Link href="/">Browse Store</Link>
            </Button>
          </div>
        )}

        {/* Book list */}
        {!isLoading && wishlistedBooks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistedBooks.map(book => {
              const inCart = (cartItems as any[]).some(i => i.bookId === book.id);
              const formatted = new Intl.NumberFormat("en-PH", {
                style: "currency", currency: "PHP",
              }).format(book.price / 100);

              return (
                <div key={book.id}
                  className="flex gap-4 p-4 rounded-2xl border border-primary/10 bg-white/60 hover:shadow-md transition-shadow">
                  {/* Cover */}
                  <div
                    className="w-20 shrink-0 cursor-pointer"
                    onClick={() => setLocation(`/book/${book.id}`)}>
                    <img
                      src={book.coverUrl ?? ""}
                      alt={book.title}
                      className="w-full aspect-[2/3] object-cover rounded-xl shadow"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3
                        className="font-bold text-primary leading-tight line-clamp-2 cursor-pointer hover:underline"
                        onClick={() => setLocation(`/book/${book.id}`)}>
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground italic mt-0.5">{book.author}</p>
                      {book.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {Number(book.rating).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-primary">{formatted}</span>
                      <div className="flex gap-1">
                        {/* Remove from wishlist */}
                        <button
                          onClick={() => toggle(book.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Remove from wishlist">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {/* Add to cart */}
                        <button
                          onClick={() => inCart
                            ? window.dispatchEvent(new Event("open-cart"))
                            : addToCart.mutate(book.id)
                          }
                          className={`flex items-center gap-1 px-3 h-8 rounded-lg text-xs font-bold transition-all ${
                            inCart
                              ? "bg-primary/10 text-primary border border-primary/20"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}>
                          <ShoppingCart className="w-3 h-3" />
                          {inCart ? "In Cart" : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}