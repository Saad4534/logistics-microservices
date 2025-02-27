'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function ShipmentBooking() {
  const [formData, setFormData] = useState({
    senderName: '',
    senderStreet1: '',
    senderStreet2: '',
    senderCity: '',
    senderState: '',
    senderZip: '',
    senderCountry: 'US',
    senderPhone: '',
    senderEmail: '',
    receiverName: '',
    receiverStreet1: '',
    receiverStreet2: '',
    receiverCity: '',
    receiverState: '',
    receiverZip: '',
    receiverCountry: 'US',
    receiverPhone: '',
    receiverEmail: '',
    parcelLength: '',
    parcelWidth: '',
    parcelHeight: '',
    parcelDistanceUnit: 'in',
    parcelWeight: '',
    parcelMassUnit: 'lb',
  });
  const [response, setResponse] = useState<{
    shipment_object_id?: string;
    transaction_status?: string;
    tracking_number?: string;
    label_url?: string;
    error?: string;
    messages?: Array<{ text?: string }>;
  } | null>(null);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [errors, setErrors] = useState<string[]>([]); // New state for validation errors

  const requiredFields = [
    'senderName', 'senderStreet1', 'senderCity', 'senderState', 'senderZip', 'senderPhone', 'senderEmail',
    'receiverName', 'receiverStreet1', 'receiverCity', 'receiverState', 'receiverZip', 'receiverPhone',
    'parcelLength', 'parcelWidth', 'parcelHeight', 'parcelWeight'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    setErrors((prev) => prev.filter((error) => !error.includes(e.target.name)));
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    requiredFields.forEach((field) => {
      if (!formData[field as keyof typeof formData]) {
        newErrors.push(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      }
    });
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleBook = async () => {
    if (!validateForm()) {
      setResponse({ error: 'Missing required fields', messages: errors.map((msg) => ({ text: msg })) });
      setIsCardOpen(true);
      return;
    }

    setIsBooking(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const apiKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY || 'your-api-key-here';
      const payload = {
        address_from: {
          name: formData.senderName,
          street1: formData.senderStreet1,
          street2: formData.senderStreet2 || undefined,
          city: formData.senderCity,
          state: formData.senderState,
          zip: formData.senderZip,
          country: formData.senderCountry,
          phone: formData.senderPhone || undefined,
          email: formData.senderEmail || undefined,
        },
        address_to: {
          name: formData.receiverName,
          street1: formData.receiverStreet1,
          street2: formData.receiverStreet2 || undefined,
          city: formData.receiverCity,
          state: formData.receiverState,
          zip: formData.receiverZip,
          country: formData.receiverCountry,
          phone: formData.receiverPhone || undefined,
          email: formData.receiverEmail || undefined,
        },
        parcels: [
          {
            length: formData.parcelLength,
            width: formData.parcelWidth,
            height: formData.parcelHeight,
            distance_unit: formData.parcelDistanceUnit as 'in' | 'cm',
            weight: formData.parcelWeight,
            mass_unit: formData.parcelMassUnit as 'lb' | 'kg',
          },
        ],
      };
      const res = await axios.post(`${apiUrl}/create-order`, payload, {
        headers: {
          'X-API-Key': apiKey,
        },
      });
      setResponse(res.data);
      setIsCardOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponse(
          error.response
            ? { error: error.response.data.error || 'Error booking shipment', messages: error.response.data.messages }
            : { error: 'Error booking shipment' }
        );
      } else {
        setResponse({ error: 'Error booking shipment' });
      }
      setIsCardOpen(true);
    } finally {
      setIsBooking(false);
    }
  };

  const handleClose = () => {
    setIsCardOpen(false);
    setFormData({
      senderName: '',
      senderStreet1: '',
      senderStreet2: '',
      senderCity: '',
      senderState: '',
      senderZip: '',
      senderCountry: 'US',
      senderPhone: '',
      senderEmail: '',
      receiverName: '',
      receiverStreet1: '',
      receiverStreet2: '',
      receiverCity: '',
      receiverState: '',
      receiverZip: '',
      receiverCountry: 'US',
      receiverPhone: '',
      receiverEmail: '',
      parcelLength: '',
      parcelWidth: '',
      parcelHeight: '',
      parcelDistanceUnit: 'in',
      parcelWeight: '',
      parcelMassUnit: 'lb',
    });
    setResponse(null);
    setErrors([]); // Clear errors on close
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const sectionVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, delay: i * 0.2, ease: 'easeOut' },
    }),
  };

  const cardVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { y: '100%', opacity: 0, transition: { duration: 0.5, ease: 'easeIn' } },
  };

  return (
    <section className="relative mt-40 max-w-4xl mx-auto px-6 pb-12">
      <motion.h2
        variants={textVariants}
        initial="hidden"
        animate="visible"
        className="text-2xl text-gray-100 font-semibold mb-2 text-center md:text-left"
      >
        Book a Shipment
      </motion.h2>
      <motion.p
        variants={textVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="text-gray-300 mb-8 text-center md:text-left"
      >
        Provide the shipment details below to create your order.
      </motion.p>

      <motion.div initial="hidden" animate="visible" className="space-y-12">
        <motion.div variants={sectionVariants} custom={0}>
          <h3 className="text-xl text-gray-100 font-semibold mb-4">Sender Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              placeholder="Sender Name (e.g., Shawn Ippotle)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('sender name')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="text"
              required
              name="senderStreet1"
              value={formData.senderStreet1}
              onChange={handleChange}
              placeholder="Street 1 (e.g., 215 Clayton St. 12)"
              className={`w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('sender street1')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="text"
              name="senderStreet2"
              value={formData.senderStreet2}
              onChange={handleChange}
              placeholder="Street 2 (optional)"
              className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700"
              disabled={isBooking}
            />
            <input
              type="text"
              required
              name="senderCity"
              value={formData.senderCity}
              onChange={handleChange}
              placeholder="Sender City (e.g., San Francisco)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('sender city')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="text"
              required
              name="senderState"
              value={formData.senderState}
              onChange={handleChange}
              placeholder="Sender State (e.g., CA)"
              maxLength={2}
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('sender state')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="text"
              required
              name="senderZip"
              value={formData.senderZip}
              onChange={handleChange}
              placeholder="Sender ZIP (e.g., 94117)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('sender zip')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="text"
              required
              name="senderPhone"
              value={formData.senderPhone}
              onChange={handleChange}
              placeholder="Phone (e.g., +15553419393)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('sender phone')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="email"
              required
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleChange}
              placeholder="Email (e.g., shippotle@shippo.com)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('sender email')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
          </div>
        </motion.div>

        <motion.div variants={sectionVariants} custom={1}>
          <h3 className="text-xl text-gray-100 font-semibold mb-4">Receiver Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              placeholder="Name (e.g., John Doe)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('receiver name')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="text"
              required
              name="receiverStreet1"
              value={formData.receiverStreet1}
              onChange={handleChange}
              placeholder="Street 1 (e.g., 1 Broadway St.)"
              className={`w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('receiver street1')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="text"
              name="receiverStreet2"
              value={formData.receiverStreet2}
              onChange={handleChange}
              placeholder="Street 2 (e.g., Floor 10)"
              className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700"
              disabled={isBooking}
            />
            <input
              type="text"
              required
              name="receiverCity"
              value={formData.receiverCity}
              onChange={handleChange}
              placeholder="City (e,g., New York)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('receiver city')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="text"
              required
              name="receiverState"
              value={formData.receiverState}
              onChange={handleChange}
              placeholder="State (e.g., NY)"
              maxLength={2}
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('receiver state')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="text"
              required
              name="receiverZip"
              value={formData.receiverZip}
              onChange={handleChange}
              placeholder="ZIP (e.g., 10004)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('receiver zip')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="text"
              required
              name="receiverPhone"
              value={formData.receiverPhone}
              onChange={handleChange}
              placeholder="Phone (e.g., +15553419393)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('receiver phone')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="email"
              name="receiverEmail"
              value={formData.receiverEmail}
              onChange={handleChange}
              placeholder="Email (optional)"
              className="md:w-full p-2 bg-gray-700 text-gray-200 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700"
              disabled={isBooking}
            />
          </div>
        </motion.div>

        <motion.div variants={sectionVariants} custom={2}>
          <h3 className="text-xl text-gray-100 font-semibold mb-4">Parcel Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              name="parcelLength"
              value={formData.parcelLength}
              onChange={handleChange}
              placeholder="Length (e.g., 5)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('parcel length')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="text"
              required
              name="parcelWidth"
              value={formData.parcelWidth}
              onChange={handleChange}
              placeholder="Width (e.g., 5)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('parcel width')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <input
              type="text"
              required
              name="parcelHeight"
              value={formData.parcelHeight}
              onChange={handleChange}
              placeholder="Height (e.g., 5)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('parcel height')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <select
              name="parcelDistanceUnit"
              value={formData.parcelDistanceUnit}
              onChange={handleChange}
              className="md:w-full p-2 bg-gray-700 text-gray-200 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isBooking}
            >
              <option value="in">Inches (in)</option>
              <option value="cm">Centimeters (cm)</option>
            </select>
            <input
              type="text"
              required
              name="parcelWeight"
              value={formData.parcelWeight}
              onChange={handleChange}
              placeholder="Weight (e.g., 2)"
              className={`md:w-full p-2 bg-gray-700 text-gray-200 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 autofill:bg-gray-700 ${
                errors.some((e) => e.includes('parcel weight')) ? 'border-red-500' : 'border-gray-700'
              }`}
              disabled={isBooking}
            />
            <select
              name="parcelMassUnit"
              value={formData.parcelMassUnit}
              onChange={handleChange}
              className="md:w-full p-2 bg-gray-700 text-gray-200 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isBooking}
            >
              <option value="lb">Pounds (lb)</option>
              <option value="kg">Kilograms (kg)</option>
            </select>
          </div>
        </motion.div>
      </motion.div>

      <motion.button
        whileHover={{ scale: isBooking ? 1 : 1.05 }}
        whileTap={{ scale: isBooking ? 1 : 0.95 }}
        onClick={handleBook}
        disabled={isBooking}
        className="mt-6 w-full p-2 bg-white text-black rounded-xl hover:bg-gray-300 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isBooking ? 'Booking' : 'Book Shipment'}
      </motion.button>

      <AnimatePresence>
        {isCardOpen && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800 p-6 rounded-t-lg max-w-3xl mx-auto h-68 overflow-y-auto shadow-lg text-gray-200"
          >
            <h3 className="text-xl font-semibold mb-4">Booking Details</h3>
            {response?.error ? (
              <div className="space-y-4">
                <p className="text-red-400">{response.error}</p>
                {response.messages && response.messages.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-400">Messages: </span>
                    <ul className="mt-2 space-y-2">
                      {response.messages.map((msg, index) => (
                        <li key={index} className="text-gray-400">{msg.text || JSON.stringify(msg)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-gray-400">Shipment ID: </span>
                  <span>{response?.shipment_object_id || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-400">Transaction Status: </span>
                  <span className="capitalize">{response?.transaction_status?.toLowerCase() || 'N/A'}</span>
                </div>
                {response?.tracking_number && (
                  <div>
                    <span className="font-medium text-gray-400">Tracking Number: </span>
                    <span>{response.tracking_number}</span>
                  </div>
                )}
                {response?.label_url && (
                  <div>
                    <span className="font-medium text-gray-400">Label URL: </span>
                    <a href={response.label_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      View Label
                    </a>
                  </div>
                )}
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