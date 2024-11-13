// NavLink.tsx
import React from "react";
import { Link as ScrollLink } from "react-scroll";
import { motion, useReducedMotion } from "framer-motion";

interface NavLinkProps {
  to: string;
  name: string;
  onClick?: () => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  name,
  onClick,
  className = "",
}) => {
  const prefersReducedMotion = useReducedMotion();

  const variants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.li
      variants={variants}
      whileHover={!prefersReducedMotion ? "hover" : undefined}
      whileTap={!prefersReducedMotion ? "tap" : undefined}
      className="list-none py-2"
    >
      <ScrollLink
        to={to}
        smooth={true}
        duration={500}
        offset={-70}
        onClick={onClick}
        className={`text-xs text-[#dcdccd] hover:text-white transition-colors duration-300 focus:outline-none ${className}`}
        activeClass="active"
        spy={true}
      >
        {name}
      </ScrollLink>
    </motion.li>
  );
};

export default NavLink;
