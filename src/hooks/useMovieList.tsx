// src/hooks/useMovieList.ts
import { useState, useRef } from "react";
import { Movie } from "../types";
import { fetchMovieVideos } from "../service/apiService";

export const useMovieList = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [likedMovies, setLikedMovies] = useState<Set<number>>(new Set());
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const openMovieModal = async (movie: Movie, autoPlay = false) => {
    setSelectedMovie(movie);
    setAutoPlay(autoPlay);

    // Fetch the trailer
    try {
      const videos = await fetchMovieVideos(movie.id);
      const trailer = videos.find((video) => video.type === "Trailer");
      setVideoKey(trailer ? trailer.key : null);
    } catch (error) {
      console.error("Failed to load trailer.");
      setVideoKey(null);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setAutoPlay(false);
    setVideoKey(null);

    // Refocus the scroll container to restore interactivity
    scrollContainerRef.current?.focus();
  };

  const toggleLike = (movieId: number) => {
    setLikedMovies((prevLikedMovies) => {
      const updatedLikes = new Set(prevLikedMovies);
      updatedLikes.has(movieId)
        ? updatedLikes.delete(movieId)
        : updatedLikes.add(movieId);
      return updatedLikes;
    });
  };

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      top: 0,
      left: -Math.ceil(window.innerWidth / 1.5),
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      top: 0,
      left: Math.ceil(window.innerWidth / 1.5),
      behavior: "smooth",
    });
  };

  return {
    selectedMovie,
    autoPlay,
    likedMovies,
    openMovieModal,
    closeModal,
    toggleLike,
    scrollLeft,
    scrollRight,
    scrollContainerRef,
    videoKey, // Added videoKey to the returned object
  };
};
