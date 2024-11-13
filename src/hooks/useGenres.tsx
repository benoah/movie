// hooks/useGenres.ts
import { useState, useEffect, useCallback } from "react";
import { fetchGenres } from "../service/apiService";
import { Genre } from "../types";

// Custom hook for fetching genres
export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch genres
  const getGenres = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const genresData = await fetchGenres("movie");
      setGenres(genresData);
    } catch (error) {
      console.error("Failed to load genres:", error);
      setError("Failed to load genres. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch genres on component mount
  useEffect(() => {
    getGenres();
  }, [getGenres]);

  // Return genres, loading state, and error message
  return { genres, loading, error };
};
