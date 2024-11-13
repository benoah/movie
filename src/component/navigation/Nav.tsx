import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import NavLink from "./NavLink";
import Search from "./Search";

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const sidePanelRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => setIsOpen((prev) => !prev);

  // Lukk sidepanelet når man klikker utenfor
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidePanelRef.current &&
        !sidePanelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`w-full z-50 ${
        isSticky
          ? "sticky top-0 bg-[var(--color-secondary)] shadow-lg"
          : "bg-transparent"
      }`}
    >
      <motion.nav
        aria-label="Main navigation"
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full px-8 py-4 md:px-8 lg:px-16"
      >
        <motion.div className="mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1 cursor-pointer">
            <motion.div whileHover={{ scale: 1.1, rotate: 2 }}>
              <motion.img
                className="h-8 w-auto sm:h-14"
                src="https://upload.wikimedia.org/wikipedia/commons/6/6c/Popcorn_Time_logo.png"
                alt="Popcorn Logo"
                loading="lazy"
              />
              <motion.h2
                className="text-[#dcdccd] text-sm font-bold tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Popcorn
              </motion.h2>
            </motion.div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex space-x-8">
            {[
              { name: "Startsiden", path: "hero-section" },
              { name: "Trending", path: "trending" },
              { name: "Anbefalt", path: "recommended" },
              { name: "Kommende", path: "upcoming" },
              { name: "Populære Serier", path: "popular-series" },
              { name: "Nå på kino", path: "now-playing" },
            ].map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.path}
                  name={item.name}
                  onClick={() => setIsOpen(false)}
                />
              </li>
            ))}
          </ul>

          {/* Search Component - Hidden on Mobile */}
          <div className="hidden md:inline">
            <Search />
          </div>

          {/* Hamburger Menu Icon for Mobile */}
          <button
            className="md:hidden text-white pr-4"
            onClick={handleToggle}
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </motion.div>
      </motion.nav>

      {/* Background Overlay for Sidepanel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-[var(--color-overlay)] opacity-60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidepanel for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <aside
            ref={sidePanelRef}
            id="mobile-menu"
            className="fixed inset-y-0 right-0 w-4/5 h-full max-w-sm p-6 z-50 shadow-lg glass-effect bg-[var(--color-secondary)] backdrop-blur-xl border-l border-[var(--color-accent)]/20"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col space-y-6">
              {[
                { name: "Startsiden", path: "hero-section" },
                { name: "Trending", path: "trending" },
                { name: "Anbefalt", path: "recommended" },
                { name: "Kommende", path: "upcoming" },
                { name: "Populære Serier", path: "popular-series" },
                { name: "Nå på kino", path: "now-playing" },
              ].map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    name={item.name}
                    onClick={() => setIsOpen(false)}
                  />
                </li>
              ))}
            </ul>
            <Search />
          </aside>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Nav;
