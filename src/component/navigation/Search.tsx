import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiX } from "react-icons/fi";
import debounce from "lodash.debounce";
import { fetchSearchResults } from "../../service/apiService";
import { TrendingItem } from "../../types";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close the dropdown when clicking outside
  useOnClickOutside(dropdownRef, () => setIsFocused(false));

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchSearchResults(searchQuery);
        setResults(data.results);
      } catch (err: any) {
        console.error("Error fetching search results:", err);
        setError(
          err.response?.data?.message || "Failed to fetch search results."
        );
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  // Handle input changes with debounce
  useEffect(() => {
    debouncedSearch(query);
    return debouncedSearch.cancel;
  }, [query, debouncedSearch]);

  return (
    <div className="relative pr-6" ref={dropdownRef}>
      {/* Search Bar */}
      <div className="flex items-center border-b border-gray-500 pt-8">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex items-center w-full"
        >
          <FiSearch
            className="text-gray-300 mr-2"
            size={20}
            aria-label="Search Icon"
          />
          <label htmlFor="search-input" className="sr-only">
            Search
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="Search for movies or series..."
            aria-label="Search input"
            value={query}
            maxLength={100}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className="bg-transparent text-gray-300 placeholder-gray-400 focus:outline-none flex-1"
            ref={searchInputRef}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="text-gray-300 ml-2 hover:text-red-500 transition-colors duration-300"
              aria-label="Clear Search"
            >
              <FiX size={20} />
            </button>
          )}
        </form>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isFocused && query && (
          <motion.div
            className="absolute mt-2 w-full max-h-80 overflow-y-auto bg-gray-800 rounded-lg shadow-lg z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {loading && <p className="text-gray-300 p-4">Loading results...</p>}
            {error && <p className="text-red-500 p-4">{error}</p>}
            {!loading && results.length > 0 && (
              <ul className="divide-y divide-gray-700">
                {results.slice(0, 10).map((item) => (
                  <li
                    key={item.id}
                    className="p-4 hover:bg-gray-700 cursor-pointer flex items-center"
                    onClick={() => {
                      // Handle item click (e.g., navigate to detail page)
                      console.log("Selected item:", item);
                      setIsFocused(false);
                      setQuery("");
                      setResults([]);
                    }}
                  >
                    <img
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                          : "/placeholder.png"
                      }
                      alt={item.title || item.name || "Poster"}
                      className="w-12 h-18 object-cover rounded-md mr-4"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-100">
                        {item.title || item.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {item.release_date
                          ? item.release_date.substring(0, 4)
                          : item.first_air_date
                          ? item.first_air_date.substring(0, 4)
                          : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!loading && results.length === 0 && !error && (
              <p className="text-gray-300 p-4">No results found.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Search;
