// src/hooks/useRecommendations.ts
import { useState, useEffect, useCallback } from "react";
import {
  fetchMovieRecommendations,
  fetchSeriesRecommendations,
  fetchGenres,
} from "../service/apiService";
import { Recommendation, Genre, TrendingItem } from "../types";

export const useRecommendations = (
  selectedId: number,
  type: "movie" | "tv"
) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data =
        type === "movie"
          ? await fetchMovieRecommendations(selectedId)
          : await fetchSeriesRecommendations(selectedId);

      const recommendationsData: Recommendation[] = data.results.map(
        (item: TrendingItem) => ({
          id: item.id,
          title: item.title || item.name || "Untitled",
          backdrop_path: item.backdrop_path || "",
          release_date: item.release_date || "",
          vote_average: item.vote_average || 0,
          overview: item.overview || "",
          genre_ids: item.genre_ids || [],
          poster_path: item.poster_path || "",
          original_language: item.original_language || "en",
        })
      );

      setRecommendations(recommendationsData);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setError("Failed to fetch recommendations.");
    } finally {
      setLoading(false);
    }
  }, [selectedId, type]);

  const fetchGenresData = useCallback(async () => {
    try {
      const genresData = await fetchGenres(type);
      setGenres(genresData);
    } catch (error) {
      console.error("Failed to fetch genres.", error);
      setError("Failed to fetch genres.");
    }
  }, [type]);

  useEffect(() => {
    fetchRecommendations();
    fetchGenresData();
  }, [fetchRecommendations, fetchGenresData]);

  return { recommendations, genres, loading, error };
};
