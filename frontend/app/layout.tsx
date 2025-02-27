'use client';

import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { Poppins } from 'next/font/google'; // Updated import path
import './globals.css';

// Define Poppins font outside the component
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [activeComponent, setActiveComponent] = useState<string>('');

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <html lang="en" className={poppins.className}> {/* Apply font to html */}
      <body className="min-h-screen">
        <Header activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
        {children}
      </body>
    </html>
  );
}