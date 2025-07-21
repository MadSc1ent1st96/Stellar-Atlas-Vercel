"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Typewriter } from 'react-simple-typewriter';
import { AnimatePresence, motion } from 'framer-motion';

import Starfield from '../components/Starfield';
import Constellation from '../components/Constellation';
import CometTrail from '../components/CometTrail';
import FloatingPlanets from '../components/FloatingPlanets';
import PageWrapper from '../components/PageWrapper';
import siteConfig from '../site.config';

export default function Home() {
  const [showStarfield, setShowStarfield] = useState(true);
  const [showConstellation, setShowConstellation] = useState(true);
  const [showCometTrail, setShowCometTrail] = useState(true);
  const [showFloatingPlanets, setShowFloatingPlanets] = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [showSupernova, setShowSupernova] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === 's') triggerSupernova();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const triggerSupernova = () => {
    setShowSupernova(true);
    setTimeout(() => setShowSupernova(false), 2500);
  };

  // Mass points calculation
  const baseMasses = Array.from({ length: 201 }, (_, i) => (i * 0.5).toFixed(1)); // 0, 0.5, ..., 100
  const extraMasses = ['0.6', '0.7', '0.8', '0.9', '200', '350', '600', '800', '900'];
  const allMasses = [...baseMasses, ...extraMasses];
  const allMassesUnique = Array.from(new Set(allMasses.map(Number))).sort((a, b) => a - b);
  const totalMassPoints = allMassesUnique.length; // 210
  const metallicities = [
    { label: 'Z = 0.0001', maxMass: 100 },
    { label: 'Z = 0.001', maxMass: 100 },
    { label: 'Z = 0.006', maxMass: 100 },
    { label: 'Z = 0.014', maxMass: 100 },
    { label: 'Z = 0.02', maxMass: 100 },
    { label: 'Z = 0.04', maxMass: 60 }, // Only up to 60 M☉
  ];
  const metallicityMassCounts = metallicities.map(met => {
    if (met.maxMass === 100) return totalMassPoints;
    // For Z=0.04, only count masses <= 60
    return allMassesUnique.filter(m => m <= 60).length;
  });
  const totalSimulationsPerCondition = metallicityMassCounts.reduce((a, b) => a + b, 0);
  // Account for both stopping conditions: Hydrogen exhaustion AND Helium exhaustion
  const totalSimulations = totalSimulationsPerCondition * 2;

  return (
    <PageWrapper>
      <div className="min-h-screen text-white bg-transparent font-sans relative overflow-hidden z-10">
        {/* Background Layers */}
        {showStarfield && <Starfield className="pointer-events-none" />}
        {showConstellation && <Constellation className="pointer-events-none" />}
        {showCometTrail && <CometTrail className="pointer-events-none" />}
        {showFloatingPlanets && <FloatingPlanets className="pointer-events-none" />}
        <div className="fixed top-[30%] left-0 w-full h-[15%] bg-gradient-to-r from-indigo-800/30 via-indigo-300/10 to-purple-800/30 blur-2xl -z-10 rotate-3 pointer-events-none" />

        {/* Supernova Explosion */}
        <AnimatePresence>
          {showSupernova && (
            <motion.div
              className="fixed inset-0 bg-white z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="text-5xl font-bold text-black drop-shadow-xl"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1 }}
              >
                💥 Supernova 💥
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Easter Egg Button */}
        <button
          onClick={triggerSupernova}
          className="fixed bottom-2 right-2 w-6 h-6 rounded-full bg-cyan-500 opacity-10 hover:opacity-40 animate-pulse z-40"
          aria-label="Trigger Supernova"
        />

        <Head>
          <title>Stellar Evolution Atlas</title>
          <meta name="description" content="Visualizing the Lives of Stars" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* Effects Toggle Panel */}
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-cyan-700 transition"
            aria-label="Toggle Effects Panel"
          >
            ⚙️
          </button>
          <AnimatePresence>
            {showPanel && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-3 w-52 p-4 rounded-lg bg-[#111827]/90 backdrop-blur border border-cyan-700 shadow-lg"
              >
                <label className="block mb-2">
                  <input
                    type="checkbox"
                    checked={showStarfield}
                    onChange={() => setShowStarfield(!showStarfield)}
                    className="mr-2"
                  />
                  Show Stars
                </label>
                <label className="block mb-2">
                  <input
                    type="checkbox"
                    checked={showConstellation}
                    onChange={() => setShowConstellation(!showConstellation)}
                    className="mr-2"
                  />
                  Show Constellations
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    checked={showCometTrail}
                    onChange={() => setShowCometTrail(!showCometTrail)}
                    className="mr-2"
                  />
                  Show Comets
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ========== Content Sections ========== */}
        <main className="relative z-10">
          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative px-6 py-24 text-center bg-gradient-to-b from-[#0b0f1a]/60 via-[#111827]/50 to-[#0b0f1a]/60 backdrop-blur-md rounded-b-xl"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-400 mb-4 drop-shadow animate-pulse">
              <Typewriter
                words={["Stellar Evolution Atlas"]}
                loop={1}
                cursor
                typeSpeed={70}
                deleteSpeed={50}
              />
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              A personal astrophysics project by <strong>{siteConfig.author.name}</strong> (BS-MS, {siteConfig.author.institution})
              that simulates and visualizes how stars evolve across time and mass using MESA.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/atlas" className="px-6 py-3 bg-cyan-600 rounded text-white font-semibold hover:bg-cyan-700 transition shadow-md">
                Explore Atlas
              </Link>
              {/* <Link href="/cosmic-playground" className="px-6 py-3 bg-cyan-600 rounded text-white font-semibold hover:bg-cyan-700 transition shadow-md">
                Cosmic Playground
              </Link> */}
              {/* <Link href="/cosmic-observatory" className="px-6 py-3 border border-cyan-500 rounded text-cyan-300 font-semibold hover:bg-cyan-800 transition shadow-md">
                Observatory
              </Link> */}
              <Link href="/project-report" className="px-6 py-3 border border-cyan-500 rounded text-cyan-300 font-semibold hover:bg-cyan-800 transition shadow-md">
                Read Report
              </Link>
            </div>
          </motion.section>

          {/* Features Grid */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "MESA Simulations",
                description: `Each star's life cycle simulated using Modules for Experiments in Stellar Astrophysics with stopping conditions at hydrogen and helium exhaustion.`
              },
              {
                title: "Interactive Atlas",
                description: "Visualize stellar tracks, temperatures, luminosity, and HR diagrams with download support and smooth navigation."
              },
              {
                title: "Gaia DR3 Validation",
                description: "Compare MESA outputs with real star data from the Gaia catalog, confirming theoretical predictions with observations."
              },
              {
                title: "Comprehensive Dataset",
                description: `${totalSimulations} simulations (${totalSimulationsPerCondition} per stopping condition) across mass range (0–100 M☉, step 0.5, plus 0.6, 0.7, 0.8, 0.9, 200, 350, 600, 800, 900 M☉; for Z=0.04, up to 60 M☉) and metallicities (Z = 0.0001, 0.001, 0.006, 0.014, 0.02, 0.04) available on Zenodo.`
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-[#0b0f1a]/30 to-[#111827]/20 backdrop-blur-sm border border-cyan-700 rounded-lg p-6 text-center transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-cyan-500/50 group"
              >
                <h3 className="text-xl font-semibold text-cyan-400 mb-2 group-hover:animate-pulse">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
              </div>
            ))}
          </motion.section>

          {/* Methodology Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto px-6 py-16 bg-gradient-to-br from-[#0b0f1a]/40 to-[#111827]/30 backdrop-blur-sm rounded-lg border border-cyan-500/20"
          >
            <h2 className="text-2xl font-bold text-cyan-300 mb-6 text-center">🔬 Methodology</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Simulation Parameters</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Mass Range:</strong> 0–100 M☉ (step 0.5), plus 0.6, 0.7, 0.8, 0.9, 200, 350, 600, 800, 900 M☉ (for Z=0.04, up to 60 M☉)</li>
                  <li>• <strong>Total Mass Points:</strong> {totalMassPoints} (210 for most metallicities, fewer for Z=0.04)</li>
                  <li>• <strong>Metallicities:</strong> Z = 0.0001, 0.001, 0.006, 0.014, 0.02, 0.04</li>
                  <li>• <strong>Stopping Conditions:</strong> Hydrogen & Helium exhaustion (10⁻⁵) - <strong>2 conditions per simulation</strong></li>
                  <li>• <strong>Total Simulations:</strong> {totalSimulations} ({totalSimulationsPerCondition} × 2 stopping conditions)</li>
                  <li>• <strong>Evolution Tracking:</strong> Core temperature, density, luminosity, radius</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-200 mb-3">Scientific Validation</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Gaia DR3 Comparison:</strong> Real observational data overlay</li>
                  <li>• <strong>HR Diagram Analysis:</strong> Main sequence and post-MS evolution</li>
                  <li>• <strong>Core Evolution:</strong> Temperature-density relationships</li>
                  <li>• <strong>Metallicity Effects:</strong> Opacity and structure impacts</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Quote + Dataset */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-3xl mx-auto text-center px-6 py-16 bg-gradient-to-br from-[#0b0f1a]/40 to-[#111827]/30 backdrop-blur-sm rounded-lg"
          >
            <blockquote className="italic text-gray-400 border-l-4 border-cyan-400 pl-4 text-left">
              "To understand stars is to glimpse the engines of the universe."
            </blockquote>
            <p className="mt-6 text-gray-300">
              The full dataset is available on Zenodo:
            </p>
            <a
              href="https://doi.org/10.5281/zenodo.15571157"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-cyan-400 underline hover:text-cyan-200 transition"
            >
              📂 View Dataset on Zenodo
            </a>
          </motion.section>

          {/* Final CTA */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center py-16 px-6 mt-20 bg-gradient-to-t from-[#0b0f1a]/60 via-[#111827]/50 to-[#0b0f1a]/60 backdrop-blur-md rounded-t-xl"
          >
            <h2 className="text-3xl font-bold text-cyan-400 mb-4 animate-pulse">
              Curious how stars live and die?
            </h2>
            <p className="text-gray-300 mb-6">
              Dive into the Atlas and uncover the secrets of stellar life cycles.
            </p>
            <Link href="/atlas" className="px-6 py-3 bg-cyan-600 rounded text-white font-semibold hover:bg-cyan-700 transition shadow">
              Launch Atlas
            </Link>
          </motion.section>
        </main>

        {/* Footer */}
      </div>
    </PageWrapper>
  );
}
