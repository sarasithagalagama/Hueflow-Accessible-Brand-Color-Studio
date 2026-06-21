import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export function useAuth() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["auth"], queryFn: api.me });
  const login = useMutation({
    mutationFn: api.login,
    onSuccess: (user) => queryClient.setQueryData(["auth"], user)
  });
  const register = useMutation({
    mutationFn: api.register,
    onSuccess: (user) => queryClient.setQueryData(["auth"], user)
  });
  const logout = useMutation({
    mutationFn: api.logout,
    onSuccess: () => queryClient.setQueryData(["auth"], null)
  });
  return { user: query.data, isLoading: query.isLoading, login, register, logout };
}
