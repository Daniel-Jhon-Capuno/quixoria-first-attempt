import { useState, useEffect, useCallback } from "react";

const KEY = "quixoria_wishlist";

function safeGetWishlist(): number[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Load from localStorage after mount (avoids SSR issues)
  useEffect(() => {
    setWishlist(safeGetWishlist());
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(wishlist)); } catch {}
  }, [wishlist]);

  const toggle = useCallback((bookId: number) => {
    setWishlist(prev =>
      prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
    );
  }, []);

  const isWishlisted = useCallback((bookId: number) => wishlist.includes(bookId), [wishlist]);

  return { wishlist, toggle, isWishlisted };
}