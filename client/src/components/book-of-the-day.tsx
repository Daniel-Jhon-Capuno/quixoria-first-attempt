import { useMemo } from "react";
import { motion } from "framer-motion";
import { Star, ShoppingCart, BookOpen, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooks, useLibrary } from "@/hooks/use-books";
import { useAddToCart, useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Rotates daily — same book all day, new one tomorrow
function getDailyBook(books: any[]) {
  if (!books.length) return null;
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return books[dayIndex % books.length];
}

interface BookOfTheDayProps {
  ownedBookIds: Set<number>;
}

export function BookOfTheDay({ ownedBookIds }: BookOfTheDayProps) {
  const { data: books } = useBooks();
  const { data: library } = useLibrary();
  const { data: cartItems = [] } = useCart();
  const addToCart = useAddToCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const eligibleBooks = useMemo(
    () => books?.filter(b => !ownedBookIds.has(b.id)) ?? [],
    [books, ownedBookIds]
  );

  const book = useMemo(() => getDailyBook(eligibleBooks), [eligibleBooks]);

  if (!book) return null;

  const isInCart  = cartItems.some((i: any) => i.bookId === book.id);
  const wishlisted = isWishlisted(book.id);
  const formatted = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(book.price / 100);

  const handleAddToCart = () => {
    if (!user) { setLocation("/login"); return; }
    addToCart.mutate(book.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border-2 border-primary/15 shadow-xl"
      style={{ background: "linear-gradient(135deg, #FBEFD7 0%, #f0d9b5 50%, #FBEFD7 100%)" }}
    >
      {/* Blurred cover bg */}
      <div className="absolute inset-0">
        <img src={book.coverUrl} className="w-full h-full object-cover blur-3xl opacity-15 scale-110" alt="" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 p-8 md:p-10 items-center">
        {/* Cover */}
        <div className="shrink-0 relative">
          <div className="absolute inset-0 blur-xl opacity-40 rounded-2xl scale-95"
            style={{ background: "#7D3B25" }} />
          <img src={book.coverUrl} alt={book.title}
            className="relative w-40 h-56 md:w-52 md:h-72 object-cover rounded-2xl shadow-2xl ring-4 ring-white/60" />
          {/* Wishlist heart on cover */}
          <button
            onClick={() => toggle(book.id)}
            className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${
              wishlisted ? "bg-red-500 text-white scale-110" : "bg-white/80 text-muted-foreground hover:bg-white hover:text-red-500"
            }`}>
            <Heart className={`w-4 h-4 ${wishlisted ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          {/* Label */}
          <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
            <Sparkles className="w-4 h-4" style={{ color: "#7D3B25" }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: "#7D3B25" }}>
              Book of the Day
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: "#7D3B2520", color: "#7D3B25" }}>
              {book.genre}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black leading-tight mb-2" style={{ color: "#7D3B25" }}>
            {book.title}
          </h2>
          <p className="text-lg italic mb-4 text-muted-foreground">by {book.author}</p>

          {/* Stars */}
          {book.rating && (
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= Math.round(Number(book.rating)) ? "fill-yellow-400 text-yellow-400" : "fill-yellow-100 text-yellow-100"}`} />
                ))}
              </div>
              <span className="text-sm font-bold" style={{ color: "#7D3B25" }}>{Number(book.rating).toFixed(1)}</span>
            </div>
          )}

          <p className="text-sm leading-relaxed text-foreground/70 mb-6 line-clamp-3 max-w-lg">
            {book.description}
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
            <span className="text-3xl font-black" style={{ color: "#7D3B25" }}>{formatted}</span>

            {isInCart ? (
              <Button size="lg" variant="outline" className="rounded-xl border-primary text-primary font-bold"
                onClick={() => window.dispatchEvent(new Event("open-cart"))}>
                <ShoppingCart className="w-4 h-4 mr-2" /> In Cart
              </Button>
            ) : (
              <ConfirmDialog
                trigger={
                  <Button size="lg" className="rounded-xl font-bold px-8 shadow-lg"
                    disabled={addToCart.isPending}>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {addToCart.isPending ? "Adding…" : "Add to Cart"}
                  </Button>
                }
                title="Add to Cart?"
                description={`Add "${book.title}" by ${book.author} to your cart for ${formatted}?`}
                confirmLabel="Add to Cart"
                onConfirm={handleAddToCart}
              />
            )}
            <Button size="lg" variant="ghost" className="rounded-xl"
              onClick={() => setLocation(`/book/${book.id}`)}>
              <BookOpen className="w-4 h-4 mr-2" /> Details
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}