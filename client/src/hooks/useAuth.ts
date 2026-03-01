import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

export interface AuthUser {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

async function fetchJSON(url: string, options?: RequestInit) {
  const res = await fetch(url, { credentials: "include", ...options });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

export function useUser() {
  return useQuery<AuthUser | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        return await fetchJSON("/api/auth/me");
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  const [, navigate] = useLocation();
  return useMutation({
    mutationFn: (data: { username: string; password: string }) =>
      fetchJSON("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: (user) => {
      qc.setQueryData(["auth", "me"], user);
      navigate("/");
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  const [, navigate] = useLocation();
  return useMutation({
    mutationFn: (data: {
      username: string;
      password: string;
      email?: string;
      firstName?: string;
      lastName?: string;
    }) =>
      fetchJSON("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: (user) => {
      qc.setQueryData(["auth", "me"], user);
      navigate("/");
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const [, navigate] = useLocation();
  return useMutation({
    mutationFn: () => fetchJSON("/api/auth/logout", { method: "POST" }),
    onSuccess: () => {
      qc.setQueryData(["auth", "me"], null);
      qc.clear();
      navigate("/login");
    },
  });
}