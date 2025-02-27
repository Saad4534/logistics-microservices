'use client';

import { motion } from 'framer-motion';

type HeroSectionProps = {
  setActiveComponent: (component: string) => void;
};

export default function HeroSection({ setActiveComponent }: HeroSectionProps) {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className='max-w-4xl mx-auto px-6'>
        <div className="mb-16">
      <motion.h1
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="text-4xl md:text-5xl text-gray-100 font-semibold mb-4"
      >
        Welcome to Logistics MicroServices
      </motion.h1>
      <motion.p
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="text-gray-300 text-lg md:text-xl mb-8"
      >
        Your one-stop solution for tracking, booking, and managing shipments with ease.
      </motion.p>
      <motion.div
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
        className="flex flex-col md:flex-row justify-center gap-4"
      >
        <button
          onClick={() => setActiveComponent('track-order')}
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Track a Shipment
        </button>
        <button
          onClick={() => setActiveComponent('book-shipment')}
          className="p-3 bg-white text-black rounded-xl hover:bg-gray-300 transition-colors"
        >
          Book a Shipment
        </button>
      </motion.div>
    </div>
    </section>
  );
}