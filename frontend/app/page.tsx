'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '../components/Header';
import OrderTracking from '../components/OrderTracking';
import ShipmentBooking from '../components/ShipmentBooking';
import HomeLanding from '../components/landing/HomeLanding';

const CalendarPackages = dynamic(() => import('../components/CalendarPackages'), {
  ssr: false,
});

export default function Home() {
  const [activeComponent, setActiveComponent] = useState('home'); // Default to home
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const renderComponent = () => {
    switch (activeComponent) {
      case 'home':
        return <HomeLanding setActiveComponent={setActiveComponent} />;
      case 'track-order':
        return <OrderTracking />;
      case 'book-shipment':
        return <ShipmentBooking />;
      case 'calendar':
        return <CalendarPackages />;
      default:
        return <HomeLanding setActiveComponent={setActiveComponent} />; // Default to home
    }
  };

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="relative flex flex-col items-center justify-between min-h-screen bg-black">
      {/* Background with dots and gradient reveal - 400px radius, more visible */}
      <div
        className="fixed inset-0 bg-black bg-[radial-gradient(circle_400px_at_var(--x)_var(--y),rgba(0,0,0,0)_0%,rgba(0,0,0,0.9)_100%)]"
        style={{
          backgroundImage: `
            radial-gradient(circle 600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9) 100%),
            url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.2)" /></svg>')
          `,
          backgroundSize: 'auto, 20px 20px', // Gradient size, dot pattern size
          backgroundRepeat: 'no-repeat, repeat', // Gradient doesn’t repeat, dots do
        }}
      />
      {/* Content */}
      <div className="relative z-10 w-full">
        <Header activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
        <div className="mt-8 w-full max-w-6xl mx-auto">{renderComponent()}</div>
      </div>
    </main>
  );
}