import { useState, useEffect, useCallback } from "react";
import { fetchUsers } from "../utils/mockApi";
import { User, ApiResponse, FetchOptions } from "../types/api.types";

export const useApi = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (options: FetchOptions = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchUsers(options);
      setData(response.data);
      return response;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};
