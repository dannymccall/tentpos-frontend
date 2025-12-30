import { useEffect, useState } from "react";
import type { Supplier } from "@/types/suppliers.types";
import { makeRequest } from "@/lib/helperFunctions";
interface UseFetchBranchesResult {
  suppliers: Supplier[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetchSuppliers(): UseFetchBranchesResult {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeRequest(
        "/api/suppliers",
        { method: "GET" },
      );

      if (response.status === "error") {
        setError(response.error?.message || "Failed to fetch suppliers");
        setSuppliers([]);
      } else {
        setSuppliers(response.data.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return { suppliers, loading, error, refetch: fetchSuppliers };
}
