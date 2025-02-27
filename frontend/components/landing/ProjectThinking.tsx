'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProjectThinking() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section className="mb-16 max-w-6xl mx-auto px-6"> {/* Changed to max-w-6xl */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
        className="flex flex-col md:flex-row items-center gap-8 w-full" // Increased gap, full width
      >
        <motion.div
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          className="w-full md:w-1/2 order-1 md:order-2 flex justify-center relative z-10"
        >
          <Image
            src="/thinking.svg"
            alt="Thinking Illustration"
            width={400}
            height={400}
            className="rounded-xl shadow-md"
            priority
          />
        </motion.div>
        <div className="w-full md:w-1/2 order-2 md:order-1 text-center md:text-left">
          <h2 className="text-3xl text-gray-100 font-semibold mb-4">Thinking Behind This Project</h2>
          <p className="text-gray-300 text-lg">
            Logistics MicroServices was born out of a desire to streamline and simplify logistics operations. Our goal was to create a modular, user-friendly platform that leverages microservices architecture to provide efficient tracking, booking, and scheduling solutions. By breaking down complex logistics tasks into manageable components, we aim to empower users with intuitive tools tailored for modern shipping needs.
          </p>
        </div>
      </motion.div>
    </section>
  );
}