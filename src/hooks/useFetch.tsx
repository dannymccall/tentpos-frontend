import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import { makeRequest } from "@/lib/helperFunctions";

type UseFetchOptions<T> = {
  uri: string;
  limit?: number;
  initialSearch?: string;
  debounceMs?: number;
  service?: string;
  additionalQuery?: string;
  mapResponse?: (res: any) => {
    rows: T[];
    totalPages: number;
    totalItems: number;
    currentPage: number;
  };
};

export function useFetch<T>({
  uri,
  limit = 10,
  initialSearch = "",
  debounceMs = 300,
  mapResponse,
  additionalQuery = "",
}: UseFetchOptions<T>) {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(initialSearch);
  const debouncedSearch = useDebounce(query, debounceMs);

  const { data, error, isLoading, refetch, isFetching }: any = useQuery({
    queryKey: [uri, page, debouncedSearch, limit, additionalQuery],
    queryFn: async () => {
      const res = await makeRequest(
        `${uri}?page=${page}&limit=${limit}&searchTerm=${debouncedSearch}&${additionalQuery}`,
        { method: "GET", cache: "no-store" },
      );

      console.log(res.data.data);

      return mapResponse
        ? mapResponse(res.data.data)
        : {
            rows: res.data.data.rows ?? [],
            totalPages: res.data.data.totalPages ?? 1,
            totalItems: res.data.data.totalItems ?? 0,
            currentPage: res.data.data.currentPage ?? page,
          };
    },
    placeholderData: (prev) => prev, // ✅ helps smooth pagination
    refetchOnWindowFocus: false,
  });

  return {
    data: (data?.rows || data) ?? [],
    totalPages: data?.totalPages ?? 1,
    totalItems: data?.totalItems ?? 0,
    currentPage: data?.currentPage ?? page,
    loading: isLoading || isFetching,
    error,
    setPage,
    handleSearch: setQuery,
    refetch,
    query,
    hasLoaded: !!data,
    setQuery,
  };
}
