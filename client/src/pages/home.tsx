import { useBooks, useLibrary } from "@/hooks/use-books";
import { Layout } from "@/components/layout";
import { BookCard } from "@/components/book-card";
import { BookCarousel } from "@/components/book-carousel";
import { FlashSaleBanner } from "@/components/flash-sale-banner";
import { BookOfTheDay } from "@/components/book-of-the-day";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import logoImg from "@/assets/logo.png";

/** Shuffle an array — new order on every call */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const { data: books, isLoading, error } = useBooks();
  const { data: library } = useLibrary();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [location] = useLocation();

  // Sync search from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("search");
    if (s) setSearch(s);
  }, [location]);

  // Owned book IDs
  const ownedBookIds = useMemo(
    () => new Set(library?.map((item: any) => item.bookId) ?? []),
    [library]
  );

  // Unowned books — base for all suggestions
  const unownedBooks = useMemo(
    () => books?.filter(b => !ownedBookIds.has(b.id)) ?? [],
    [books, ownedBookIds]
  );

  // ── Randomized sections — recalculated once per page load ──
  // useMemo with no deps that change means it runs once on mount
  const sections = useMemo(() => {
    if (!unownedBooks.length) return null;

    // Shuffle the whole pool first
    const pool = shuffle(unownedBooks);

    // Recommended — top rated from shuffled pool
    const recommended = shuffle(
      unownedBooks.filter(b => Number(b.rating || 0) >= 4)
    ).slice(0, 10);

    // Seasonal — Classic or Fiction, randomized
    const seasonal = shuffle(
      unownedBooks.filter(b => ["Classic", "Fiction"].includes(b.genre ?? ""))
    ).slice(0, 10);

    // Find the user's most-read genre from library
    const genreCounts: Record<string, number> = {};
    library?.forEach((item: any) => {
      const g = item.book?.genre;
      if (g) genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
    const favoriteGenre =
      Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Fantasy";

    const becauseYouLike = shuffle(
      unownedBooks.filter(b => b.genre === favoriteGenre)
    ).slice(0, 10);

    // Hidden gems — lower rated but shuffled (discover something new)
    const hiddenGems = shuffle(
      unownedBooks.filter(b => Number(b.rating || 0) < 4)
    ).slice(0, 10);

    // New arrivals — just a random slice of the whole pool
    const newArrivals = pool.slice(0, 10);

    return { recommended, seasonal, becauseYouLike, hiddenGems, newArrivals, favoriteGenre };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!books, !!library]); // only recompute when data first arrives, not on every render

  // Search results — exclude owned books
  const filteredBooks = books
    ?.filter(book => !ownedBookIds.has(book.id))
    .filter(book =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      (book.genre ?? "").toLowerCase().includes(search.toLowerCase())
    );

  return (
    <Layout>
      {/* Search / Genre Filter Bar */}
      <div className="bg-white/50 border-b py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Browse Store</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {["All", "Classic", "Dystopian", "Fiction", "Romance", "Fantasy"].map(genre => (
              <Button
                key={genre}
                variant={search === (genre === "All" ? "" : genre) ? "default" : "ghost"}
                size="sm"
                className="rounded-xl h-8 px-4"
                onClick={() => setSearch(genre === "All" ? "" : genre)}
              >
                {genre}
              </Button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search store..."
              className="pl-9 h-9 rounded-xl border-primary/10 bg-background"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Flash Sale Banner */}
      {!search && <FlashSaleBanner ownedBookIds={ownedBookIds} />}

      {/* Hero */}
      {!search && (
        <section className="container mx-auto px-4 py-8">
          <div className="bg-[#FBEFD7] border-[#7D3B25] border rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="relative z-10 flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-[#7D3B25] mb-4">
                Hello, {user?.firstName || "Reader"}!
              </h1>
              <p className="text-xl md:text-2xl text-[#7D3B25] font-serif-book mb-8">
                Start your reading adventure<br />here in Quixoria!
              </p>
              <Button
                className="bg-[#7D3B25] hover:bg-[#632f1d] text-white rounded-xl px-8 py-6 text-lg font-bold shadow-lg shadow-[#7D3B25]/20"
                onClick={() => document.getElementById("featured-books")?.scrollIntoView({ behavior: "smooth" })}
              >
                Show Suggestions
              </Button>
            </div>
            <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0">
              <img src={logoImg} alt="Quixoria" className="w-full h-full object-contain drop-shadow-lg" />
            </div>
          </div>
        </section>
      )}

      {/* Book Content */}
      <section id="featured-books" className="container mx-auto px-4 py-12">
        {search ? (
          /* ── Search Results ── */
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-display text-primary">
                Results for "{search}"
              </h2>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-[300px] w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-4 w-1/2 rounded" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/20">
                <h3 className="text-xl font-bold text-destructive mb-2">Failed to load books</h3>
                <p className="text-muted-foreground">Please try refreshing the page.</p>
              </div>
            ) : filteredBooks?.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground font-medium">No unowned books found matching your search.</p>
                <Button variant="outline" onClick={() => setSearch("")} className="mt-2 text-primary">View all books</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredBooks?.map((book, i) => (
                  <motion.div key={book.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* ── Carousel Sections ── */
          <div className="space-y-14">

            {/* Book of the Day */}
            <BookOfTheDay ownedBookIds={ownedBookIds} />

            {/* Recommended for You */}
            {user && (
              <BookCarousel
                title="Recommended for You"
                subtitle="Top-rated books you haven't read yet — shuffled fresh for you"
                books={sections?.recommended ?? []}
                isLoading={isLoading}
              />
            )}

            {/* Seasonal Picks */}
            <BookCarousel
              title="Seasonal Picks 🍂"
              subtitle="Classic & Fiction titles — a new order every visit"
              books={sections?.seasonal ?? []}
              isLoading={isLoading}
            />

            {/* Because You Like [genre] */}
            {user && sections?.becauseYouLike && sections.becauseYouLike.length > 0 && (
              <BookCarousel
                title={`Because You Like ${sections.favoriteGenre}`}
                subtitle={`More ${sections.favoriteGenre} picks just for you`}
                books={sections.becauseYouLike}
                isLoading={isLoading}
              />
            )}

            {/* Hidden Gems */}
            {sections?.hiddenGems && sections.hiddenGems.length > 0 && (
              <BookCarousel
                title="Hidden Gems 💎"
                subtitle="Underrated reads worth discovering"
                books={sections.hiddenGems}
                isLoading={isLoading}
              />
            )}

            {/* New Arrivals */}
            <BookCarousel
              title="Explore the Store 🔀"
              subtitle="A random mix — something different every time you visit"
              books={sections?.newArrivals ?? []}
              isLoading={isLoading}
            />

            {/* All Books — static grid at the bottom */}
            {!isLoading && books && (
              <div>
                <div className="flex items-center justify-between mb-5 px-1">
                  <div>
                    <h2 className="text-2xl font-bold font-display text-primary">All Books</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Browse the full collection</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {books.filter(b => !ownedBookIds.has(b.id)).map((book, i) => (
                    <motion.div key={book.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: i * 0.03 }}>
                      <BookCard book={book} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* You own everything */}
            {user && unownedBooks.length === 0 && books && books.length > 0 && (
              <div className="text-center py-12 bg-primary/5 rounded-2xl border border-primary/10">
                <p className="text-2xl mb-2">🎉</p>
                <h3 className="text-lg font-bold text-primary mb-1">You own every book in the store!</h3>
                <p className="text-muted-foreground text-sm">Check back soon for new additions.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
}