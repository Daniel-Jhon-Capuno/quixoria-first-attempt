import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, { credentials: "include", ...options });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => fetchJSON("/api/cart"),
    retry: false,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (bookId: number) =>
      fetchJSON("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Added to Cart", description: "Book added to your cart!" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useRemoveFromCart() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (bookId: number) =>
      fetchJSON(`/api/cart/remove/${bookId}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast({ title: "Removed", description: "Book removed from cart." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useCheckout() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: () =>
      fetchJSON("/api/orders/checkout", { method: "POST" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["/api/library"] });
    },
    onError: (err: Error) => {
      toast({ title: "Checkout failed", description: err.message, variant: "destructive" });
    },
  });
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => fetchJSON("/api/orders"),
    retry: false,
  });
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => fetchJSON(`/api/orders/${id}`),
    enabled: !!id,
    retry: false,
  });
}