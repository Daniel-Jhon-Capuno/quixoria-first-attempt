import { useBooks } from "@/hooks/use-books";
import { Layout } from "@/components/layout";
import { BookCard } from "@/components/book-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import windmillImg from "@assets/Windmill-removebg-preview.png_1_1771580321179.png";

export default function Home() {
  const { data: books, isLoading, error } = useBooks();
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [location] = useLocation();

  // Sync search from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearch(searchParam);
    }
  }, [location]);

  const filteredBooks = books?.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) || 
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.genre.toLowerCase().includes(search.toLowerCase())
  );

  const recommendedBooks = books?.filter(b => (b.rating || 0) >= 4).slice(0, 5);
  const seasonalBooks = books?.filter(b => ["Classic", "Fiction"].includes(b.genre)).slice(0, 5);
  const genreRelatedBooks = books?.filter(b => b.genre === "Fantasy").slice(0, 5);

  return (
    <Layout>
      {/* Search Header (Local Navigation) */}
      <div className="bg-white/50 border-b py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Browse Store</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['All', 'Classic', 'Dystopian', 'Fiction', 'Romance', 'Fantasy'].map((genre) => (
              <Button 
                key={genre} 
                variant={search === (genre === 'All' ? '' : genre) ? "default" : "ghost"}
                size="sm"
                className="rounded-xl h-8 px-4"
                onClick={() => setSearch(genre === 'All' ? "" : genre)}
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
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      {!search && (
        <section className="container mx-auto px-4 py-8">
          <div className="bg-[#FBEFD7] border-[#7D3B25] border rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="relative z-10 flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-[#7D3B25] mb-4">
                Hello, {user?.firstName || "Reader"}!
              </h1>
              <p className="text-xl md:text-2xl text-[#7D3B25] font-serif-book mb-8">
                Start your reading adventure<br />
                here in Quixoria!
              </p>
              <Button 
                className="bg-[#7D3B25] hover:bg-[#632f1d] text-white rounded-xl px-8 py-6 text-lg font-bold shadow-lg shadow-[#7D3B25]/20"
                onClick={() => {
                  const featuredSection = document.getElementById('featured-books');
                  featuredSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Show Suggestion
              </Button>
            </div>
            
            <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0">
              <img 
                src={windmillImg} 
                alt="Windmill" 
                className="w-full h-full object-contain opacity-90"
              />
            </div>
          </div>
        </section>
      )}

      {/* Book Grid */}
      <section id="featured-books" className="container mx-auto px-4 py-12">
        {search ? (
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
                <p className="text-muted-foreground">Please try refreshing the page later.</p>
              </div>
            ) : filteredBooks?.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-muted-foreground font-medium">No books found matching your search.</p>
            <Button variant="outline" onClick={() => setSearch("")} className="mt-2 text-primary">
              View all books
            </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredBooks?.map((book, i) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <BookCard book={book} />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-16">
            {/* Recommended for You */}
            {user && recommendedBooks && recommendedBooks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-display text-primary">Recommended for you</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {recommendedBooks.map((book, i) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <BookCard book={book} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Seasonal Picks */}
            {seasonalBooks && seasonalBooks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-display text-primary">Seasonal Picks</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {seasonalBooks.map((book, i) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <BookCard book={book} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Based on your searches */}
            {user && genreRelatedBooks && genreRelatedBooks.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-display text-primary">Because you like Fantasy</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {genreRelatedBooks.map((book, i) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <BookCard book={book} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* All Books */}
            {!isLoading && books && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold font-display text-primary">All Books</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {books.map((book, i) => (
                    <motion.div
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <BookCard book={book} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
}
