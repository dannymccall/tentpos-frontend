import { useEffect, useState } from "react";
import type { Category } from "@/types/category.types";
import { makeRequest } from "@/lib/helperFunctions";

interface UseFetchBranchesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetchCategories(): UseFetchBranchesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeRequest(
        "/api/categories/get-categories",
        { method: "GET" },
      );

      if (response.status === "error") {
        setError(response.error?.message || "Failed to fetch branches");
        setCategories([]);
      } else {
        setCategories(response.data.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return { categories, loading, error, refetch: fetchBranches };
}
