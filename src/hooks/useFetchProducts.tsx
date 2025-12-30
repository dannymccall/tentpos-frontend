import { useEffect, useState } from "react";
import { makeRequest } from "tenthub-request";
import { apiBase } from "@/lib/api";
import type { Product } from "@/types/product.types";

interface UseFetchBranchesResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetchProducts(): UseFetchBranchesResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeRequest(
        "/api/products/get-products",
        { method: "GET" },
        apiBase
      );

      if (response.status === "error") {
        setError(response.error?.message || "Failed to fetch products");
        setProducts([]);
      } else {
        setProducts(response.data.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, refetch: fetchProducts };
}
