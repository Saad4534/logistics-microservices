'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';

type HeaderProps = {
  activeComponent: string;
  setActiveComponent: (component: string) => void;
};

export default function Header({ activeComponent, setActiveComponent }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'track-order', label: 'Track Order' },
    { id: 'book-shipment', label: 'Book Shipment' },
    { id: 'calendar', label: 'Calendar' },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-10 bg-transparent p-4 shadow-lg backdrop-blur-md"
    >
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* Clickable Heading on the left */}
        <motion.button
          onClick={() => setActiveComponent('home')}
          whileHover={{ scale: 1.05 }}
          className="text-2xl text-gray-100 font-medium focus:outline-none"
        >
          Logistics MicroServices
        </motion.button>

        {/* Desktop Nav links on the right */}
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => setActiveComponent(item.id)}
              className={`group relative text-gray-300 transition-colors p-2 pb-1 ${
                activeComponent === item.id ? 'text-blue-400' : 'hover:text-white'
              }`}
            >
              {item.label}
              {/* Underline effect */}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ${
                  activeComponent === item.id
                    ? 'w-full'
                    : 'w-0 group-hover:w-full'
                }`}
              />
            </motion.button>
          ))}
        </nav>

        {/* Mobile Menu Toggle - only hamburger icon */}
        <button
          className="md:hidden text-gray-300 hover:text-blue-400"
          onClick={toggleMobileMenu}
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="md:hidden absolute top-16 left-0 w-full bg-gray-900 bg-opacity-90 p-4 flex flex-col space-y-2 items-start backdrop-blur-md"
        >
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => {
                setActiveComponent(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`group relative text-gray-300 transition-colors p-2 ${
                activeComponent === item.id ? 'text-blue-400' : 'hover:text-blue-400'
              }`}
            >
              {item.label}
              {/* Underline effect */}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-blue-400 transition-all duration-300 ${
                  activeComponent === item.id
                    ? 'w-full'
                    : 'w-0 group-hover:w-full'
                }`}
              />
            </motion.button>
          ))}
        </motion.nav>
      )}
    </motion.header>
  );
}