import { useState } from "react";
import { SeriesImageProps } from "../../types";
import { motion } from "framer-motion";

const SeriesImage: React.FC<SeriesImageProps> = ({ posterPath, name }) => {
  const [loaded, setLoaded] = useState(false);
  const placeholderSrc = "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative snap-center shrink-0 w-[240px] md:w-[280px] lg:w-[320px] transform transition-transform duration-300 hover:scale-105"
    >
      <img
        src={
          posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : placeholderSrc
        }
        alt={`Poster of ${name}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={(e) => (e.currentTarget.src = placeholderSrc)}
        className={`w-full h-auto object-cover rounded-md aspect-[2/3] transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Fallback text if no poster image is available */}
      {!posterPath && (
        <div className="absolute inset-0 bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
          No Image Available
        </div>
      )}
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md">
        <div className="absolute bottom-4 left-4 text-white text-lg font-bold drop-shadow-md">
          {name}
        </div>
      </div>
    </motion.div>
  );
};

export default SeriesImage;
