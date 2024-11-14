import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";
import { FiSearch, FiX } from "react-icons/fi";
import {
  fetchNowPlayingMovies,
  fetchMovieVideos,
} from "../../service/apiService";
import styled from "styled-components";
import Fuse, { IFuseOptions, FuseResult } from "fuse.js";

import { useDebounce } from "use-debounce";

const Container = styled.div`
  backdrop-filter: blur(20px) saturate(1.8) contrast(1.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  padding: 20px;
`;

const DarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(20, 20, 20, 0.6),
    rgba(30, 30, 30, 0.3)
  );
  border-radius: 16px;
`;

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
};

const NowPlayingMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setCurrentIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Debounce the search query
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // Initialize Fuse.js instance using useMemo
  const fuse = React.useMemo(() => {
    const options: IFuseOptions<Movie> = {
      keys: ["title", "overview"],
      threshold: 0.3, // Juster følsomheten her
    };
    return new Fuse(movies, options);
  }, [movies]);

  // Fetch Now Playing Movies
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNowPlayingMovies(1, "en-US", "US");
      const mappedMovies = data.results.map((item: any) => ({
        id: item.id,
        title: item.title || "Untitled",
        poster_path: item.poster_path || "",
        release_date: item.release_date || "",
        vote_average: item.vote_average || 0,
        overview: item.overview || "No description available.",
      }));
      setMovies(mappedMovies);
    } catch (error) {
      console.error("Failed to fetch now playing movies.", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Trailer
  const fetchTrailer = async (movieId: number) => {
    try {
      const videos = await fetchMovieVideos(movieId);
      const trailer = videos.find((video: any) => video.type === "Trailer");
      setVideoKey(trailer ? trailer.key : null);
    } catch (error) {
      console.error("Failed to load trailer.", error);
    }
  };

  // Calculate days in theaters
  const calculateDaysInTheater = (releaseDate: string) => {
    const release = new Date(releaseDate).getTime();
    const now = new Date().getTime();
    const diff = now - release;
    return diff <= 0
      ? "New Release"
      : `${Math.floor(diff / (1000 * 60 * 60 * 24))} dager på kino`;
  };

  // Filtered Movies using Fuse.js
  const filteredMovies = React.useMemo(() => {
    if (debouncedSearchQuery && fuse) {
      try {
        const results = fuse.search(debouncedSearchQuery);
        return results.map((result: FuseResult<Movie>) => result.item);
      } catch (error) {
        console.error("Search failed:", error);
        return [];
      }
    } else {
      return movies;
    }
  }, [debouncedSearchQuery, fuse, movies]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <section className="relative w-full pt-24 px-4 md:px-16 lg:pt-32">
      <motion.header
        className="relative flex flex-col items-center md:items-start overflow-hidden mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="glass-effect-trend">
          <h4 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#ff7a7a] drop-shadow-sm mb-2 text-center md:text-left">
            Nå på kino
          </h4>

          <motion.p
            className="text-sm md:text-base lg:text-lg text-white italic mb-4 text-center md:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            "nær deg"
          </motion.p>

          {/* Search Field */}
          <div className="flex items-center justify-center md:justify-start border-b border-[#ffb1b1] mx-auto w-full max-w-sm px-4">
            <FiSearch
              className="text-[#ffb1b1] mr-2"
              size={20}
              aria-label="Søkeikon"
            />
            <input
              type="text"
              placeholder="Søk etter filmer..."
              aria-label="Søkeinput"
              value={searchQuery}
              maxLength={30}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[#ffb1b1] placeholder-[#ffb1b1]/60 focus:outline-none w-full"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#ffb1b1] ml-2 hover:text-red-500 transition-colors duration-300"
                aria-label="Tøm søk"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Filmliste */}
      <motion.div
        className="flex items-center space-x-4 py-4 overflow-x-auto scrollbar-hide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        ref={scrollContainerRef}
      >
        {loading ? (
          // Vis lasteplassholdere
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="w-[240px] h-[360px] bg-gray-700 animate-pulse rounded-2xl shadow-lg"
            ></div>
          ))
        ) : filteredMovies.length > 0 ? (
          // Vis filmer
          filteredMovies.map((movie: Movie, index: number) => (
            <motion.article
              key={movie.id}
              className="group relative w-[240px] h-[360px] rounded-2xl overflow-hidden shadow-lg bg-[#1a1a1a]"
              whileHover={{ scale: 1.05 }}
              aria-live="polite"
            >
              {/* Filmplakat */}
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
              {/* Mørkt overlegg */}
              <DarkOverlay />

              {/* Filminformasjon (vises ved hover) */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white backdrop-blur-sm bg-black/60 rounded-lg">
                <h3
                  className="text-lg md:text-xl lg:text-2xl font-bold text-white truncate w-full hover:text-[#ff7a7a] transition-colors duration-300 drop-shadow-lg"
                  title={movie.title}
                >
                  {movie.title}
                </h3>
                <p className="text-sm md:text-base text-[#ffb1b1] mt-1 drop-shadow-md">
                  {calculateDaysInTheater(movie.release_date)}
                </p>
                <p className="text-sm md:text-base drop-shadow-md">
                  ⭐ {movie.vote_average.toFixed(1)}
                </p>
                {/* Spill av knapp */}
                <button
                  className="mt-4 px-4 py-2 bg-transparent text-white rounded-full hover:bg-[#ffb1b1] transition-colors duration-300"
                  aria-label={`Åpne trailer for ${movie.title}`}
                  onClick={() => {
                    setSelectedMovie(movie);
                    fetchTrailer(movie.id);
                    setCurrentIndex(index);
                  }}
                >
                  Se trailer
                </button>
              </div>
            </motion.article>
          ))
        ) : (
          // Ingen filmer funnet
          <p className="text-white text-center w-full">
            Ingen filmer funnet som matcher søket ditt.
          </p>
        )}
      </motion.div>

      {/* Trailer Modal */}
      {/* Trailer Modal */}
      <AnimatePresence>
        {selectedMovie && videoKey && (
          <motion.dialog
            open
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMovie(null)}
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <div
              className="bg-[#1a1a1a] p-8 rounded-lg shadow-lg max-w-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing on inner click
            >
              <h2
                id="modal-title"
                className="text-2xl font-bold text-[#ffb1b1] mb-4"
              >
                {selectedMovie.title}
              </h2>

              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${videoKey}`}
                playing
                controls
                width="100%"
                height="100%"
              />

              <p id="modal-description" className="mt-4 text-sm text-gray-300">
                {selectedMovie.overview}
              </p>

              <button
                className="mt-4 px-6 py-2 bg-[#ffb1b1] text-white rounded-full hover:bg-[#ff7a7a]"
                onClick={() => setSelectedMovie(null)}
                aria-label="Lukk modal"
              >
                Lukk
              </button>
            </div>
          </motion.dialog>
        )}
      </AnimatePresence>
    </section>
  );
};

export default NowPlayingMovies;
