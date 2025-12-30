import { useEffect, useState } from "react";
import type  { Customer } from "@/types/customer.types";
import { makeRequest } from "@/lib/helperFunctions";
interface UseFetchBranchesResult {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetchCustomers(): UseFetchBranchesResult {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeRequest(
        "/api/customers",
        { method: "GET" },
      );

      if (response.status === "error") {
        setError(response.error?.message || "Failed to fetch products");
        setCustomers([]);
      } else {
        setCustomers(response.data.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, loading, error, refetch: fetchCustomers };
}
