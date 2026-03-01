import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookCard } from "@/components/book-card";
import { Button } from "@/components/ui/button";

interface BookCarouselProps {
  title: string;
  subtitle?: string;
  books: any[];
  isLoading?: boolean;
}

export function BookCarousel({ title, subtitle, books, isLoading }: BookCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  // Mouse drag to scroll
  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.pageX, scrollLeft: scrollRef.current?.scrollLeft ?? 0 };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const dx = e.pageX - dragStart.current.x;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
    updateScrollState();
  };
  const onMouseUp = () => setIsDragging(false);

  if (!isLoading && (!books || books.length === 0)) return null;

  return (
    <div className="relative group">
      {/* Header */}
      <div className="flex items-end justify-between mb-5 px-1">
        <div>
          <h2 className="text-2xl font-bold font-display text-primary">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {/* Scroll buttons — always visible on the right */}
        <div className="flex gap-1.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className={`h-8 w-8 p-0 rounded-full transition-all ${!canScrollLeft ? "opacity-30 pointer-events-none" : ""}`}
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`h-8 w-8 p-0 rounded-full transition-all ${!canScrollRight ? "opacity-30 pointer-events-none" : ""}`}
            onClick={() => scroll("right")}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Carousel Track */}
      <div className="relative">
        {/* Left fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
        )}
        {/* Right fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />
        )}

        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className={`flex gap-5 overflow-x-auto pb-4 scroll-smooth select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading
            ? [...Array(6)].map((_, i) => (
                <div key={i} className="shrink-0 w-44 space-y-2">
                  <div className="h-64 rounded-xl bg-muted animate-pulse" />
                  <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
                </div>
              ))
            : books.map((book, i) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="shrink-0 w-44"
                  // prevent drag from triggering card click
                  onClickCapture={e => isDragging && e.stopPropagation()}
                >
                  <BookCard book={book} />
                </motion.div>
              ))
          }
        </div>
      </div>
    </div>
  );
}