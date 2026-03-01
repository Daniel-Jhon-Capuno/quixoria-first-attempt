import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBooks } from "@/hooks/use-books";
import { useWishlist } from "@/hooks/use-wishlist";
import { useAddToCart, useCart } from "@/hooks/use-cart";
import { useLocation } from "wouter";

// Deterministic sale: rotates every 6 hours based on time
function getSaleBook(books: any[]) {
  if (!books.length) return null;
  const slot = Math.floor(Date.now() / (1000 * 60 * 60 * 6));
  return books[slot % books.length];
}

// Time remaining until next 6-hour slot
function getTimeLeft() {
  const slotMs = 1000 * 60 * 60 * 6;
  const now = Date.now();
  return slotMs - (now % slotMs);
}

function pad(n: number) { return String(n).padStart(2, "0"); }

interface FlashSaleBannerProps {
  ownedBookIds: Set<number>;
}

export function FlashSaleBanner({ ownedBookIds }: FlashSaleBannerProps) {
  const { data: books } = useBooks();
  const { data: cartItems = [] } = useCart();
  const addToCart = useAddToCart();
  const [, setLocation] = useLocation();
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  const eligibleBooks = useMemo(
    () => books?.filter(b => !ownedBookIds.has(b.id)) ?? [],
    [books, ownedBookIds]
  );
  const saleBook = useMemo(() => getSaleBook(eligibleBooks), [eligibleBooks]);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(t);
  }, []);

  if (dismissed || !saleBook) return null;

  const hours   = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const originalPrice = saleBook.price;
  const salePrice     = Math.round(originalPrice * 0.7); // 30% off
  const formatPrice   = (p: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(p / 100);

  const isInCart = cartItems.some((i: any) => i.bookId === saleBook.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7D3B25 0%, #a0522d 50%, #7D3B25 100%)" }}
      >
        {/* Animated shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />

        <div className="container mx-auto px-4 py-3 flex items-center gap-4 flex-wrap justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-400 text-yellow-900 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0 animate-bounce">
              <Zap className="w-3 h-3" /> FLASH SALE
            </div>
            <div className="flex items-center gap-3">
              <img src={saleBook.coverUrl} alt={saleBook.title}
                className="w-8 h-11 object-cover rounded shadow-md shrink-0 hidden sm:block" />
              <div>
                <p className="text-white font-bold text-sm line-clamp-1">{saleBook.title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300 font-black text-sm">{formatPrice(salePrice)}</span>
                  <span className="text-white/50 line-through text-xs">{formatPrice(originalPrice)}</span>
                  <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-1.5 rounded">30% OFF</span>
                </div>
              </div>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-xs hidden sm:block">Ends in</span>
            <div className="flex items-center gap-1">
              {[pad(hours), pad(minutes), pad(seconds)].map((unit, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="bg-white/20 text-white font-black text-sm px-2 py-0.5 rounded-lg min-w-[32px] text-center tabular-nums">
                    {unit}
                  </span>
                  {i < 2 && <span className="text-white/60 font-bold">:</span>}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <Button size="sm"
              className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black rounded-xl shadow-lg"
              onClick={() => isInCart ? setLocation("/checkout") : addToCart.mutate(saleBook.id)}>
              <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
              {isInCart ? "In Cart" : "Grab Deal"}
            </Button>
            <button onClick={() => setDismissed(true)}
              className="text-white/50 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}