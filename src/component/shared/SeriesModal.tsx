// SeriesModal.tsx
import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiPlus, FiX, FiPlay } from "react-icons/fi";
import ReactPlayer from "react-player";
import { fetchSeriesVideos } from "../../service/apiService";
import { Series, Genre } from "../../types";

type SeriesModalProps = {
  series: Series;
  open: boolean;
  onClose: () => void;
  autoPlay: boolean;
  genres: Genre[];
  likedSeries: Set<number>;
  toggleLike: (seriesId: number) => void;
};

const SeriesModal: React.FC<SeriesModalProps> = ({
  series,
  open,
  onClose,
  autoPlay,
  genres,
  likedSeries,
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
        if (isTrailerPlaying || autoPlay) {
          const videos = await fetchSeriesVideos(series.id);
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
  }, [isTrailerPlaying, autoPlay, series.id]);

  const handlePlayTrailer = () => setIsTrailerPlaying(true);

  const toggleWatchlist = (seriesId: number) => {
    setWatchlist((prev) => {
      const updatedWatchlist = new Set(prev);
      if (updatedWatchlist.has(seriesId)) {
        updatedWatchlist.delete(seriesId);
      } else {
        updatedWatchlist.add(seriesId);
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
          aria-labelledby="series-title"
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-lg"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-3xl rounded-3xl overflow-hidden shadow-lg"
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
              className="absolute top-4 right-4 z-10 text-white bg-black/60 rounded-full p-2 hover:bg-black/80 transition-colors"
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
                    src={`https://image.tmdb.org/t/p/original${series.backdrop_path}`}
                    alt={series.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) =>
                      (e.currentTarget.src = "/assets/fallback-image.jpg")
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
                  <motion.button
                    onClick={handlePlayTrailer}
                    className="absolute inset-0 flex items-center justify-center text-white text-5xl opacity-90 hover:opacity-100 transition-opacity"
                    aria-label={`Play trailer for ${series.name}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPlay className="w-14 h-14" />
                  </motion.button>
                </>
              )}
            </div>

            {/* Content Section */}
            <div className="bg-[#1a1a1a] p-6 md:p-8 rounded-b-3xl text-center md:text-left">
              {/* Series Title */}
              <motion.h2
                id="series-title"
                className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wide text-[#ffb1b1] mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {series.name}
              </motion.h2>

              {/* First Air Date and Rating */}
              <motion.div
                className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* First Air Date */}
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-sm font-light text-[#ffb1b1]/80">
                    First Air Date
                  </span>
                  <span className="text-base text-[#e0e0e0]">
                    {new Date(series.first_air_date).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>

                {/* User Rating */}
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-sm font-light text-[#ffb1b1]/80">
                    User Rating
                  </span>
                  <span className="text-base text-[#e0e0e0]">
                    {series.vote_average.toFixed(1)} / 10
                  </span>
                </div>

                {/* Genres */}
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-sm font-light text-[#ffb1b1]/80">
                    Genres
                  </span>
                  <span className="text-base text-[#e0e0e0]">
                    {getGenreNames(series.genre_ids) || "N/A"}
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
                {series.overview || "No overview available for this series."}
              </motion.p>

              {/* Watchlist and Like Buttons */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                {/* Watchlist Button */}
                <motion.button
                  className={`flex items-center px-6 py-3 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ease-in-out shadow-lg ${
                    watchlist.has(series.id)
                      ? "bg-[#ffb1b1] text-white hover:bg-[#ff7a7a]"
                      : "bg-transparent text-[#ffb1b1] border border-[#ff7a7a] hover:bg-[#ffb1b1] hover:text-white"
                  }`}
                  onClick={() => {
                    toggleWatchlist(series.id);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={
                    watchlist.has(series.id)
                      ? "Remove from Watchlist"
                      : "Add to Watchlist"
                  }
                  title={
                    watchlist.has(series.id)
                      ? "Click to remove from your watchlist"
                      : "Click to add to your watchlist"
                  }
                >
                  {watchlist.has(series.id) ? (
                    <>
                      <FiX className="w-5 h-5 mr-2" />
                      Remove from Watchlist
                    </>
                  ) : (
                    <>
                      <FiPlus className="w-5 h-5 mr-2" />
                      Add to Watchlist
                    </>
                  )}
                </motion.button>

                {/* Like Button */}
                <motion.button
                  className={`flex items-center px-6 py-3 text-sm sm:text-base font-semibold rounded-full transition-all duration-300 ease-in-out shadow-lg ${
                    likedSeries.has(series.id)
                      ? "bg-[#ffb1b1] text-white hover:bg-[#ff7a7a]"
                      : "bg-transparent text-[#ffb1b1] border border-[#ff7a7a] hover:bg-[#ffb1b1] hover:text-white"
                  }`}
                  onClick={() => toggleLike(series.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={
                    likedSeries.has(series.id) ? "Unlike Series" : "Like Series"
                  }
                  title={
                    likedSeries.has(series.id)
                      ? "Click to unlike this series"
                      : "Click to like this series"
                  }
                >
                  {likedSeries.has(series.id) ? (
                    <>
                      <FiX className="w-5 h-5 mr-2" />
                      Unlike
                    </>
                  ) : (
                    <>
                      <FiPlus className="w-5 h-5 mr-2" />
                      Like
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SeriesModal;
