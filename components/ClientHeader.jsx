"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import siteConfig from '../site.config.js';

export default function ClientHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);
    window.addEventListener('routeChangeStart', handleStart);
    window.addEventListener('routeChangeComplete', handleComplete);
    window.addEventListener('routeChangeError', handleComplete);
    
    return () => {
      window.removeEventListener('routeChangeStart', handleStart);
      window.removeEventListener('routeChangeComplete', handleComplete);
      window.removeEventListener('routeChangeError', handleComplete);
    };
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/atlas", label: "Atlas" },
    { href: "/project-report", label: "Report" },
    { href: "/about", label: "About" },
    { href: "/star-evolution", label: "Star Evolution" }
  ];

  return (
    <>
      {/* Stellar Pulse Loader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-[#0b0f1ae6] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo/Brand - Left Side */}
          <motion.div 
            className="flex items-center flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <h1 className="text-xl font-bold text-white">
              {siteConfig.siteTitle}
            </h1>
          </motion.div>

          {/* Centered Navigation - Desktop Only */}
          <nav className="hidden md:flex items-center justify-center flex-1 space-x-8">
            {navItems.map((item) => (
              <motion.div key={item.href} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {pathname === item.href && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"
                      layoutId="activeTab"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side - Dataset Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Dataset Button - Desktop */}
            <motion.div 
              className="hidden md:block"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                href={siteConfig.social?.dataset || 'https://zenodo.org'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-cyan-300 bg-gray-800 hover:bg-gray-700 border border-cyan-500/50 hover:border-cyan-400/70 rounded-md transition-all duration-200 shadow-sm hover:shadow-cyan-500/20"
              >
                Dataset
              </a>
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                className="text-white hover:text-gray-300 focus:outline-none p-2"
                onClick={() => setMenuOpen(!menuOpen)}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle Menu"
              >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                  <motion.div 
                    className="w-5 h-0.5 bg-current mb-1"
                    animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  />
                  <motion.div 
                    className="w-5 h-0.5 bg-current mb-1"
                    animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                  />
                  <motion.div 
                    className="w-5 h-0.5 bg-current"
                    animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 border-t border-gray-800"
            >
              <div className="px-6 py-4 space-y-1">
                {navItems.map((item) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'text-white bg-gray-800/50'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                {/* Dataset Link - Mobile */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <a
                    href={siteConfig.social?.dataset || 'https://zenodo.org'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/30 transition-colors"
                  >
                    Dataset
                  </a>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      
      {/* Spacer to prevent content from going under the fixed header */}
      <div className="h-16 md:h-16"></div>
    </>
  );
} 