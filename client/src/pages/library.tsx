import { useLibrary } from "@/hooks/use-books";
import { Layout } from "@/components/layout";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen, Library, LayoutGrid, LayoutList,
  ArrowUpDown, CheckCircle2, Clock, BookMarked,
  Sparkles, Star,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type Filter = "all" | "reading" | "completed" | "notstarted";
type Sort   = "recent" | "title" | "author" | "progress-asc" | "progress-desc";
type View   = "list" | "grid";

export default function LibraryPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { data: libraryItems, isLoading: isLibraryLoading } = useLibrary();
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort]     = useState<Sort>("recent");
  const [view, setView]     = useState<View>("list");
  const [, setLocation]     = useLocation();

  const isLoading = isAuthLoading || isLibraryLoading;

  // ── Stats ──
  const stats = useMemo(() => {
    if (!libraryItems) return null;
    const total     = libraryItems.length;
    const completed = libraryItems.filter(i => (i.readingProgress ?? 0) >= 100).length;
    const reading   = libraryItems.filter(i => { const p = i.readingProgress ?? 0; return p > 0 && p < 100; }).length;
    const notStart  = libraryItems.filter(i => (i.readingProgress ?? 0) === 0).length;
    const avgProg   = total ? Math.round(libraryItems.reduce((s, i) => s + (i.readingProgress ?? 0), 0) / total) : 0;
    return { total, completed, reading, notStart, avgProg };
  }, [libraryItems]);

  // ── Most recent in-progress book ──
  const continueBook = useMemo(() => {
    if (!libraryItems) return null;
    return libraryItems
      .filter(i => { const p = i.readingProgress ?? 0; return p > 0 && p < 100; })
      .sort((a, b) => (b.readingProgress ?? 0) - (a.readingProgress ?? 0))[0] ?? null;
  }, [libraryItems]);

  // ── Filter + Sort ──
  const displayItems = useMemo(() => {
    if (!libraryItems) return [];
    let items = [...libraryItems];

    // Filter
    items = items.filter(i => {
      const p = i.readingProgress ?? 0;
      if (filter === "reading")    return p > 0 && p < 100;
      if (filter === "completed")  return p >= 100;
      if (filter === "notstarted") return p === 0;
      return true;
    });

    // Sort
    items.sort((a, b) => {
      const pa = a.readingProgress ?? 0;
      const pb = b.readingProgress ?? 0;
      if (sort === "title")         return a.book.title.localeCompare(b.book.title);
      if (sort === "author")        return a.book.author.localeCompare(b.book.author);
      if (sort === "progress-asc")  return pa - pb;
      if (sort === "progress-desc") return pb - pa;
      return (b.id ?? 0) - (a.id ?? 0); // recent = highest ID
    });

    return items;
  }, [libraryItems, filter, sort]);

  // ── Loading ──
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 space-y-6">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
          </div>
        </div>
      </Layout>
    );
  }

  // ── Not logged in ──
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-primary/10">
            <BookOpen className="w-16 h-16 text-primary mx-auto mb-6 opacity-20" />
            <h2 className="text-2xl font-bold text-primary mb-4">Your Library Awaits</h2>
            <p className="text-muted-foreground mb-8">Sign in to access your purchased books and track your reading progress.</p>
            <Button size="lg" className="w-full" asChild><Link href="/login">Sign In</Link></Button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── Empty library ──
  if (!libraryItems || libraryItems.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold font-display text-primary mb-8">My Library</h1>
          <div className="rounded-2xl p-16 text-center border-2 border-dashed border-primary/20 bg-primary/5">
            <BookOpen className="w-16 h-16 text-primary/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">No books yet</h3>
            <p className="text-muted-foreground mb-6">Start your collection by visiting the store.</p>
            <Button size="lg" asChild><Link href="/">Browse Store</Link></Button>
          </div>
        </div>
      </Layout>
    );
  }

  const filterTabs: { id: Filter; label: string; icon: React.ReactNode; count: number }[] = [
    { id: "all",        label: "All",         icon: <Library className="w-3.5 h-3.5" />,      count: stats?.total ?? 0 },
    { id: "reading",    label: "Reading",      icon: <Clock className="w-3.5 h-3.5" />,        count: stats?.reading ?? 0 },
    { id: "completed",  label: "Completed",    icon: <CheckCircle2 className="w-3.5 h-3.5" />, count: stats?.completed ?? 0 },
    { id: "notstarted", label: "Not Started",  icon: <BookMarked className="w-3.5 h-3.5" />,   count: stats?.notStart ?? 0 },
  ];

  return (
    <Layout>
      {/* ── Top bar ── */}
      <div className="bg-white/50 border-b py-4">
        <div className="container mx-auto px-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Library className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">My Collection</span>
          </div>

          <div className="flex gap-1 bg-secondary/30 p-1 rounded-xl flex-wrap">
            {filterTabs.map(tab => (
              <button key={tab.id} onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                {tab.icon}
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  filter === tab.id ? "bg-white/20 text-white" : "bg-secondary text-muted-foreground"
                }`}>{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <Select value={sort} onValueChange={v => setSort(v as Sort)}>
              <SelectTrigger className="h-8 w-44 rounded-xl text-xs gap-1">
                <ArrowUpDown className="w-3 h-3 shrink-0" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="recent">Recently Added</SelectItem>
                <SelectItem value="title">Title A–Z</SelectItem>
                <SelectItem value="author">Author A–Z</SelectItem>
                <SelectItem value="progress-desc">Most Progress</SelectItem>
                <SelectItem value="progress-asc">Least Progress</SelectItem>
              </SelectContent>
            </Select>

            {/* View toggle */}
            <div className="flex bg-secondary/40 rounded-xl p-0.5">
              <button onClick={() => setView("list")} title="List view"
                className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"}`}>
                <LayoutList className="w-4 h-4" />
              </button>
              <button onClick={() => setView("grid")} title="Grid view"
                className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-white shadow-sm text-primary" : "text-muted-foreground"}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* ── Continue Reading Spotlight ── */}
        <AnimatePresence>
          {continueBook && filter === "all" && (
            <motion.div key="spotlight"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="relative overflow-hidden rounded-3xl border-2 border-primary/20 shadow-lg"
                style={{ background: "linear-gradient(135deg, #FBEFD7 0%, #f5e0b8 100%)" }}>
                {/* Blurred bg cover */}
                <div className="absolute inset-0 overflow-hidden">
                  <img src={continueBook.book.coverUrl ?? ""} className="w-full h-full object-cover blur-3xl opacity-20 scale-110" alt="" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8">
                  <img src={continueBook.book.coverUrl ?? ""} alt={continueBook.book.title}
                    className="w-28 h-40 object-cover rounded-xl shadow-2xl shrink-0 ring-4 ring-white/50" />
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-xs font-black uppercase tracking-widest text-primary">Continue Reading</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-primary leading-tight mb-1">
                      {continueBook.book.title}
                    </h2>
                    <p className="text-muted-foreground italic mb-4">by {continueBook.book.author}</p>
                    <div className="mb-5">
                      <div className="flex justify-between text-sm font-medium text-primary/70 mb-1.5">
                        <span>Progress</span>
                        <span className="font-black text-primary">{continueBook.readingProgress}%</span>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden bg-white/50 border border-primary/10">
                        <motion.div className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${continueBook.readingProgress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{100 - (continueBook.readingProgress ?? 0)}% left to finish</p>
                    </div>
                    <Button size="lg" className="rounded-xl font-bold px-8"
                      onClick={() => setLocation(`/reader/${continueBook.bookId}`)}>
                      <BookOpen className="w-5 h-5 mr-2" />
                      Continue Reading
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Header row ── */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold font-display text-primary">
            {filter === "all" ? "All Books" :
             filter === "reading" ? "Currently Reading" :
             filter === "completed" ? "Completed" : "Not Started"}
          </h1>
          <p className="text-sm text-muted-foreground">{displayItems.length} book{displayItems.length !== 1 ? "s" : ""}</p>
        </div>

        {/* ── Empty filter state ── */}
        {displayItems.length === 0 && (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5">
            <BookOpen className="w-12 h-12 text-primary/20 mx-auto mb-3" />
            <p className="font-bold text-primary">No books here yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              {filter === "reading" ? "Start reading a book to see it here." :
               filter === "completed" ? "Finish a book to see it here." :
               "All your books have been started!"}
            </p>
          </div>
        )}

        {/* ── LIST VIEW ── */}
        <AnimatePresence mode="wait">
          {view === "list" && (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="space-y-4">
              {displayItems.map((item, index) => {
                const progress = item.readingProgress ?? 0;
                const statusColor =
                  progress >= 100 ? "bg-green-100 text-green-700 border-green-200" :
                  progress > 0    ? "bg-blue-100 text-blue-700 border-blue-200" :
                                    "bg-secondary text-muted-foreground border-border";
                const statusLabel =
                  progress >= 100 ? "✓ Completed" :
                  progress > 0    ? "📖 Reading" :
                                    "Not Started";
                const actionLabel =
                  progress === 0   ? "Start Reading" :
                  progress >= 100  ? "Read Again" :
                                     "Continue";

                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}>
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border-primary/10 hover:border-primary/30 group">
                      <CardContent className="p-0">
                        <div className="flex">
                          {/* Cover */}
                          <Link href={`/book/${item.bookId}`}>
                            <div className="w-28 md:w-36 shrink-0 relative cursor-pointer overflow-hidden">
                              <img src={item.book.coverUrl ?? ""} alt={item.book.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                style={{ minHeight: "160px" }} />
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10 group-hover:to-black/5 transition-all" />
                            </div>
                          </Link>

                          {/* Details */}
                          <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                            <div>
                              <div className="flex items-start justify-between gap-3 mb-1">
                                <div className="min-w-0">
                                  <Link href={`/book/${item.bookId}`}>
                                    <h3 className="text-lg font-black text-primary hover:underline cursor-pointer leading-tight truncate">
                                      {item.book.title}
                                    </h3>
                                  </Link>
                                  <p className="text-sm text-muted-foreground italic">by {item.book.author}</p>
                                </div>
                                <span className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${statusColor}`}>
                                  {statusLabel}
                                </span>
                              </div>

                              {/* Genre + Rating */}
                              <div className="flex items-center gap-3 mt-2 mb-4">
                                <span className="text-xs px-2 py-0.5 rounded bg-secondary text-secondary-foreground font-medium">
                                  {item.book.genre}
                                </span>
                                {item.book.rating && (
                                  <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-xs font-bold text-muted-foreground">{Number(item.book.rating).toFixed(1)}</span>
                                  </div>
                                )}
                              </div>

                              {/* Progress */}
                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                                  <span className="font-medium">Reading Progress</span>
                                  <span className="font-black text-primary">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" className="rounded-xl"
                                onClick={() => setLocation(`/reader/${item.bookId}`)}>
                                <BookOpen className="w-4 h-4 mr-1.5" />
                                {actionLabel}
                              </Button>
                              <Button size="sm" variant="outline" className="rounded-xl" asChild>
                                <Link href={`/book/${item.bookId}`}>Details</Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* ── GRID VIEW ── */}
          {view === "grid" && (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {displayItems.map((item, index) => {
                const progress = item.readingProgress ?? 0;
                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.04 }}
                    className="group cursor-pointer"
                    onClick={() => setLocation(`/reader/${item.bookId}`)}>
                    <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <img src={item.book.coverUrl ?? ""} alt={item.book.title}
                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300" />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                        <p className="text-white font-bold text-sm line-clamp-2 mb-2">{item.book.title}</p>
                        <Button size="sm" className="w-full rounded-lg text-xs h-7 bg-white text-primary hover:bg-white/90">
                          <BookOpen className="w-3 h-3 mr-1" />
                          {progress === 0 ? "Start" : progress >= 100 ? "Re-read" : "Continue"}
                        </Button>
                      </div>

                      {/* Progress badge */}
                      {progress > 0 && (
                        <div className={`absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded-full shadow ${
                          progress >= 100 ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
                        }`}>
                          {progress >= 100 ? "✓" : `${progress}%`}
                        </div>
                      )}
                    </div>

                    {/* Progress bar under cover */}
                    <div className="mt-2 px-1">
                      <div className="h-1.5 rounded-full overflow-hidden bg-secondary">
                        <div className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate font-medium">{item.book.title}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}