import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SeriesModal from "../shared/SeriesModal";
import SeriesImage from "./SeriesImage";
import { fetchGenres, fetchPopularSeries } from "../../service/apiService";
import { Series, Genre } from "../../types";

interface PopularSeriesProps {
  className?: string;
}

const PopularSeries: React.FC<PopularSeriesProps> = ({ className }) => {
  // State variables
  const [series, setSeries] = useState<Series[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<Series[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [releaseYear, setReleaseYear] = useState<number | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [likedSeries, setLikedSeries] = useState<Set<number>>(new Set());

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch genres on component mount
  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresData = await fetchGenres("tv");
        setGenres(genresData);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      }
    };
    getGenres();
  }, []);

  // Fetch popular series on component mount
  useEffect(() => {
    const getSeries = async () => {
      try {
        const data = await fetchPopularSeries();
        const mappedSeries = data.results.map((item) => ({
          id: item.id,
          name: item.name || "Untitled",
          poster_path: item.poster_path || "",
          backdrop_path: item.backdrop_path || "",
          first_air_date: item.first_air_date || "",
          vote_average: item.vote_average || 0,
          overview: item.overview || "",
          genre_ids: item.genre_ids || [],
          original_language: item.original_language || "en",
        }));
        setSeries(mappedSeries);
        setFilteredSeries(mappedSeries);
      } catch (error) {
        console.error("Failed to fetch popular series:", error);
      }
    };
    getSeries();
  }, []);

  // Filter series based on selected criteria
  const filteredSeriesMemo = useMemo(() => {
    return series.filter((s) => {
      const genreMatch = selectedGenreId
        ? s.genre_ids.includes(selectedGenreId)
        : true;
      const ratingMatch = minRating ? s.vote_average >= minRating : true;
      const yearMatch = releaseYear
        ? new Date(s.first_air_date).getFullYear() === releaseYear
        : true;
      return genreMatch && ratingMatch && yearMatch;
    });
  }, [series, selectedGenreId, minRating, releaseYear]);

  useEffect(() => {
    setFilteredSeries(filteredSeriesMemo);
  }, [filteredSeriesMemo]);

  const handleScrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      top: 0,
      left: -Math.ceil(window.innerWidth / 1.5),
      behavior: "smooth",
    });
  };

  const handleScrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      top: 0,
      left: Math.ceil(window.innerWidth / 1.5),
      behavior: "smooth",
    });
  };
  // Modal functions
  const openSeriesModal = (series: Series, playTrailer = false) => {
    setSelectedSeries(series);
    setAutoPlay(playTrailer);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedSeries(null);
    setAutoPlay(false);
  };

  const toggleLike = (seriesId: number) => {
    setLikedSeries((prev) => {
      const updatedLikes = new Set(prev);
      updatedLikes.has(seriesId)
        ? updatedLikes.delete(seriesId)
        : updatedLikes.add(seriesId);
      return updatedLikes;
    });
  };

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
            Popular Series
          </h4>

          {/* Subtitle with Fade-in Animation */}
          <motion.p
            className="text-sm md:text-base lg:text-lg text-white leading-snug tracking-wide font-light italic mb-2 text-center md:text-left"
            style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Discover Top-Rated TV Shows
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

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start w-full justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4 pt-8 pb-4">
        {/* Genre Filter */}
        <div className="relative inline-block">
          <select
            value={selectedGenreId ?? ""}
            onChange={(e) =>
              setSelectedGenreId(
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            className={`py-2 px-4 text-sm font-medium transition-all rounded-full border cursor-pointer shadow-sm ${
              selectedGenreId
                ? "border-[#ffb1b1] text-[#ffb1b1] bg-[#ffb1b1]/10 hover:bg-[#ff7a7a]/15"
                : "border-[#ff7a7a]/40 text-[#ffb1b1] bg-[#2c2c2c]/20 hover:border-[#ffb1b1] hover:bg-[#ffb1b1]/10"
            } focus:outline-none focus:ring-2 focus:ring-[#ffb1b1]/30`}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Series List */}
      <div className="relative text-white">
        {/* Scroll Buttons */}
        {filteredSeries.length > 5 && (
          <>
            <motion.button
              onClick={handleScrollLeft}
              aria-label="Scroll Left"
              className="absolute top-1/2 left-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity transform hover:scale-110 bg-gradient-to-r from-[#111] to-transparent rounded-full p-3 shadow-custom"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FiChevronLeft className="w-8 h-8 text-[#ffb1b1]" />
            </motion.button>

            <motion.button
              onClick={handleScrollRight}
              aria-label="Scroll Right"
              className="absolute top-1/2 right-2 z-10 -translate-y-1/2 opacity-70 hover:opacity-100 transition-opacity transform hover:scale-110 bg-gradient-to-l from-black via-black/80 to-transparent rounded-full p-3 shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FiChevronRight className="w-8 h-8 text-[#ffb1b1]" />
            </motion.button>
          </>
        )}

        {/* Scroll Indicator */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-[#ffb1b1]/20">
          <motion.div
            className="h-full bg-[#ffb1b1]"
            style={{
              width: `${
                ((scrollContainerRef.current?.scrollLeft ?? 0) /
                  ((scrollContainerRef.current?.scrollWidth ?? 1) -
                    (scrollContainerRef.current?.clientWidth ?? 1))) *
                100
              }%`,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>

        {/* Series List Container */}
        <motion.div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll space-x-6 py-8 snap-x snap-mandatory scroll-smooth scrollbar-hide"
        >
          {filteredSeries.map((serie) => (
            <motion.div
              key={serie.id}
              onClick={() => openSeriesModal(serie)}
              className="relative cursor-pointer snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transform transition-transform duration-300 hover:scale-105 rounded-lg overflow-hidden shadow-glass"
              whileHover={{ scale: 1.05 }}
            >
              <SeriesImage posterPath={serie.poster_path} name={serie.name} />

              {/* Play Button Overlay */}
              <button
                onClick={() => openSeriesModal(serie, true)}
                className="absolute inset-0 flex items-center justify-center text-white text-4xl opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black via-black/80 to-transparent rounded-lg shadow-2xl transform hover:scale-110"
                aria-label={`Open trailer for ${serie.name}`}
                aria-live="polite"
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
        </motion.div>
      </div>

      {/* Series Modal */}

      {selectedSeries && (
        <SeriesModal
          series={selectedSeries}
          open={openModal}
          onClose={closeModal}
          autoPlay={autoPlay}
          genres={genres}
          likedSeries={likedSeries}
          toggleLike={toggleLike}
        />
      )}
    </div>
  );
};

export default PopularSeries;
