import { useEffect, useState } from "react";
import { makeRequest } from "tenthub-request";
import type { User } from "../types/staff.type";
import { apiBase } from "@/lib/api";
interface UseFetchUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetchUsers(): UseFetchUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await makeRequest(
        "/api/users/get-users",
        { method: "GET" },
        apiBase
      );

      if (response.status === "error") {
        setError(response.error?.message || "Failed to fetch users");
        setUsers([]);
      } else {
        setUsers(response.data.data || []);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
}
