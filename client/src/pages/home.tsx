import { useBooks } from "@/hooks/use-books";
import { Layout } from "@/components/layout";
import { BookCard } from "@/components/book-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Home() {
  const { data: books, isLoading, error } = useBooks();
  const [search, setSearch] = useState("");

  const filteredBooks = books?.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) || 
    book.author.toLowerCase().includes(search.toLowerCase()) ||
    book.genre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20 px-4">
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-black/10 rounded-full blur-2xl" />

        <div className="container mx-auto relative z-10 text-center max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight leading-tight"
          >
            Discover Your Next<br />
            <span className="text-secondary">Great Adventure</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto"
          >
            A curated collection of digital books for the modern reader. 
            Build your library, track your progress, and get lost in stories.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-md mx-auto"
          >
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input 
              type="text"
              placeholder="Search by title, author, or genre..."
              className="pl-10 h-12 rounded-xl bg-white text-foreground shadow-xl border-0 focus-visible:ring-2 focus-visible:ring-secondary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      {/* Book Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold font-display text-primary">
            {search ? `Search Results for "${search}"` : "Featured Collection"}
          </h2>
          <div className="hidden md:flex gap-2">
            {['Fiction', 'Sci-Fi', 'Mystery', 'Romance'].map((genre) => (
              <Button 
                key={genre} 
                variant="outline" 
                size="sm"
                className="rounded-full border-primary/20 hover:border-primary hover:bg-primary/5 text-primary"
                onClick={() => setSearch(genre)}
              >
                {genre}
              </Button>
            ))}
            {search && (
              <Button variant="ghost" size="sm" onClick={() => setSearch("")} className="text-muted-foreground">
                Clear
              </Button>
            )}
          </div>
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
