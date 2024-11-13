import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { HeartIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { fetchGenres, fetchTopRatedMovies } from "../../service/apiService";
import MovieModal from "../shared/MovieModal";

export type Genre = {
  id: number;
  name: string;
};

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  original_language: string;
  adult?: boolean;
};

interface TopRatedMoviesProps {
  className?: string;
}

const TopRatedMovies: React.FC<TopRatedMoviesProps> = ({ className }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState<number | null>(null);
  const [likedMovies, setLikedMovies] = useState<Set<number>>(new Set());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  // Fetch genres on mount
  useEffect(() => {
    const getGenres = async () => {
      try {
        const genresData = await fetchGenres("movie");
        setGenres(genresData);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setError("Failed to fetch genres.");
      }
    };
    getGenres();
  }, []);

  // Fetch top-rated movies
  const getMovies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTopRatedMovies();

      const moviesData: Movie[] = data.results.map((item) => ({
        id: item.id,
        title: item.title || item.name || "Untitled",
        poster_path: item.poster_path || "",
        backdrop_path: item.backdrop_path || "",
        release_date: item.release_date || "",
        vote_average: item.vote_average || 0,
        overview: item.overview || "",
        genre_ids: item.genre_ids || [],
        original_language: item.original_language || "en",
      }));

      setMovies(moviesData);
    } catch (error) {
      console.error("Error fetching top-rated movies:", error);
      setError("Failed to fetch top-rated movies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getMovies();
  }, [getMovies]);

  const toggleLike = (movieId: number) => {
    setLikedMovies((prevLikedMovies) => {
      const updatedLikes = new Set(prevLikedMovies);
      updatedLikes.has(movieId)
        ? updatedLikes.delete(movieId)
        : updatedLikes.add(movieId);
      return updatedLikes;
    });
  };

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  const genreMap = genres.reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {} as { [key: number]: string });

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({
      left: -Math.ceil(window.innerWidth / 1.5),
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({
      left: Math.ceil(window.innerWidth / 1.5),
      behavior: "smooth",
    });
  };

  return (
    <div className={`relative w-full ${className}`}>
      <motion.header
        className="relative flex flex-col items-start overflow-hidden pb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Decorative Gradient Line */}
        <div
          className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-20 animate-pulse"
          style={{ maxWidth: "300px" }}
        ></div>

        {/* Glass Effect Container */}
        <div className="glass-base p-px-default">
          <h4 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-primary drop-shadow-md mb-2 hover:scale-105 transition-transform duration-300">
            Top Rated Movies
          </h4>
          {/* Animated Divider Line */}
          <motion.div
            className="h-1 bg-primary/30 rounded-md"
            style={{ maxWidth: "300px" }}
            initial={{ width: "0%" }}
            animate={{ width: "50%" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </motion.header>

      <div className="relative text-white">
        {movies.length > 5 && (
          <>
            <button
              onClick={scrollLeft}
              aria-label="Scroll Left"
              className="absolute top-1/2 left-2 z-10 -translate-y-1/2 bg-black/70 rounded-full p-3 shadow-lg hover:scale-105"
            >
              <FiChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={scrollRight}
              aria-label="Scroll Right"
              className="absolute top-1/2 right-2 z-10 -translate-y-1/2 bg-black/70 rounded-full p-3 shadow-lg hover:scale-105"
            >
              <FiChevronRight className="w-6 h-6 text-white" />
            </button>
          </>
        )}

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-scroll space-x-4  scroll-smooth scrollbar-hide snap-x snap-mandatory"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] animate-pulse"
                >
                  <div className="bg-gray-700 h-[360px] w-full rounded-lg"></div>
                </div>
              ))
            : movies.map((movie) => (
                <div
                  key={movie.id}
                  onClick={() => openModal(movie)}
                  className="relative cursor-pointer snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transition-transform hover:scale-105 group"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-xl">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                      alt={movie.title || "Untitled"}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://via.placeholder.com/500x750?text=No+Image")
                      }
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col justify-end">
                      <motion.div className="flex gap-2 mt-2">
                        {movie.genre_ids.map((id) => (
                          <span
                            key={id}
                            className="bg-primary bg-opacity-20 text-white px-4 py-1 rounded-full text-sm shadow-custom transition-transform hover:scale-105 hover:bg-opacity-30 w-24 h-8 text-center"
                          >
                            {genreMap[id]}
                          </span>
                        ))}
                      </motion.div>
                    </div>
                  </div>
                </div>
              ))}

          {selectedMovie && isModalOpen && (
            <MovieModal
              movie={selectedMovie}
              open={isModalOpen}
              onClose={closeModal}
              autoPlay={autoPlay}
              genres={genres}
              likedMovies={likedMovies}
              toggleLike={toggleLike}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopRatedMovies;
