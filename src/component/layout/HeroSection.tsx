// Imports
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import ReactPlayer from "react-player";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiPlus, FiX } from "react-icons/fi";
import { useGenres } from "../../hooks/useGenres";
import { getSliderSettings } from "../../config/settings";

// API Services
import {
  fetchTrendingMovies,
  fetchMovieVideos,
} from "../../service/apiService";

// Types
import { Movie, Video } from "../../types";

// Styled Components
const HeroContainer = styled.div`
  position: relative;
  width: 100%;
  margin: auto;
  height: 85vh;
  z-index: 1;
  border-radius: 12px;
  overflow: hidden;

  /* Adjust margin and padding for spacing consistency */
  margin-top: 6rem;

  /* Media query for mobile screens */
  @media (max-width: 768px) {
    height: 100vh;
  }
`;
const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const MotionVideoContainer = motion(VideoContainer);

const DarkOverlay = styled.div`
  background: linear-gradient(
    135deg,
    rgba(20, 20, 20, 0.5) 0%,
    rgba(30, 30, 30, 0.3) 100%
  );
  position: absolute;
  inset: 0;
  backdrop-filter: blur(16px) saturate(1.8) contrast(1.4);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 8px rgba(255, 255, 255, 0.1);
  transition: backdrop-filter 0.3s ease;
`;

// Types
interface HeroSectionProps {
  className?: string;
}

// HeroSection Component
const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [currentMovieIndex, setCurrentMovieIndex] = useState<number>(0);
  const [isTrailerLoading, setIsTrailerLoading] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<Set<number>>(new Set());
  const { genres, loading: genresLoading, error: genresError } = useGenres();
  const settings = getSliderSettings(setCurrentMovieIndex, setShowDetails);

  useEffect(() => {
    const getTrendingMovies = async () => {
      try {
        const data = await fetchTrendingMovies("week");
        setMovies(data.results.slice(0, 5) as Movie[]);
      } catch {
        console.error("Failed to load movies");
      }
    };
    getTrendingMovies();
  }, []);

  useEffect(() => {
    const getTrailer = async () => {
      const currentMovie = movies[currentMovieIndex];
      if (currentMovie) {
        try {
          setIsTrailerLoading(true);
          const videos: Video[] = await fetchMovieVideos(currentMovie.id);
          const trailer = videos.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          setVideoKey(trailer ? trailer.key : null);
        } catch {
          console.error("Failed to load movie trailer");
        } finally {
          setIsTrailerLoading(false);
        }
      }
    };
    getTrailer();
  }, [currentMovieIndex, movies]);

  const toggleWatchlist = (movieId: number) => {
    setWatchlist((prev) => {
      const updatedWatchlist = new Set(prev);
      updatedWatchlist.has(movieId)
        ? updatedWatchlist.delete(movieId)
        : updatedWatchlist.add(movieId);
      return updatedWatchlist;
    });
  };

  return (
    <HeroContainer as="section" className="px-2 md:px-6 lg:px-16 mt-16 lg:pt-8">
      <AnimatePresence>
        <Slider {...settings}>
          {movies.map((movie, index) => (
            <figure key={movie.id} className="relative w-full h-[90vh]">
              <div className="absolute inset-0">
                {isTrailerLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="loader bg-dark h-12 w-12 rounded-full animate-spin shadow-custom"></div>
                  </div>
                ) : videoKey && index === currentMovieIndex ? (
                  <MotionVideoContainer animate={{ scale: 1.05 }}>
                    <ReactPlayer
                      url={`https://www.youtube.com/watch?v=${videoKey}`}
                      playing
                      muted
                      loop
                      width="100%"
                      height="100%"
                      className="react-player"
                      config={{ youtube: { playerVars: { autoplay: 1 } } }}
                    />
                    <DarkOverlay />
                  </MotionVideoContainer>
                ) : (
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover shadow-glass"
                  />
                )}
              </div>

              <figcaption className="relative z-10 flex flex-col justify-center items-start h-full container mx-auto pl-8 sm:pl-12 lg:pl-16 px-px-default sm:px-6 lg:px-px-default max-w-screen-xl">
                <article>
                  <motion.h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-[#ffb1b1] drop-shadow-lg text-shadow text-left mb-8 ml-2 lg:ml-0 max-w-2xl lg:max-w-3xl"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {movie.title}
                  </motion.h1>

                  <div className="flex flex-wrap gap-4 items-center pt-8 pl-2">
                    <motion.button
                      className={`flex items-center px-6 py-3 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ease-in-out shadow-lg ${
                        watchlist.has(movie.id)
                          ? "bg-[#ffb1b1] text-white hover:bg-[#ff7a7a]"
                          : "bg-transparent text-[#ffb1b1] border border-[#ff7a7a] hover:bg-[#ffb1b1] hover:text-white"
                      }`}
                      onClick={() => {
                        toggleWatchlist(movie.id);
                        setIsTrailerLoading(true);
                      }}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={
                        watchlist.has(movie.id)
                          ? "Remove from Watchlist"
                          : "Add to Watchlist"
                      }
                      title={
                        watchlist.has(movie.id)
                          ? "Click to remove from your watchlist"
                          : "Click to add to your watchlist"
                      }
                    >
                      {watchlist.has(movie.id) ? (
                        <>
                          <FiX className="pr-2" />
                          Remove from Watchlist
                        </>
                      ) : (
                        <>
                          <FiPlus className="mr-2" />
                          Add to Watchlist
                        </>
                      )}
                    </motion.button>

                    {/* View More Button */}
                    <motion.button
                      whileHover={{ scale: 1.1, y: -5, rotate: 1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`flex items-center px-8 py-3 text-base sm:text-lg font-medium rounded-full transition-all duration-300 ease-in-out shadow-md text-white ${
                        showDetails
                          ? "bg-transparent text-primary"
                          : "bg-transparent text-primary border border-secondary hover:bg-secondary hover:text-white"
                      }`}
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? (
                        <>
                          <FiChevronUp className="mr-2 text-white" />
                          <span className="text-white">Close</span>
                        </>
                      ) : (
                        <>
                          <FiChevronDown className="mr-2 text-white" />
                          <span className="text-white"> View More</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Overview Text */}
                  {showDetails && (
                    <motion.p
                      className="text-lg md:text-xl lg:text-2xl text-white ml-4 mb-8 leading-relaxed text-shadow text-left max-w-3xl"
                      style={{ maxWidth: "80%" }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.5 }}
                    >
                      {movie.overview}
                    </motion.p>
                  )}
                </article>

                {/* Genres */}
                {showDetails && (
                  <motion.div
                    className="flex flex-wrap gap-4 items-center justify-center sm:justify-start mt-8 ml4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5 }}
                  >
                    {genresLoading && <div>Loading genres...</div>}
                    {genresError && <div>Failed to load genres</div>}
                    {!genresLoading &&
                      movie.genre_ids.map((id) => {
                        const genreName =
                          genres.find((genre) => genre.id === id)?.name ||
                          "Unknown";
                        return (
                          <motion.span
                            key={id}
                            className="bg-[#ff4a4a] bg-opacity-20 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md transition-transform hover:scale-105 hover:bg-opacity-30"
                          >
                            {genreName}
                          </motion.span>
                        );
                      })}
                  </motion.div>
                )}
              </figcaption>
            </figure>
          ))}
        </Slider>
      </AnimatePresence>
    </HeroContainer>
  );
};

export default HeroSection;
