"use client";

import { motion } from "framer-motion";
import { FaGithub, FaEnvelope } from "react-icons/fa";
import StarsCanvas from "../../components/StarsCanvas";
import OrbitingPlanets from "../../components/OrbitingPlanets";
import MouseTrail from "../../components/MouseTrail";
import ConstellationReveal from "../../components/ConstellationReveal";
import PageWrapper from "../../components/PageWrapper";
import { useEffect, useState } from "react";
import siteConfig from '../../site.config';

export default function AboutProject() {
  const [showSolarSystem, setShowSolarSystem] = useState(false);

  useEffect(() => {
    function handleResize() {
      setShowSolarSystem(window.innerWidth >= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <PageWrapper>
      <div className="relative min-h-screen bg-[#0b0f1a] text-white overflow-hidden">
        {/* Background visuals */}
        <StarsCanvas />
        <ConstellationReveal />
        {showSolarSystem && <OrbitingPlanets />}
        <MouseTrail />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-4 sm:px-8 md:px-16 lg:px-32 py-12"
        >
          <h1 className="text-3xl font-bold mb-8 text-center text-cyan-400 drop-shadow-md">
            About the Project
          </h1>

          <div className="max-w-3xl mx-auto space-y-8 text-gray-300 text-lg leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Hi, I'm{" "}
              <span className="text-cyan-400 font-bold animate-pulse">
                {siteConfig.author.name}
              </span>{" "}
              — a 3rd-year BS-MS student at {siteConfig.author.institution}, passionate about
              stars, simulations, and visual science communication. Visit my{" "}
              <a
                href={siteConfig.author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 underline hover:text-cyan-200"
              >
                personal website
              </a>.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <em>Stellar Evolution Atlas</em> is a deeply personal initiative
              to archive and visualize the life stories of stars through
              extensive MESA simulations. It explores how stars of different
              masses and metallicities evolve, comparing synthetic data with
              observations.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="mb-2">Key visualizations include:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Hertzsprung–Russell Diagrams (HRDs)</li>
                <li>Core Temperature vs Core Density (Tc vs ρc)</li>
                <li>Age vs Radius</li>
                <li>Age vs Luminosity</li>
                <li>Central Hydrogen Fraction vs Time</li>
              </ul>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Full explanations are available in the{" "}
              <a
                href="/project-report"
                className="text-cyan-400 underline hover:text-cyan-300"
              >
                project report
              </a>.
            </motion.p>

            {/* Personal Quote Block */}
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-[#0f172a]/70 to-[#0b0f1a]/70 border-l-4 border-cyan-500 text-cyan-200 italic px-6 py-5 rounded-lg shadow-md backdrop-blur-sm mx-auto max-w-2xl"
            >
              <p className="text-lg leading-relaxed">
                “Gravity is not a force, it is the result of mass — the proof
                of existence.”
              </p>
              <footer className="text-right text-sm text-cyan-400 mt-3">
                — Aniket Mishra
              </footer>
            </motion.blockquote>

            <hr className="border-gray-700" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
                📂 Dataset Access
              </h2>
              <p>
                The full dataset (~2350 simulations) is archived at:
                <br />
                <a
                  href="https://zenodo.org/communities/mesa/records"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 underline hover:text-cyan-200"
                >
                  🔗 Zenodo Community
                </a>
              </p>
            </motion.div>

            <hr className="border-gray-700" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
                🔧 Tools & Libraries Used
              </h2>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  <strong>MESA</strong> – Stellar evolution engine
                </li>
                <li>
                  <strong>FFmpeg</strong> – PGStar animations
                </li>
                <li>
                  <strong>Python</strong> – NumPy, pandas, matplotlib
                </li>
                <li>
                  <strong>mesa_reader</strong> – MESA data parsing
                </li>
                <li>
                  <strong>Bash</strong> – Pipeline scripting
                </li>
                <li>
                  <strong>Streamlit</strong> – Initial prototype
                </li>
                <li>
                  <strong>Next.js + Tailwind</strong> – Final UI
                </li>
                <li>
                  <strong>Typst</strong> – Report styling
                </li>
              </ul>
            </motion.div>

            <hr className="border-gray-700" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-2xl font-semibold text-cyan-300 mb-2">
                📬 Contact
              </h2>
              <ul className="list-disc ml-6 space-y-1">
                <li className="transition-transform duration-200 ease-in-out hover:scale-110 hover:text-cyan-300">
                  <FaEnvelope className="inline mr-2 text-cyan-400" />
                  <a
                    href={`mailto:${siteConfig.author.email}`}
                    className="hover:underline"
                  >
                    {siteConfig.author.email}
                  </a>
                </li>
                <li className="transition-transform duration-200 ease-in-out hover:scale-110 hover:text-cyan-300">
                  <FaEnvelope className="inline mr-2 text-cyan-400" />
                  <a
                    href={`mailto:${siteConfig.author.altEmail}`}
                    className="hover:underline"
                  >
                    {siteConfig.author.altEmail}
                  </a>
                </li>
                <li className="transition-transform duration-200 ease-in-out hover:scale-110 hover:text-cyan-300">
                  <FaGithub className="inline mr-2 text-cyan-400" />
                  <a
                    href={siteConfig.social.github}
                    className="hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {siteConfig.social.github.replace('https://', '')}
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* ✅ Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-12 text-lg text-gray-300"
            >
              <p>
                ✨ <em>Have ideas, questions, or want to collaborate?</em>
                <br />
                Reach out via{" "}
                <a
                  href={`mailto:${siteConfig.author.email}`}
                  className="text-cyan-400 underline hover:text-cyan-300"
                >
                  email
                </a>{" "}
                or check out the{" "}
                <a
                  href="https://zenodo.org/communities/mesa/records"
                  className="text-cyan-400 underline hover:text-cyan-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Zenodo archive
                </a>
                .
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* ✅ Footer */}
      </div>
    </PageWrapper>
  );
}
