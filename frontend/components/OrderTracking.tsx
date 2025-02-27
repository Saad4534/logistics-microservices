'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios, { AxiosError } from 'axios';

export default function OrderTracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [response, setResponse] = useState<TrackingResponse | null>(null);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isTracking, setIsTracking] = useState(false); // New loading state

  interface TrackingResponse {
    carrier?: string;
    tracking_number?: string;
    status?: string;
    history?: Array<{
      status: string;
      date: string;
      details: string;
      location?: string | { city?: string; state?: string; zip?: string; country?: string };
    }>;
  }

  const handleTrack = async () => {
    setIsTracking(true); // Start tracking state
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY || 'myTotalySecretKey';
      const res = await axios.get(`${apiUrl}/track/${trackingNumber}`, {
        headers: {
          'X-API-Key': apiKey,
        },
      });
      console.log(res.data);
      setResponse(res.data);
      setIsCardOpen(true);
    } catch (error) {
      setResponse(
        (error as AxiosError).response
          ? ((error as AxiosError).response?.data as TrackingResponse)
          : null
      );
      setIsCardOpen(true);
    } finally {
      setIsTracking(false); // End tracking state
    }
  };

  const handleClose = () => {
    setIsCardOpen(false);
    setTrackingNumber(''); // Reset input
    setResponse(null); // Reset response
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  return (
    <section className="relative mt-40 max-w-3xl mx-auto px-4">
      <motion.h2
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="text-2xl text-gray-100 font-semibold mb-2 text-center md:text-left"
      >
        Track Your Order
      </motion.h2>
      <motion.p
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="text-gray-300 mb-6 text-center md:text-left"
      >
        Enter your tracking number below to get the latest updates on your shipment.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col md:flex-row items-center justify-center gap-4"
      >
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 22) setTrackingNumber(value);
          }}
          placeholder="Enter tracking number"
          minLength={12}
          maxLength={22}
          className="w-full md:w-120 p-2 bg-gray-700 text-gray-200 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 placeholder-opacity-100 duration-500"
          disabled={isTracking} // Disable input while tracking
        />
        <motion.button
          whileHover={{ scale: isTracking ? 1 : 1.05 }}
          whileTap={{ scale: isTracking ? 1 : 0.95 }}
          onClick={handleTrack}
          disabled={trackingNumber.length < 12 || isTracking}
          className="relative w-full md:w-auto p-2 bg-white text-black rounded-xl hover:bg-gray-300 transition-colors px-4 disabled:bg-gray-400 disabled:cursor-not-allowed group"
        >
          {isTracking ? 'Tracking' : 'Track'}
          {trackingNumber.length < 12 && !isTracking && (
            <span className="absolute top-full left-1/2 translate-y-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-2 py-1 bg-gray-900 text-white text-sm rounded shadow-lg whitespace-nowrap">
              Tracking number must be 12–22 characters
            </span>
          )}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {isCardOpen && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 p-6 rounded-t-lg max-w-3xl mx-auto h-96 overflow-y-auto shadow-lg text-gray-200"
          >
            <h3 className="text-xl font-semibold mb-4">Tracking Details</h3>
            {response === null || typeof response === 'string' ? (
              <p className="text-red-400">{response || 'Error tracking order'}</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-gray-400">Carrier: </span>
                  <span>{response.carrier ?? 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-400">Tracking Number: </span>
                  <span>{response.tracking_number ?? 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-400">Status: </span>
                  <span className="capitalize">{response.status?.toLowerCase() ?? 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-400">History: </span>
                  {response.history && response.history.length > 0 ? (
                    <ul className="mt-2 space-y-3">
                      {response.history.map((event, index) => (
                        <li key={index} className="border-l-2 border-blue-500 pl-4">
                          <p className="text-sm text-gray-300">
                            <span className="font-medium">{event.status}: </span>
                            {new Date(event.date).toLocaleString()}
                          </p>
                          <p className="text-gray-400">{event.details}</p>
                          <p className="text-gray-500 text-sm">
                            Location:{' '}
                            {typeof event.location === 'string'
                              ? event.location
                              : `${event.location?.city || ''}, ${event.location?.state || ''} ${event.location?.zip || ''}, ${event.location?.country || ''}`.trim() || 'Unknown'}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400">No history available</p>
                  )}
                </div>
              </div>
            )}
            <button
              onClick={handleClose}
              className="mt-6 w-full p-2 bg-white text-black rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}