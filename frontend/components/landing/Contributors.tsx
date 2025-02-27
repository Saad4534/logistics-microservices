'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Contributors() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const sliderVariants = {
    animate: {
      x: ['0%', '-50%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 60,
          ease: 'linear',
        },
      },
    },
  };

  const contributors = [
    { name: 'VS Code', logo: '/vs-code.svg' },
    { name: 'BlackBox AI', logo: '/ai.svg' },
    { name: 'FreePik', logo: '/freepik.svg' },
    { name: 'Quick Time Player', logo: '/quicktime.svg' },
    { name: 'Vercel', logo: '/vercel.svg' },
  ];

  // Duplicate contributors for seamless looping
  const doubledContributors = [...contributors, ...contributors];

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 1.2 }}
      className="mb-16"
    >
      <h2 className="text-3xl text-gray-100 font-semibold mb-8 text-center">Contributors</h2>
      <div className="relative overflow-hidden">
        {/* Fading effect */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
          }}
        />
        <motion.div
          variants={sliderVariants}
          animate="animate"
          className="flex flex-row gap-12"
          style={{ width: `${contributors.length * 14}%` }} // Original width calculation
        >
          {doubledContributors.map((contributor, index) => (
            <div
              key={`${contributor.name}-${index}`}
              className="flex flex-col items-center justify-center w-36 flex-shrink-0"
            >
              <Image
                src={contributor.logo}
                alt={`${contributor.name} Logo`}
                width={100}
                height={100}
                className="shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
              <p className="text-gray-300 text-sm mt-3 text-center">{contributor.name}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}