import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Genre, MovieVideosResponse, TrendingResponse, Video } from "../types";

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Check if API key is defined
if (!API_KEY) {
  throw new Error(
    "REACT_APP_TMDB_API_KEY is not defined. Please set it in your .env file."
  );
}

// Create an Axios instance with base URL
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Axios request interceptor to include API key
axiosInstance.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
      api_key: API_KEY,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

// Centralized error handler
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const message = axiosError.message;
    console.error(`API request failed with status ${status}: ${message}`);
    throw new Error(`API request failed with status ${status}: ${message}`);
  } else {
    console.error("An unexpected error occurred:", error);
    throw new Error("An unexpected error occurred.");
  }
};

// Helper function for making GET requests
const apiGet = async <T,>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
  // Ensure a return type, though this line should never be reached due to `handleApiError`.
  throw new Error("Unexpected error in apiGet function.");
};

// Fetch trending movies
export const fetchTrendingMovies = (
  timeWindow: "day" | "week" = "week"
): Promise<TrendingResponse> =>
  apiGet<TrendingResponse>(`/trending/movie/${timeWindow}`);

// Fetch top-rated movies
export const fetchTopRatedMovies = (): Promise<TrendingResponse> =>
  apiGet<TrendingResponse>("/movie/top_rated");

// Fetch now playing movies
export const fetchNowPlayingMovies = (
  page = 1,
  language = "en-US",
  region = "US"
): Promise<TrendingResponse> => {
  return apiGet<TrendingResponse>("/movie/now_playing", {
    params: { page, language, region },
  });
};

// Fetch upcoming movies
export const fetchUpcomingMovies = (
  page = 1,
  language = "en-US",
  region = "US"
): Promise<TrendingResponse> => {
  return apiGet<TrendingResponse>("/movie/upcoming", {
    params: { page, language, region },
  });
};

// Fetch movie recommendations
export const fetchMovieRecommendations = (
  movieId: number
): Promise<TrendingResponse> => {
  return apiGet<TrendingResponse>(`/movie/${movieId}/recommendations`);
};

// Fetch similar movies
export const fetchSimilarMovies = (
  movieId: number
): Promise<TrendingResponse> =>
  apiGet<TrendingResponse>(`/movie/${movieId}/similar`);

// Fetch genres
export const fetchGenres = async (type: "movie" | "tv"): Promise<Genre[]> => {
  const data = await apiGet<{ genres: Genre[] }>(`/genre/${type}/list`);
  return data.genres;
};

// Fetch movie videos
export const fetchMovieVideos = async (movieId: number): Promise<Video[]> => {
  const data = await apiGet<MovieVideosResponse>(`/movie/${movieId}/videos`);
  return data.results;
};

// Fetch popular TV series
export const fetchPopularSeries = (): Promise<TrendingResponse> =>
  apiGet<TrendingResponse>("/tv/popular");

// Fetch TV series videos
export const fetchSeriesVideos = async (seriesId: number): Promise<Video[]> => {
  const data = await apiGet<MovieVideosResponse>(`/tv/${seriesId}/videos`);
  return data.results;
};

// Fetch TV series recommendations
export const fetchSeriesRecommendations = (
  seriesId: number
): Promise<TrendingResponse> =>
  apiGet<TrendingResponse>(`/tv/${seriesId}/recommendations`);

// Fetch search results
export const fetchSearchResults = (
  query: string,
  page = 1,
  language = "en-US"
): Promise<TrendingResponse> => {
  return apiGet<TrendingResponse>("/search/multi", {
    params: { query, page, language },
  });
};
