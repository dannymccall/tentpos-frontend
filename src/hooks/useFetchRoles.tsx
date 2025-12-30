import { useEffect, useState } from "react";
import type { Role } from "../types/role.types";
import { makeRequest } from "@/lib/helperFunctions";
interface UseFetchRolesResult {
  roles: Role[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetchRoles(): UseFetchRolesResult {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeRequest(
        "/api/roles/get-roles",
        { method: "GET" },
      );

      if (response.status === "error") {
        setError(response.error?.message || "Failed to fetch roles");
        setRoles([]);
      } else {
        setRoles(response.data.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return { roles, loading, error, refetch: fetchRoles };
}
