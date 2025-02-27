'use client';

import { motion } from 'framer-motion';

// Define a reusable FunctionalityItem component
type FunctionalityItemProps = {
  title: string;
  summary: string;
  howToUse: string;
  videoSrc: string;
  reverse?: boolean;
  delay: number;
};

const FunctionalityItem = ({ title, summary, howToUse, videoSrc, reverse = false, delay }: FunctionalityItemProps) => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const videoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <motion.div
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8`}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
    >
      <div className="w-full md:w-1/2 text-left">
        <motion.h3 variants={textVariants} className="text-2xl font-medium text-gray-200 mb-2">
          {title}
        </motion.h3>
        <motion.p variants={textVariants} className="mb-4">
          {summary}
        </motion.p>
        <motion.p variants={textVariants} className="text-sm text-gray-400">
          How to Use: {howToUse}
        </motion.p>
      </div>
      <motion.div
        variants={videoVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: delay + 0.2 }}
        className="w-full md:w-1/2 relative"
      >
        <div className="relative bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-xl p-4">
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            className="rounded-lg w-full max-w-lg mx-auto"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Functionalities() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const functionalities = [
    {
      title: 'Track a Shipment',
      summary: 'Monitor your shipment’s status in real-time with a tracking number.',
      howToUse: 'Navigate to "Track Order" via the header or button above. Enter a 12-22 character tracking number and click "Track" to see status and history.',
      videoSrc: '/videos/track-order.mov',
      reverse: false,
      delay: 1.2,
    },
    {
      title: 'Book a Shipment',
      summary: 'Create a shipment with sender, receiver, and parcel details in one go.',
      howToUse: 'Go to "Book a Shipment" from the header or button above. Fill in the form with addresses and parcel info, then click "Book Shipment" for a label and tracking number. (Use the example provided in the inputs)',
      videoSrc: '/videos/book-shipment.mov',
      reverse: true,
      delay: 1.6,
    },
    {
      title: 'Package Calendar',
      summary: 'Schedule packages across weeks with a drag-and-drop calendar.',
      howToUse: 'Access "Package Calendar" via the header. Drag packages from the right tray to a week (max 7). Hover and click "X" to return them. Add new ones with "Add Package".',
      videoSrc: '/videos/add-parcel.mov',
      reverse: false,
      delay: 2.0,
    },
  ];

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 1.0 }}
      className="mb-16"
    >
      <h2 className="text-3xl text-gray-100 font-semibold mb-12 text-center">Functionalities & How to Use</h2>
      <div className="space-y-12 text-gray-300 text-lg">
        {functionalities.map((func) => (
          <FunctionalityItem
            key={func.title}
            title={func.title}
            summary={func.summary}
            howToUse={func.howToUse}
            videoSrc={func.videoSrc}
            reverse={func.reverse}
            delay={func.delay}
          />
        ))}
      </div>
    </motion.div>
  );
}