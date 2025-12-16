import { useEffect, useState } from "react";
import { makeRequest } from "tenthub-request";
import type { Branch } from "../types/branch.type";
import { apiBase } from "@/lib/api";

interface UseFetchBranchesResult {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetchBranches(): UseFetchBranchesResult {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeRequest(
        "/api/branches/get-branches",
        { method: "GET" },
apiBase      );

      if (response.status === "error") {
        setError(response.error?.message || "Failed to fetch branches");
        setBranches([]);
      } else {
        setBranches(response.data.data || []);
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

  return { branches, loading, error, refetch: fetchBranches };
}
