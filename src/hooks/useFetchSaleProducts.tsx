import { useEffect, useState } from "react";
import { makeRequest } from "tenthub-request";
import type { Branch } from "../types/branch.type";
import { apiBase } from "@/lib/api";
import type { Category } from "@/types/category.types";
import type { Product } from "@/types/product.types";

interface UseFetchSaleResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetchSaleProducts(
  query?: string,
  categoryId?: number | "ALL"
): UseFetchSaleResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSaleProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeRequest(
        `/api/products/fetch-sale-products?${query ? `search=${query}&` : ""}${
          categoryId ? `categoryId=${categoryId}` : ""
        }`,
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
    fetchSaleProducts();
  }, [query, categoryId]);

  return { products, loading, error, refetch: fetchSaleProducts };
}
