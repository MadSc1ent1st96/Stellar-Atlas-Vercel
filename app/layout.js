
import './globals.css';
import { Inter } from 'next/font/google';
import ClientHeader from '../components/ClientHeader';
import Footer from '../components/Footer';
import siteConfig from '../site.config.js';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: siteConfig.siteTitle,
  description: siteConfig.siteDescription,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`bg-[#0b0f1a] text-white font-sans min-h-screen ${inter.className}`}>
        {/* Floating Planet Decorations */}
        <div className="fixed top-[-50px] left-[-50px] w-32 h-32 rounded-full bg-gradient-to-tr from-purple-600 via-blue-500 to-cyan-400 opacity-30 blur-2xl animate-spin-slow z-0" />
        <div className="fixed bottom-[-40px] right-[-40px] w-24 h-24 rounded-full bg-gradient-to-bl from-yellow-400 via-pink-500 to-red-600 opacity-25 blur-xl animate-pulse-slow z-0" />
        {/* Header (Client) */}
        <ClientHeader />
        <main className="max-w-7xl mx-auto px-4 py-10 animate-fadeInUp fade-in ease-in duration-500">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
