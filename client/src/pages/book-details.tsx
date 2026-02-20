import { useRoute, useLocation } from "wouter";
import { useBook, useReviews, useAddToLibrary, useCreateReview } from "@/hooks/use-books";
import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, User, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function BookDetails() {
  const [, params] = useRoute("/book/:id");
  const [, setLocation] = useLocation();
  const id = parseInt(params?.id || "0");
  const { user } = useAuth();
  const { data: book, isLoading } = useBook(id);
  const { data: reviews, isLoading: reviewsLoading } = useReviews(id);
  const addToLibrary = useAddToLibrary();
  const createReview = useCreateReview();
  const { toast } = useToast();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <Skeleton className="h-[500px] w-full rounded-xl" />
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
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
        </div>
      </Layout>
    );
  }

  const handleReviewSubmit = () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please login to leave a review.", variant: "destructive" });
      return;
    }
    createReview.mutate({ bookId: id, rating, comment });
    setComment("");
  };

  const formattedPrice = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(book.price / 100);

  const handleBuyClick = () => {
    if (!user) {
      window.location.href = '/api/login';
      return;
    }
    setLocation(`/checkout/${book.id}`);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-b from-white to-background pb-12">
        {/* Book Header Background Blur */}
        <div className="relative h-64 w-full overflow-hidden">
          <img 
            src={book.coverUrl} 
            className="w-full h-full object-cover blur-xl opacity-30 transform scale-110"
            alt="background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start">
            {/* Cover Image */}
            <div className="rounded-xl overflow-hidden shadow-2xl ring-4 ring-white/50">
              <img src={book.coverUrl} alt={book.title} className="w-full h-auto object-cover" />
            </div>

            {/* Book Info */}
            <div className="pt-8 md:pt-32 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{book.genre}</Badge>
                  <div className="flex items-center text-yellow-500 text-sm font-bold">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    {book.rating?.toFixed(1) || "New"}
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-2 leading-tight">
                  {book.title}
                </h1>
                <p className="text-xl text-muted-foreground font-serif-book italic">by {book.author}</p>
              </div>

              <div className="bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-primary/5 shadow-sm">
                <p className="text-lg leading-relaxed text-foreground/90 font-serif-book">
                  {book.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="text-3xl font-bold text-primary mr-4">
                  {formattedPrice}
                </div>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-lg px-8 shadow-lg shadow-primary/20 hover:shadow-primary/30"
                  onClick={handleBuyClick}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-16 max-w-4xl">
            <h2 className="text-2xl font-bold font-display text-primary mb-8 flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              Community Reviews
            </h2>

            {user && (
              <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
                <h3 className="font-bold mb-4">Write a Review</h3>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-colors ${rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-4 bg-background"
                />
                <Button onClick={handleReviewSubmit} disabled={createReview.isPending}>
                  {createReview.isPending ? "Posting..." : "Post Review"}
                </Button>
              </div>
            )}

            <div className="space-y-6">
              {reviewsLoading ? (
                <div className="space-y-4">
                   <Skeleton className="h-24 w-full rounded-xl" />
                   <Skeleton className="h-24 w-full rounded-xl" />
                </div>
              ) : reviews?.length === 0 ? (
                <p className="text-muted-foreground italic">No reviews yet. Be the first to review!</p>
              ) : (
                reviews?.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-xl border border-primary/5 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <span className="font-bold text-sm">User</span>
                      </div>
                      <div className="flex text-yellow-500 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 fill-none'}`} />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground mt-2">{review.comment}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
