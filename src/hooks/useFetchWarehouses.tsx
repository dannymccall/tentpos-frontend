import { useEffect, useState } from "react";
import { makeRequest } from "@/lib/helperFunctions";
import type { Warehouse } from "@/types/warehouse.types";

interface UseFetchWarehousesResult {
  warehouses: Warehouse[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetchWarehouses(): UseFetchWarehousesResult {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeRequest(
        "/api/warehousing/warehouses",
        { method: "GET" },
      );

      if (response.status === "error") {
        setError(response.error?.message || "Failed to fetch warehouses");
        setWarehouses([]);
      } else {
        setWarehouses(response.data.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return { warehouses, loading, error, refetch: fetchWarehouses };
}
