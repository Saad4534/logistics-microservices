'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function TechnologiesUsed() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const technologies = [
    { name: 'Next.js', logo: '/logos/nextjs.svg', url: 'https://nextjs.org/' },
    { name: 'React', logo: '/logos/react.svg', url: 'https://react.dev/' },
    { name: 'Tailwind CSS', logo: '/logos/tailwind.svg', url: 'https://tailwindcss.com/' },
    { name: 'Framer Motion', logo: '/logos/framer-motion.svg', url: 'https://www.framer.com/' },
    { name: 'FastAPI', logo: '/logos/fastapi.svg', url: 'https://fastapi.tiangolo.com/' },
    { name: 'Python', logo: '/logos/python.svg', url: 'https://www.python.org/' },
    { name: 'Docker', logo: '/logos/docker.svg', url: 'https://www.docker.com/' },
    { name: 'TypeScript', logo: '/logos/typescript.svg', url: 'https://www.typescriptlang.org/' },
  ];

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.8 }}
      className="mb-16"
    >
      <h2 className="text-3xl text-gray-100 font-semibold mb-12 text-center">Technologies Used</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {technologies.map((tech, index) => (
          <motion.div
            key={tech.name}
            variants={logoVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.8 + index * 0.1 }}
            className="flex items-center justify-center h-32" // Centered, fixed height
          >
            <Link href={tech.url} target="_blank" rel="noopener noreferrer">
              <Image
                src={tech.logo}
                alt={`${tech.name} Logo`}
                width={100}
                height={100}
                className="hover:opacity-80 transition-opacity"
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}