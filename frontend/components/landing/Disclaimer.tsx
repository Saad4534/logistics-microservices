'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Disclaimer() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 1.4 }}
      className="text-gray-400 text-sm italic mb-8 text-center"
    >
      <p>
        Disclaimer: This project is specifically developed for the Digit Labs assignment by Saad Nadeem and is open source.{' '}
        <Link
          href="https://github.com/Saad4534/logistics-microservices" // Replace with your actual repo URL
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          View the repo here
        </Link>.
      </p>
    </motion.div>
  );
}