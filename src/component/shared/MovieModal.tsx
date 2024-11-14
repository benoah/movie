import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiPlay } from "react-icons/fi";
import ReactPlayer from "react-player";
import { fetchMovieVideos } from "../../service/apiService";
import { Movie, Genre } from "../../types";

type MovieModalProps = {
  movie: Movie;
  open: boolean;
  onClose: () => void;
  autoPlay: boolean;
  genres: Genre[];
  likedMovies: Set<number>;
  toggleLike: (movieId: number) => void;
};

const MovieModal: React.FC<MovieModalProps> = ({
  movie,
  open,
  onClose,
  autoPlay,
  genres,
  likedMovies,
  toggleLike,
}) => {
  const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<Set<number>>(new Set());
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management effect
  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
      // document.body.style.overflow = "hidden"; // Disable body scroll
    } else {
      //   document.body.style.overflow = "auto"; // Enable body scroll when closed
    }
  }, [open]);

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Load trailer video when playing
  useEffect(() => {
    const loadTrailer = async () => {
      try {
        if (isTrailerPlaying) {
          const videos = await fetchMovieVideos(movie.id);
          const trailer = videos.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );
          setVideoKey(trailer ? trailer.key : null);
        }
      } catch (error) {
        console.error("Failed to load trailer:", error);
        setVideoKey(null);
      }
    };

    loadTrailer();
  }, [isTrailerPlaying, movie.id]);

  const handlePlayTrailer = () => setIsTrailerPlaying(true);

  const toggleWatchlist = (movieId: number) => {
    setWatchlist((prev) => {
      const updatedWatchlist = new Set(prev);
      if (updatedWatchlist.has(movieId)) {
        updatedWatchlist.delete(movieId);
      } else {
        updatedWatchlist.add(movieId);
      }
      return updatedWatchlist;
    });
  };

  // Function to get genre names from genre IDs
  const getGenreNames = (genreIds: number[]) => {
    return genreIds
      .map((id) => genres.find((genre) => genre.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="movie-title"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-gradient-to-b from-black/70 via-[#1a1a1a]/80 to-black/90 backdrop-blur-[10px]"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-3xl rounded-[20px] bg-[#2c2c2c]/80 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* Close Button */}
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-white bg-[#1a1a1a]/70 rounded-full p-2 hover:bg-[#1a1a1a]/90 transition-colors duration-200"
              aria-label="Close modal"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Background Image or Trailer */}
            <div className="relative w-full h-72 md:h-96 bg-black">
              {isTrailerPlaying && videoKey ? (
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${videoKey}`}
                  playing={autoPlay}
                  controls
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", top: 0, left: 0 }}
                  config={{ youtube: { playerVars: { autoplay: 1 } } }}
                />
              ) : (
                <>
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover rounded-t-[20px]"
                    loading="lazy"
                    onError={(e) =>
                      (e.currentTarget.src = "/assets/fallback-image.jpg")
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                  <motion.button
                    onClick={handlePlayTrailer}
                    className="absolute inset-0 flex items-center justify-center text-white text-5xl opacity-90 hover:opacity-100 transition-opacity duration-300"
                    aria-label={`Play trailer for ${movie.title}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPlay className="w-14 h-14" />
                  </motion.button>
                </>
              )}
            </div>

            {/* Content Section */}
            <div className="bg-[#1a1a1a]/90 p-6 md:p-8 rounded-b-[20px] text-center md:text-left">
              {/* Movie Title */}
              <motion.h2
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#ffb1b1] drop-shadow-md mb-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                {movie.title}
              </motion.h2>

              {/* Release Date and Rating */}
              <motion.div
                className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-sm font-light text-[#ffb1b1]/80">
                    Release Date
                  </span>
                  <span className="text-base text-[#e0e0e0]">
                    {new Date(movie.release_date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <span className="text-sm font-light text-[#ffb1b1]/80">
                    User Rating
                  </span>
                  <span className="text-base text-[#e0e0e0]">
                    {movie.vote_average.toFixed(1)} / 10
                  </span>
                </div>

                <div className="flex flex-col items-center md:items-start">
                  <span className="text-sm font-light text-[#ffb1b1]/80">
                    Genres
                  </span>
                  <span className="text-base text-[#e0e0e0]">
                    {getGenreNames(movie.genre_ids) || "N/A"}
                  </span>
                </div>
              </motion.div>

              {/* Overview */}
              <motion.p
                className="text-sm md:text-base lg:text-lg text-[#dcdcdc] leading-relaxed mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {movie.overview || "No overview available for this movie."}
              </motion.p>

              {/* Watchlist Button */}
              <motion.button
                className={`px-6 py-3 text-sm font-semibold rounded-full shadow-lg transition-all duration-300 ${
                  watchlist.has(movie.id)
                    ? "bg-[#ffb1b1] text-white hover:bg-[#ff7a7a]"
                    : "bg-transparent text-[#ffb1b1] border border-[#ff7a7a] hover:bg-[#ffb1b1] hover:text-white"
                }`}
                onClick={() => toggleWatchlist(movie.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {watchlist.has(movie.id)
                  ? "Remove from Watchlist"
                  : "Add to Watchlist"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MovieModal;
