import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "tenthub-request";
import { useNotification } from "../context/NotificationContext";
import { apiBase } from "@/lib/api";

interface MutationOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  query?: string;
  headers?: Record<string, string>;
  invalidateKey?: string;
  onSuccessCallback?: (response: any) => void;
}

export function useApiMutation({
  url,
  method = "POST",
  body,
  query = "",
  invalidateKey,
  onSuccessCallback,
}: MutationOptions) {
  const queryClient = useQueryClient();
  const { showToast } = useNotification();
  console.log({query})
  const mutation = useMutation({
    mutationFn: async (payload?: any) => {
      const data = payload ?? body;
      const endpoint = query ? `${url}?${query}` : url;
      console.log({endpoint})
      const requestBody =
        method !== "GET"
          ? data instanceof FormData
            ? data
            : JSON.stringify(data)
          : undefined;

      return makeRequest(endpoint, { method,  body: requestBody }, apiBase);
    },
    onSuccess: (response: any) => {
      if (!response || response.status === "error" || response.error) {
        showToast(response?.error?.message ?? "Something went wrong", "error");
        return;
      }

      showToast(response.message ?? "Success", "success");

      if (invalidateKey) {
        queryClient.invalidateQueries({ queryKey: [invalidateKey] });
      }

      onSuccessCallback?.(response);
    },
    onError: (error: any) => {
      showToast(error.message ?? "Something went wrong", "error");
    },
  });

  return {
    ...mutation,
    isPending: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
  };
}
