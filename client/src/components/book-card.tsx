import { Link } from "wouter";
import { Book } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, Check } from "lucide-react";
import { useLibrary, useAddToLibrary } from "@/hooks/use-books";
import { useAuth } from "@/hooks/use-auth";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const { user } = useAuth();
  const { data: library } = useLibrary();
  const addToLibrary = useAddToLibrary();
  
  const isOwned = library?.some(item => item.bookId === book.id);
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(book.price / 100);

  return (
    <div className="group relative h-full">
      <Card className="h-full overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/50 backdrop-blur-sm">
        <Link href={`/book/${book.id}`}>
          <div className="aspect-[2/3] w-full overflow-hidden bg-muted relative cursor-pointer">
            {/* Overlay Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-4">
               <span className="text-white font-medium text-sm">View Details</span>
            </div>
            
            <img
              src={book.coverUrl}
              alt={book.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        <CardContent className="p-4">
          <div className="flex items-center gap-1 text-yellow-500 mb-2">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-medium text-muted-foreground pt-0.5">
              {book.rating ? book.rating.toFixed(1) : "New"}
            </span>
          </div>
          
          <Link href={`/book/${book.id}`}>
            <h3 className="font-display font-bold text-lg leading-tight mb-1 text-primary hover:text-primary/80 transition-colors cursor-pointer line-clamp-1" title={book.title}>
              {book.title}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{book.author}</p>
          <div className="flex gap-2 mb-3">
             <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
               {book.genre}
             </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
          <span className="font-bold text-lg text-primary">{formattedPrice}</span>
          
          {isOwned ? (
            <Button variant="secondary" size="sm" className="pointer-events-none opacity-80" disabled>
              <Check className="w-4 h-4 mr-1" /> Owned
            </Button>
          ) : (
            <Button 
              size="sm" 
              className="rounded-lg shadow-md hover:shadow-lg transition-all"
              onClick={() => user ? addToLibrary.mutate(book.id) : window.location.href = '/api/login'}
              disabled={addToLibrary.isPending}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {addToLibrary.isPending ? "Adding..." : "Buy"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
