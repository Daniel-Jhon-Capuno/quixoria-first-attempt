import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useAuth } from "./use-auth";
import { useToast } from "@/hooks/use-toast";

// Fetch all books
export function useBooks() {
  return useQuery({
    queryKey: [api.books.list.path],
    queryFn: async () => {
      const res = await fetch(api.books.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch books");
      return api.books.list.responses[200].parse(await res.json());
    },
  });
}

// Fetch single book
export function useBook(id: number) {
  return useQuery({
    queryKey: [api.books.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.books.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch book");
      return api.books.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// Fetch user library
export function useLibrary() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: [api.library.list.path],
    queryFn: async () => {
      const res = await fetch(api.library.list.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch library");
      return api.library.list.responses[200].parse(await res.json());
    },
    enabled: isAuthenticated,
  });
}

// Add book to library
export function useAddToLibrary() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (bookId: number) => {
      const res = await fetch(api.library.add.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to add to library");
      }
      return api.library.add.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.library.list.path] });
      toast({
        title: "Added to Library",
        description: "This book is now in your collection.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message === "Unauthorized" ? "Please login first" : "Could not add book",
        variant: "destructive",
      });
    },
  });
}

// Update reading progress
export function useUpdateProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, progress }: { id: number; progress: number }) => {
      const url = buildUrl(api.library.updateProgress.path, { id });
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update progress");
      return api.library.updateProgress.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.library.list.path] });
    },
  });
}

// Fetch reviews for a book
export function useReviews(bookId: number) {
  return useQuery({
    queryKey: [api.reviews.list.path, bookId],
    queryFn: async () => {
      const url = buildUrl(api.reviews.list.path, { bookId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return api.reviews.list.responses[200].parse(await res.json());
    },
    enabled: !!bookId,
  });
}

// Add a review
export function useCreateReview() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ bookId, rating, comment }: { bookId: number; rating: number; comment?: string }) => {
      const url = buildUrl(api.reviews.create.path, { bookId });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to post review");
      return api.reviews.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.reviews.list.path, variables.bookId] });
      toast({ title: "Review Posted", description: "Thanks for sharing your thoughts!" });
    },
  });
}
