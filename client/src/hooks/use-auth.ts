import { useUser, useLogout } from "./useAuth";

export function useAuth() {
  const { data: user, isLoading } = useUser();
  const logoutMutation = useLogout();
  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    logout: () => logoutMutation.mutate(),
  };
}