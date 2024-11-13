import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi";

const Footer: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show back-to-top button when scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="w-full pt-24 bg-dark bg-opacity-80 backdrop-blur-lg px-4  md:px-8 lg:px-16 glass-effect-footer relative z-[1000]"
    >
      {/* Back-to-Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            className="fixed bottom-6 right-6 p-3 bg-[#ffb1b1] rounded-full text-white shadow-lg z-[1100]"
            onClick={scrollToTop}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            aria-label="Back to Top"
          >
            <FiArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Logo and Info Section */}
        <div className="flex items-center space-x-2 mb-6 md:mb-0">
          <Link to="/" className="flex items-center space-x-1 cursor-pointer">
            <motion.div whileHover={{ scale: 1.1, rotate: 2 }}>
              <motion.img
                className="h-14 w-auto sm:h-8"
                src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Popcorn_Time_logo.png"
                alt="Popcorn Logo"
                loading="lazy"
              />
            </motion.div>
            <motion.h2
              className="text-[#dcdccd] text-sm font-bold tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              Popcorn
            </motion.h2>
          </Link>
          <p className="text-sm text-[#e0e0e0]/80 ml-4">
            En moderne film- og serieapp som viser trending innhold,
            anbefalinger og kommende utgivelser.
          </p>
        </div>

        {/* Navigation Links */}
        <motion.ul className="hidden md:flex space-x-8">
          {[
            { name: "Startsiden", path: "/" },
            { name: "Serier", path: "/serier" },
            { name: "Film", path: "/film" },
            { name: "Nytt og Populært", path: "/nytt-og-populært" },
            { name: "Min liste", path: "/min-liste" },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="text-[#e0e0e0] hover:text-[#ffb1b1] transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </motion.ul>

        {/* Social Media and Contact */}
        <div className="flex space-x-6 mt-6 md:mt-0">
          <a
            href="https://github.com/benoah"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ffb1b1] transition-colors"
            aria-label="GitHub"
          >
            <FiGithub size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/ben-moussa/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ffb1b1] transition-colors"
            aria-label="LinkedIn"
          >
            <FiLinkedin size={24} />
          </a>
          <a
            href="mailto:bennoahdev@gmail.com"
            className="hover:text-[#ffb1b1] transition-colors"
            aria-label="Email"
          >
            <FiMail size={24} />
          </a>
        </div>
      </motion.div>

      {/* Copyright */}
      <div className="mt-8 text-center text-sm text-[#e0e0e0]/60">
        &copy; {new Date().getFullYear()} Popcorn App. Alle rettigheter
        forbeholdt. Designet av Ben Moussa.
      </div>
    </motion.footer>
  );
};

export default Footer;
