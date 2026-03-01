import { useRoute, useLocation } from "wouter";
import { useBook, useReviews, useLibrary, useCreateReview, useBooks } from "@/hooks/use-books";
import { useAuth } from "@/hooks/use-auth";
import { useAddToCart, useCart } from "@/hooks/use-cart";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Star, ShoppingCart, User, MessageSquare,
  BookOpen, ArrowLeft, BookMarked, Check,
  Sparkles, Quote,
} from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { BookCard } from "@/components/book-card";
import { ConfirmDialog } from "@/components/confirm-dialog";

const WARM = "#7D3B25";
const WARM_BG = "#FBEFD7";

export default function BookDetails() {
  const [, params] = useRoute("/book/:id");
  const [, setLocation] = useLocation();
  const id = parseInt(params?.id || "0");
  const { user } = useAuth();

  const { data: book, isLoading } = useBook(id);
  const { data: reviews, isLoading: reviewsLoading } = useReviews(id);
  const { data: library } = useLibrary();
  const { data: allBooks } = useBooks();
  const { data: cartItems = [] } = useCart();
  const addToCart = useAddToCart();
  const createReview = useCreateReview();
  const { toast } = useToast();

  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");

  const isOwned     = library?.some((item: any) => item.bookId === id);
  const isInCart    = cartItems?.some((item: any) => item.bookId === id);
  const libraryItem = library?.find((item: any) => item.bookId === id);

  const similarBooks = allBooks
    ?.filter(b => b.genre === book?.genre && b.id !== id)
    .slice(0, 5);

  if (isLoading) {
    return (
      <Layout>
        <div style={{ backgroundColor: WARM_BG }} className="min-h-screen">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-[300px_1fr] gap-12">
              <Skeleton className="h-[450px] w-full rounded-3xl" />
              <div className="space-y-5 pt-8">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-14 w-3/4 rounded-xl" />
                <Skeleton className="h-6 w-1/3 rounded-xl" />
                <Skeleton className="h-6 w-32 rounded-full" />
                <Skeleton className="h-36 w-full rounded-2xl" />
                <Skeleton className="h-16 w-64 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!book) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Book Not Found</h1>
          <Button className="mt-4" onClick={() => setLocation("/")}>Back to Store</Button>
        </div>
      </Layout>
    );
  }

  const handleReviewSubmit = () => {
    if (!user) { toast({ title: "Login Required", description: "Please login to leave a review.", variant: "destructive" }); return; }
    if (!comment.trim()) { toast({ title: "Empty Review", description: "Please write something before posting.", variant: "destructive" }); return; }
    createReview.mutate({ bookId: id, rating, comment });
    setComment(""); setRating(5);
  };

  const handleAddToCart = () => {
    if (!user) { setLocation("/login"); return; }
    addToCart.mutate(id);
  };

  const formattedPrice = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(book.price / 100);
  const avgRating = reviews?.length
    ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length)
    : book.rating ? Number(book.rating) : null;
  const readingProgress = libraryItem?.readingProgress ?? 0;
  const starLabel = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  return (
    <Layout>
      <div style={{ backgroundColor: WARM_BG }} className="min-h-screen pb-20">

        {/* ── Cinematic Hero ── */}
        <div className="relative h-72 overflow-hidden">
          <img src={book.coverUrl} className="w-full h-full object-cover scale-110 blur-2xl opacity-40" alt="" />
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to bottom, ${WARM_BG}10, ${WARM_BG}80, ${WARM_BG})`
          }} />
          {/* Back button floats over hero */}
          <div className="absolute top-6 left-0 right-0 container mx-auto px-4">
            <Button variant="ghost" size="sm" className="rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50"
              onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Back
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-36 relative z-10">

          {/* ── Main Layout ── */}
          <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">

            {/* Cover — floating card effect */}
            <motion.div
              initial={{ opacity: 0, y: 30, rotateY: -5 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="shrink-0 sticky top-24"
            >
              {/* Book cover with page-edge illusion */}
              <div className="relative">
                {/* Page edge shadow layers */}
                <div className="absolute inset-y-2 -right-1 w-3 rounded-r-sm"
                  style={{ background: `linear-gradient(to right, ${WARM}20, ${WARM}08)` }} />
                <div className="absolute inset-y-3 -right-2 w-2 rounded-r-sm"
                  style={{ background: `linear-gradient(to right, ${WARM}10, transparent)` }} />

                <div className="rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(125,59,37,0.35)] ring-4 ring-white/70">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-auto object-cover" />
                </div>

                {/* Owned ribbon */}
                {isOwned && (
                  <div className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Check className="w-3 h-3" /> Owned
                  </div>
                )}
              </div>

              {/* Price callout box — below cover on mobile / desktop */}
              {!isOwned && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 rounded-2xl p-5 text-center shadow-lg border-2"
                  style={{ backgroundColor: WARM, borderColor: WARM }}
                >
                  <p className="text-white/70 text-xs uppercase tracking-widest font-bold mb-1">Price</p>
                  <p className="text-white text-4xl font-black">{formattedPrice}</p>
                  <p className="text-white/60 text-xs mt-1">Digital Edition · Instant Access</p>

                  <div className="mt-4 space-y-2">
                    {isInCart ? (
                      <>
                        <Button size="lg" variant="outline"
                          className="w-full rounded-xl bg-white/10 border-white/30 text-white hover:bg-white/20" disabled>
                          <Check className="w-4 h-4 mr-2" /> In Cart
                        </Button>
                        <ConfirmDialog
                          trigger={
                            <Button size="lg" className="w-full rounded-xl bg-white text-primary hover:bg-white/90 font-bold">
                              Checkout Now
                            </Button>
                          }
                          title="Proceed to Checkout?"
                          description={`"${book.title}" is in your cart. Ready to complete your purchase?`}
                          confirmLabel="Yes, Checkout"
                          onConfirm={() => setLocation("/checkout")}
                        />
                      </>
                    ) : (
                      <ConfirmDialog
                        trigger={
                          <Button size="lg"
                            className="w-full rounded-xl bg-white text-primary hover:bg-white/90 font-bold shadow-lg"
                            disabled={addToCart.isPending}>
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            {addToCart.isPending ? "Adding..." : "Add to Cart"}
                          </Button>
                        }
                        title="Add to Cart?"
                        description={`Add "${book.title}" by ${book.author} to your cart for ${formattedPrice}?`}
                        confirmLabel="Add to Cart"
                        onConfirm={handleAddToCart}
                      />
                    )}
                  </div>
                </motion.div>
              )}

              {/* Read button if owned */}
              {isOwned && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 space-y-3">
                  <Button size="lg" className="w-full rounded-xl py-6 text-base font-bold"
                    onClick={() => setLocation(`/reader/${book.id}`)}>
                    <BookOpen className="w-5 h-5 mr-2" />
                    {readingProgress === 0 ? "Start Reading" : readingProgress >= 100 ? "Read Again" : `Continue (${readingProgress}%)`}
                  </Button>
                  {readingProgress > 0 && readingProgress < 100 && (
                    <div>
                      <div className="flex justify-between text-xs mb-1.5" style={{ color: WARM }}>
                        <span className="font-medium">Reading Progress</span>
                        <span className="font-black">{readingProgress}%</span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: `${WARM}20` }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${readingProgress}%`, backgroundColor: WARM }} />
                      </div>
                    </div>
                  )}
                  <Button size="lg" variant="outline" className="w-full rounded-xl"
                    onClick={() => setLocation("/library")}>
                    View in Library
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* ── Right Side: Details ── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="pt-2 md:pt-20 space-y-8"
            >
              {/* Genre + badges row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: `${WARM}18`, color: WARM }}>
                  {book.genre}
                </span>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/60 border border-black/5 text-muted-foreground">
                  📖 Digital Edition
                </span>
                {isOwned && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                    <Check className="w-3 h-3" /> In Your Library
                  </span>
                )}
              </div>

              {/* Title — big, bold, with warm accent underline */}
              <div>
                <h1 className="text-5xl md:text-6xl font-display font-black leading-tight mb-3" style={{ color: WARM }}>
                  {book.title}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 max-w-[60px]" style={{ backgroundColor: WARM }} />
                  <p className="text-lg italic font-medium text-muted-foreground">by {book.author}</p>
                </div>
              </div>

              {/* Star rating — prominent display */}
              {avgRating && (
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s}
                        className={`w-6 h-6 ${s <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "fill-yellow-100 text-yellow-200"}`}
                      />
                    ))}
                  </div>
                  <div>
                    <span className="text-2xl font-black" style={{ color: WARM }}>{Number(avgRating).toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground ml-1.5">
                      {reviews?.length > 0 ? `from ${reviews.length} review${reviews.length !== 1 ? "s" : ""}` : "rating"}
                    </span>
                  </div>
                </div>
              )}

              {/* Description — pull quote style */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4" style={{ color: WARM }} />
                  <h3 className="text-xs font-black uppercase tracking-widest" style={{ color: WARM }}>About this Book</h3>
                </div>
                <div className="relative pl-5 rounded-r-2xl rounded-bl-2xl py-5 pr-5"
                  style={{ backgroundColor: `${WARM}0A`, borderLeft: `4px solid ${WARM}` }}>
                  <p className="text-base leading-relaxed text-foreground/80 font-medium">
                    {book.description || "No description available for this book."}
                  </p>
                </div>
              </div>

              {/* Book details strip */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Genre",        value: book.genre, icon: "fi fi-br-book-bookmark" },
                  { label: "Store Rating", value: avgRating ? `${Number(avgRating).toFixed(1)} / 5` : "No ratings yet", icon: "fi fi-br-star" },
                  { label: "Language",     value: "English",  icon: "fi fi-br-globe" },
                ].map(detail => (
                  <div key={detail.label} className="rounded-2xl p-4 text-center border"
                    style={{ backgroundColor: `${WARM}08`, borderColor: `${WARM}20` }}>
                    <div className="flex justify-center mb-2">
                      <i className={`${detail.icon} text-2xl`} style={{ color: WARM }} />
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{detail.label}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: WARM }}>{detail.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Section Divider ── */}
          <div className="flex items-center gap-4 mt-20 mb-10">
            <div className="flex-1 h-px" style={{ backgroundColor: `${WARM}25` }} />
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
              style={{ backgroundColor: `${WARM}15`, color: WARM }}>
              <MessageSquare className="w-4 h-4" />
              Community Reviews
              {reviews?.length > 0 && <span className="bg-white rounded-full px-2 py-0.5 text-xs">{reviews.length}</span>}
            </div>
            <div className="flex-1 h-px" style={{ backgroundColor: `${WARM}25` }} />
          </div>

          {/* ── Reviews ── */}
          <div className="max-w-4xl">

            {/* Write a review */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-6 mb-8 border-2"
                style={{ backgroundColor: `${WARM}0D`, borderColor: `${WARM}25` }}
              >
                <h3 className="font-black text-lg mb-5 flex items-center gap-2" style={{ color: WARM }}>
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  Write a Review
                </h3>

                {/* Animated star picker */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="transition-transform hover:scale-125 active:scale-95">
                        <Star className={`w-9 h-9 transition-all duration-100 ${
                          (hoveredStar || rating) >= star
                            ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                            : "fill-amber-100 text-amber-200"
                        }`} />
                      </button>
                    ))}
                  </div>
                  {(hoveredStar || rating) > 0 && (
                    <span className="text-sm font-bold px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${WARM}18`, color: WARM }}>
                      {starLabel[hoveredStar || rating]}
                    </span>
                  )}
                </div>

                <Textarea
                  placeholder="Share what you loved (or didn't) about this book..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="mb-4 rounded-2xl resize-none border-2"
                  style={{ backgroundColor: `${WARM_BG}`, borderColor: `${WARM}30` }}
                  rows={4}
                />
                <Button onClick={handleReviewSubmit} disabled={createReview.isPending} className="rounded-xl px-6">
                  {createReview.isPending ? "Posting..." : "Post Review"}
                </Button>
              </motion.div>
            )}

            {/* Reviews list */}
            <div className="space-y-4">
              {reviewsLoading ? (
                <>
                  <Skeleton className="h-28 w-full rounded-3xl" />
                  <Skeleton className="h-28 w-full rounded-3xl" />
                </>
              ) : reviews?.length === 0 ? (
                <div className="text-center py-16 rounded-3xl border-2 border-dashed"
                  style={{ borderColor: `${WARM}30`, backgroundColor: `${WARM}06` }}>
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" style={{ color: WARM }} />
                  <p className="font-bold text-lg" style={{ color: WARM }}>No reviews yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Be the first to share your thoughts!</p>
                </div>
              ) : (
                reviews.map((review: any, i: number) => (
                  <motion.div key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-3xl p-6 border"
                    style={{ backgroundColor: `${WARM}09`, borderColor: `${WARM}20` }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: WARM }}>
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm">Reader</p>
                          <p className="text-xs text-muted-foreground">
                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" }) : ""}
                          </p>
                        </div>
                      </div>
                      {/* Star display */}
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, s) => (
                            <Star key={s} className={`w-4 h-4 ${s < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-amber-100 text-amber-100"}`} />
                          ))}
                        </div>
                        <span className="text-xs font-bold" style={{ color: WARM }}>{starLabel[review.rating]}</span>
                      </div>
                    </div>

                    {review.comment && (
                      <div className="relative pl-4">
                        {/* Decorative quote mark */}
                        <Quote className="absolute -top-1 -left-1 w-5 h-5 opacity-20" style={{ color: WARM }} />
                        <p className="text-foreground/75 leading-relaxed text-sm">{review.comment}</p>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* ── Similar Books ── */}
          {similarBooks && similarBooks.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px" style={{ backgroundColor: `${WARM}25` }} />
                <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                  style={{ backgroundColor: `${WARM}15`, color: WARM }}>
                  <BookMarked className="w-4 h-4" />
                  More {book.genre} Books
                </div>
                <div className="flex-1 h-px" style={{ backgroundColor: `${WARM}25` }} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {similarBooks.map((b, i) => (
                  <motion.div key={b.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}>
                    <BookCard book={b} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}