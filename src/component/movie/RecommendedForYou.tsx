// src/component/movie/RecommendedForYou.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { RecommendedForYouProps, Recommendation, Movie } from "../../types";
import MovieModal from "../shared/MovieModal";
import { useRecommendations } from "../../hooks/useRecommendations";
import { useMovieList } from "../../hooks/useMovieList";

const RecommendedForYou: React.FC<RecommendedForYouProps> = ({
  selectedId,
  type,
  className,
}) => {
  const [filterType, setFilterType] = useState<"movie" | "tv">(type);

  // Use the custom hooks
  const { recommendations, genres, loading, error } = useRecommendations(
    selectedId,
    filterType
  );
  const {
    selectedMovie,
    autoPlay,
    likedMovies,
    openMovieModal,
    closeModal,
    toggleLike,
    scrollLeft,
    scrollRight,
    scrollContainerRef,
  } = useMovieList();

  // Convert Recommendation to Movie
  const convertToMovie = (rec: Recommendation): Movie => ({
    id: rec.id,
    title: rec.title || rec.name || "Untitled",
    poster_path: rec.poster_path,
    backdrop_path: rec.backdrop_path,
    release_date: rec.release_date,
    vote_average: rec.vote_average,
    overview: rec.overview,
    genre_ids: rec.genre_ids,
    original_language: rec.original_language || "",
  });

  return (
    <section
      className={`relative w-full ${className} pt-24 px-2 md:px-16 md:pt-16 lg:pt-32`}
    >
      {/* Header and Filter Buttons */}
      <motion.header
        className="relative flex flex-col items-center md:items-start overflow-hidden"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Pulse Background Effect */}
        <div
          style={{ maxWidth: "300px" }}
          className="w-full h-full bg-gradient-to-r from-transparent via-[#ffb1b1] to-transparent opacity-20 animate-pulse"
        ></div>

        {/* Glass Effect Container */}
        <div className="glass-effect-trend">
          {/* Main Title */}
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#ffb1b1] drop-shadow-md mb-2 hover:scale-105 transition-transform duration-300 text-center md:text-left">
            Editor’s Choice
          </h3>

          {/* Subtitle with Fade-in Animation */}
          <motion.p
            className="text-sm md:text-base lg:text-lg text-white leading-snug tracking-wide font-light italic mb-2 text-center md:text-left"
            style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Discover the Best Picks Just for You
          </motion.p>

          {/* Animated Divider Line */}
          <motion.div
            className="h-1 bg-[#ffb1b1]/30 rounded-md"
            style={{ maxWidth: "400px" }}
            initial={{ width: "0%" }}
            animate={{ width: "90%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </motion.header>

      {/* Filter Buttons */}
      <div className="flex items-center space-x-2 py-8 w-full justify-center md:justify-start">
        <button
          onClick={() => setFilterType("movie")}
          className={`py-2 px-4 text-sm font-medium transition-all rounded-l-full flex items-center justify-center border-2 ${
            filterType === "movie"
              ? "border-[#ffb1b1] text-[#ffb1b1] bg-[#ffb1b1]/20 hover:bg-[#ff7a7a]/30 shadow-[0_0_10px_rgba(255,114,114,0.5)]"
              : "border-[#ff7a7a]/50 text-gray-400 hover:text-[#ffb1b1] hover:border-[#ffb1b1] hover:bg-[#ffb1b1]/10"
          }`}
        >
          Movies
        </button>
        <button
          onClick={() => setFilterType("tv")}
          className={`py-2 px-4 text-sm font-medium transition-all rounded-r-full flex items-center justify-center border-2 ${
            filterType === "tv"
              ? "border-[#ffb1b1] text-[#ffb1b1] bg-[#ffb1b1]/20 hover:bg-[#ff7a7a]/30 shadow-[0_0_10px_rgba(255,114,114,0.5)]"
              : "border-[#ff7a7a]/50 text-gray-400 hover:text-[#ffb1b1] hover:border-[#ffb1b1] hover:bg-[#ffb1b1]/10"
          }`}
        >
          TV Shows
        </button>
      </div>

      {/* Scrollable Recommendations Section */}
      <div className="relative group">
        <button
          onClick={scrollLeft}
          aria-label="Scroll Left"
          className="absolute top-1/2 left-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity transform hover:scale-110 bg-gradient-to-r from-[#111] to-transparent rounded-full p-3 shadow-custom"
        >
          <FiChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={scrollRight}
          aria-label="Scroll Right"
          className="absolute top-1/2 right-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity transform hover:scale-110 bg-gradient-to-l from-[#111] to-transparent rounded-full p-3 shadow-custom"
        >
          <FiChevronRight className="w-6 h-6 text-white" />
        </button>
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll space-x-px-default py-px-default scroll-smooth scrollbar-hide"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] animate-pulse"
                >
                  <div className="bg-darker h-[360px] w-full rounded-lg shadow-custom"></div>
                  <div className="mt-2 h-6 bg-darker rounded-lg w-3/4"></div>
                  <div className="mt-2 h-4 bg-darker rounded-lg w-1/2"></div>
                  <div className="mt-2 h-4 bg-darker rounded-lg w-1/4"></div>
                </div>
              ))
            : recommendations.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] mx-2 my-4 transform transition-transform duration-300 hover:scale-105"
                >
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "/assets/fallback-image.jpg"
                    }
                    alt={item.title || item.name}
                    className="w-full h-auto object-cover rounded-lg aspect-[2/3] shadow-glass transform hover:scale-105 hover:brightness-110 transition-transform duration-300 "
                    loading="lazy"
                    onError={(e) =>
                      (e.currentTarget.src = "/assets/fallback-image.jpg")
                    }
                  />
                  <button
                    onClick={() => openMovieModal(convertToMovie(item))}
                    className="absolute inset-0 flex items-center justify-center text-white text-4xl opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-dark via-darker/80 to-transparent rounded-lg shadow-2xl transform hover:scale-105"
                    aria-label={`Open trailer for ${item.title || item.name}`}
                  >
                    <svg
                      className="w-14 h-14 text-white drop-shadow-md"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 2v20l17-10L4 2z" />
                    </svg>
                  </button>
                </motion.div>
              ))}
          {selectedMovie && (
            <MovieModal
              movie={selectedMovie}
              open={!!selectedMovie}
              onClose={closeModal}
              autoPlay={autoPlay}
              genres={genres}
              likedMovies={likedMovies}
              toggleLike={toggleLike}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default RecommendedForYou;
