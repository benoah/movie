import { useState, useEffect, useCallback } from "react";
import { fetchTrendingMovies, fetchGenres } from "../service/apiService";
import { Movie, Genre, TrendingItem } from "../types";

export const useMovies = (timeWindow: "day" | "week") => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTrendingMovies(timeWindow);
      const moviesData: Movie[] = data.results.map((item: TrendingItem) => ({
        id: item.id,
        title: item.title || item.name || "Untitled",
        poster_path: item.poster_path || "",
        backdrop_path: item.backdrop_path || "",
        release_date: item.release_date || "",
        vote_average: item.vote_average || 0,
        overview: item.overview || "",
        genre_ids: item.genre_ids || [],
        original_language: item.original_language || "en",
        production_countries: item.production_countries || [],
      }));
      setMovies(moviesData);
    } catch (error) {
      setError("Failed to fetch movies.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [timeWindow]);

  const fetchGenresData = useCallback(async () => {
    try {
      const genresData = await fetchGenres("movie");
      setGenres(genresData);
    } catch (error) {
      console.error("Failed to fetch genres.", error);
      setError("Failed to fetch genres.");
    }
  }, []);

  useEffect(() => {
    fetchMovies();
    fetchGenresData();
  }, [fetchMovies, fetchGenresData]);

  return { movies, genres, loading, error };
};
