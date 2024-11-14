import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchUpcomingMovies } from "../../service/apiService";
import styled from "styled-components";
import { useMovieList } from "../../hooks/useMovieList";
import { Movie } from "../../types";
import MovieModal from "../shared/MovieModal";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

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

const countryOptions = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "NO", label: "Norway" },
  { code: "FR", label: "France" },
];

const UpcomingMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string>("US");

  // Use the custom hook
  const { selectedMovie, openMovieModal, closeModal } = useMovieList();

  // Fetch movies from API based on selected country
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchUpcomingMovies(page, "en-US", selectedCountry);
      const mappedMovies: Movie[] = data.results.map((item: any) => ({
        id: item.id,
        title: item.title ?? "Untitled",
        poster_path: item.poster_path ?? "",
        backdrop_path: item.backdrop_path ?? "",
        release_date: item.release_date ?? "Unknown",
        vote_average: item.vote_average ?? 0,
        overview: item.overview ?? "",
        genre_ids: item.genre_ids ?? [],
        original_language: item.original_language ?? "",
      }));
      setMovies((prevMovies) => [...prevMovies, ...mappedMovies]);
      // Display only 4 movies initially
      setDisplayedMovies((prevDisplayed) =>
        page === 1
          ? mappedMovies.slice(0, 4)
          : [...prevDisplayed, ...mappedMovies.slice(0, 4)]
      );
      if (page >= data.total_pages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch upcoming movies.");
    } finally {
      setLoading(false);
    }
  }, [page, selectedCountry]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const initialMoviesCount = 4; // Number of movies to show initially

  const handleShowLess = () => {
    setDisplayedMovies(movies.slice(0, initialMoviesCount));
    setHasMore(true);
  };

  // Reset movies and pagination when country changes
  useEffect(() => {
    setPage(1);
    setMovies([]);
    setDisplayedMovies([]);
    setHasMore(true);
  }, [selectedCountry]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div className="relative w-full pt-24 px-4 md:px-16 lg:pt-32">
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
          <h4 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#ff7a7a] drop-shadow-sm mb-3 hover:rotate-1 transition-transform duration-300 text-center md:text-left">
            Coming Soon
          </h4>

          {/* Subtitle with Fade-in Animation */}
          <motion.p
            className="text-sm md:text-base lg:text-lg text-white leading-snug tracking-wide font-light italic mb-2 text-center md:text-left"
            style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Discover Upcoming Releases
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

      {/* Country Filter */}
      <div className="flex w-full justify-center md:justify-start py-8">
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className={`py-2 px-4 text-sm font-medium transition-all rounded-full border cursor-pointer shadow-sm ${
            selectedCountry
              ? "border-[#ffb1b1] text-[#ffb1b1] bg-[#ffb1b1]/10 hover:bg-[#ff7a7a]/15"
              : "border-[#ff7a7a]/40 text-[#ffb1b1] bg-[#2c2c2c]/20 hover:border-[#ffb1b1] hover:bg-[#ffb1b1]/10"
          } focus:outline-none focus:ring-2 focus:ring-[#ffb1b1]/30`}
        >
          {countryOptions.map((country) => (
            <option key={country.code} value={country.code}>
              {country.label}
            </option>
          ))}
        </select>
      </div>
      <AnimatePresence>
        {/* Movies List */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {displayedMovies.map((movie) => (
            <motion.div
              key={movie.id}
              className="relative w-full h-[360px] rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              onClick={() => openMovieModal(movie)}
            >
              <motion.img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover rounded-lg"
              />
              <DarkOverlay />
              <motion.div
                className="absolute bottom-4 left-1  "
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.08, y: -6 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  borderRadius: "32px",
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
                  textShadow: "0 3px 10px rgba(0, 0, 0, 0.6)",
                }}
              >
                <span className="bg-[#ff4a4a] bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition-transform hover:scale-105 hover:bg-opacity-30">
                  {movie.release_date
                    ? movie.release_date
                    : "Release Date Unavailable"}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        <AnimatePresence>
          <div className="flex justify-center my-4 space-x-4">
            {hasMore && (
              <motion.button
                whileHover={{ scale: 1.1, y: -5, rotate: 1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex items-center px-8 py-3 text-base sm:text-lg font-medium rounded-full transition-all duration-300 ease-in-out shadow-md text-white bg-transparent border border-secondary hover:bg-secondary hover:text-white`}
                onClick={handleLoadMore}
                aria-label="Load More Movies"
                title="Click to load more movies"
              >
                <FiChevronDown className="mr-2 text-white" />
                <span className="text-white">Load More</span>
              </motion.button>
            )}
            {displayedMovies.length > initialMoviesCount && (
              <motion.button
                whileHover={{ scale: 1.1, y: -5, rotate: 1 }}
                whileTap={{ scale: 0.9 }}
                className={`flex items-center px-8 py-3 text-base sm:text-lg font-medium rounded-full transition-all duration-300 ease-in-out shadow-md text-white bg-transparent border border-secondary hover:bg-secondary hover:text-white`}
                onClick={handleShowLess}
                aria-label="Show Less Movies"
                title="Click to show fewer movies"
              >
                <FiChevronUp className="mr-2 text-white" />
                <span className="text-white">Show Less</span>
              </motion.button>
            )}
          </div>
        </AnimatePresence>

        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            open={!!selectedMovie}
            onClose={closeModal}
            autoPlay={true}
            genres={[]} // Du kan hente sjangere hvis du har dem tilgjengelig
            likedMovies={new Set()} // Du kan legge til likte filmer hvis du har implementert dette
            toggleLike={() => {}} // Hvis du har en funksjon for å like filmer
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpcomingMovies;
/*
      <div className="flex py-8">
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className={`py-2 px-4 text-sm font-medium transition-all rounded-full border cursor-pointer shadow-sm ${
              selectedCountry
                ? "border-[#ffb1b1] text-[#ffb1b1] bg-[#ffb1b1]/10 hover:bg-[#ff7a7a]/15"
                : "border-[#ff7a7a]/40 text-[#ffb1b1] bg-[#2c2c2c]/20 hover:border-[#ffb1b1] hover:bg-[#ffb1b1]/10"
            } focus:outline-none focus:ring-2 focus:ring-[#ffb1b1]/30`}
          >
            {countryOptions.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
        </div>
*/
/*

   
*/
