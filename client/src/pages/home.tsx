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

export default function Home() {
  const { data: books, isLoading, error } = useBooks();
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
        <section className="relative overflow-hidden bg-primary text-primary-foreground py-16 px-4">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-2xl" />

          <div className="container mx-auto relative z-10 text-center max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight leading-tight text-center"
            >
              Welcome back to <span className="text-secondary">Quixoria</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg opacity-90 mb-0 max-w-2xl mx-auto text-center"
            >
              Ready to turn the next page? Explore our collection of cozy digital reads.
            </motion.p>
          </div>
        </section>
      )}

      {/* Book Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-display text-primary">
            {search ? `Results for "${search}"` : "Featured for You"}
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
            <Button variant="link" onClick={() => setSearch("")} className="mt-2 text-primary">
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
      </section>
    </Layout>
  );
}
