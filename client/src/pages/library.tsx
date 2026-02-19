import { useLibrary, useUpdateProgress } from "@/hooks/use-books";
import { Layout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Library } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LibraryPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: libraryItems, isLoading: isLibraryLoading } = useLibrary();
  const updateProgress = useUpdateProgress();
  const [filter, setFilter] = useState("all");

  if (isAuthLoading || isLibraryLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="h-64 bg-muted rounded-xl w-full max-w-4xl mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-primary/10">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-6 opacity-20" />
            <h2 className="text-2xl font-bold text-primary mb-4">Your Library Awaits</h2>
            <p className="text-muted-foreground mb-8">
              Sign in to access your purchased books and track your reading progress.
            </p>
            <Button size="lg" className="w-full" asChild>
              <a href="/api/login">Sign In</a>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const filteredItems = libraryItems?.filter(item => {
    if (filter === "reading") return (item.progress || 0) > 0 && (item.progress || 0) < 100;
    if (filter === "completed") return item.progress === 100;
    if (filter === "favorites") return item.isFavorite;
    return true;
  });

  if (!libraryItems || libraryItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold font-display text-primary mb-8">My Library</h1>
          <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-primary/20">
            <h3 className="text-xl font-medium text-primary mb-2">No books yet</h3>
            <p className="text-muted-foreground mb-6">Start your collection by visiting the store.</p>
            <Link href="/">
              <Button size="lg">Browse Store</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Local Navigation */}
      <div className="bg-white/50 border-b py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Library className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">My Collection</span>
          </div>
          <div className="flex gap-1 bg-secondary/30 p-1 rounded-xl">
            {[
              { id: "all", label: "All" },
              { id: "reading", label: "Reading" },
              { id: "completed", label: "Completed" },
              { id: "favorites", label: "Favorites" }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={filter === tab.id ? "default" : "ghost"}
                size="sm"
                className="rounded-lg h-8 px-4 text-xs"
                onClick={() => setFilter(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold font-display text-primary">
            {filter === "all" ? "All Books" : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </h1>
          <p className="text-muted-foreground">{filteredItems?.length || 0} Books</p>
        </div>

        <div className="space-y-6">
          {filteredItems?.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow border-primary/10">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row h-full">
                    {/* Cover Image */}
                    <div className="w-full sm:w-32 md:w-40 shrink-0">
                      <div className="aspect-[2/3] w-full h-full relative">
                        <img 
                          src={item.book.coverUrl} 
                          alt={item.book.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent sm:hidden" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Link href={`/book/${item.bookId}`}>
                              <h3 className="text-xl font-bold text-primary hover:underline cursor-pointer">
                                {item.book.title}
                              </h3>
                            </Link>
                            <p className="text-muted-foreground">{item.book.author}</p>
                          </div>
                          <Link href={`/book/${item.bookId}`}>
                            <Button variant="outline" size="sm">Details</Button>
                          </Link>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-primary">Reading Progress</span>
                            <span className="text-muted-foreground">{item.progress || 0}%</span>
                          </div>
                          <Progress value={item.progress || 0} className="h-2" />
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                         <Button 
                           onClick={() => {
                             const newProgress = Math.min((item.progress || 0) + 10, 100);
                             updateProgress.mutate({ id: item.id, progress: newProgress });
                           }}
                           className="bg-primary hover:bg-primary/90"
                           disabled={updateProgress.isPending}
                         >
                           <BookOpen className="w-4 h-4 mr-2" />
                           {item.progress === 0 ? "Start Reading" : item.progress === 100 ? "Read Again" : "Continue Reading"}
                         </Button>
                         
                         {item.progress === 100 && (
                            <div className="inline-flex items-center px-3 py-2 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
                              Completed on {item.lastRead ? new Date(item.lastRead).toLocaleDateString() : 'Unknown date'}
                            </div>
                         )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
