import { motion } from "framer-motion";
import HeroSection from "../component/layout/HeroSection";
import Trending from "../component/movie/Trending";
import RecommendedForYou from "../component/movie/RecommendedForYou";
import UpcomingMovies from "../component/movie/UpcomingMovies";
import PopularSeries from "../component/series/PopularSeries";
import NowPlayingMovies from "../component/layout/NowPlayingMovies";

const Home = () => {
  return (
    <motion.main
      className="w-full min-h-screen px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <section id="hero-section" aria-labelledby="hero-title">
        <HeroSection />
      </section>

      <section id="trending" aria-labelledby="trending-title">
        <h2 id="trending-title" className="sr-only">
          Trending Movies
        </h2>
        <Trending />
      </section>

      <section id="recommended" aria-labelledby="recommended-title">
        <h2 id="recommended-title" className="sr-only">
          Recommended For You
        </h2>
        <RecommendedForYou selectedId={550} type={"movie"} />
      </section>

      <section id="upcoming" aria-labelledby="upcoming-title">
        <h2 id="upcoming-title" className="sr-only">
          Upcoming Movies
        </h2>
        <UpcomingMovies />
      </section>

      <section id="popular-series" aria-labelledby="popular-series-title">
        <h2 id="popular-series-title" className="sr-only">
          Popular Series
        </h2>
        <PopularSeries />
      </section>

      <section id="now-playing" aria-labelledby="now-playing-title">
        <h2 id="now-playing-title" className="sr-only">
          Now Playing Movies
        </h2>
        <NowPlayingMovies />
      </section>
    </motion.main>
  );
};

export default Home;
