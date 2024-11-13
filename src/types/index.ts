// src/types/index.ts

// Type for sjanger (genre)
export interface Genre {
  id: number;
  name: string;
}

// Type for trending element (film eller serie)
export interface TrendingItem {
  production_countries: never[];
  original_language: string;
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string; // For serier
  vote_average?: number;
  overview?: string;
  genre_ids?: number[];
}

// Type for respons fra trending API
export interface TrendingResponse {
  page: number;
  results: TrendingItem[];
  total_pages: number;
  total_results: number;
}

// Type for video (trailer eller klipp)
export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

// Type for respons fra movie videos API
export interface MovieVideosResponse {
  id: number;
  results: Video[];
}
export interface RecommendedForYouProps {
  selectedId: number;
  type: "movie" | "tv";
  className?: string;
}
export type Recommendation = {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  poster_path?: string;
  original_language: string;
};

export type SeriesImageProps = {
  posterPath: string | null;
  name: string;
};
export type Series = {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
};
export type Movie = {
  poster_path: any;
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  vote_average: number;
  original_language: string;
  cast?: { id: number; name: string }[];
};
export type SeriesModalProps = {
  series: Series;
  open: boolean;
  onClose: () => void;
  autoPlay: boolean;
  genres: Genre[];
  likedSeries: Set<number>;
  toggleLike: (seriesId: number) => void;
};
