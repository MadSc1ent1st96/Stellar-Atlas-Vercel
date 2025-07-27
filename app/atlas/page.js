"use client";

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Typewriter } from 'react-simple-typewriter';
import JSZip from 'jszip';
import PageWrapper from '../../components/PageWrapper';
import StarsCanvas from '../../components/StarsCanvas';
import ConstellationReveal from '../../components/ConstellationReveal';
import MouseTrail from '../../components/MouseTrail';
import siteConfig from '../../site.config';

// Utility function to check if device is mobile
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Utility function to check network status
const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine);
      
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setConnectionType(connection.effectiveType || 'unknown');
      }
    };

    updateNetworkStatus();
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  return { isOnline, connectionType };
};

const stopGroups = ['Hydrogen-Exhaustion', 'Helium-Exhaustion'];
const sections = ['Project Overview', 'ZAMS Plot', 'Star Simulations'];
const zGroups = [
  { label: 'Z = 0.0001', folder: 'Z = 0.0001' },
  { label: 'Z = 0.001', folder: 'Z = 0.001' },
  { label: 'Z = 0.006', folder: 'Z = 0.006' },
  { label: 'Z = 0.014', folder: 'Z = 0.014' },
  { label: 'Z = 0.02', folder: 'Z = 0.02' },
  { label: 'Z = 0.04', folder: 'Z = 0.04' },
  { label: 'Individual Example', folder: 'Individual-Example' }
];
const exampleMasses = ['1Msun', '20Msun', '50Msun'];

function DisplayImage({ title, src, markdown, explanation }) {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { isOnline, connectionType } = useNetworkStatus();

  useEffect(() => { 
    setImgError(false); 
    setIsLoading(true);
    setIsMobile(isMobileDevice());
    
    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log('Image loading timeout for:', src);
        setIsLoading(false);
      }
    }, 5000); // 5 second timeout
    
    return () => clearTimeout(timeout);
  }, [src]);

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', src);
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.error('Image loading error for:', src);
    setImgError(true);
    setIsLoading(false);
  };

  return (
    <div className="my-10 text-center">
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-cyan-300">{title}</h3>
      {!imgError ? (
        <div className="relative">
          <img
            src={src}
            alt={title}
            className="w-full max-w-2xl sm:max-w-xl mx-auto rounded shadow-md"
            onLoad={handleImageLoad}
            onError={handleImageError}
            onLoadStart={() => console.log('Image load started:', src)}
            onLoadEnd={() => console.log('Image load ended:', src)}
            loading="lazy"
          />
          {isLoading && (
            <div className="absolute inset-0 w-full max-w-2xl sm:max-w-xl mx-auto rounded shadow-md bg-gray-800 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <span className="text-gray-400 text-sm">Loading image...</span>
              </div>
            </div>
          )}
        </div>
              ) : (
          <div className="w-full max-w-2xl sm:max-w-xl mx-auto rounded shadow-md bg-gray-800 flex items-center justify-center h-64">
            <div className="text-center">
              <span className="text-gray-400 block mb-2">Image not available</span>
              {isMobile && (
                <div className="text-gray-500 text-sm space-y-1">
                  <span className="block">Try refreshing the page</span>
                  {!isOnline && (
                    <span className="block text-red-400">You appear to be offline</span>
                  )}
                  {connectionType === 'slow-2g' || connectionType === '2g' && (
                    <span className="block text-yellow-400">Slow connection detected</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      {explanation && (
        <div className="prose prose-invert text-left mx-auto max-w-2xl mt-4">
          <p className="text-gray-300">{explanation}</p>
        </div>
      )}
      {markdown && <div className="prose prose-invert text-left mx-auto max-w-2xl mt-4"><ReactMarkdown>{markdown}</ReactMarkdown></div>}
    </div>
  );
}

function DisplayVideo({ title, src, explanation }) {
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const { isOnline, connectionType } = useNetworkStatus();

  useEffect(() => { 
    setVideoError(false); 
    setIsLoading(true);
    setIsMobile(isMobileDevice());
    
    // On mobile, delay video loading to improve initial page load
    if (isMobileDevice()) {
      const timer = setTimeout(() => setShouldLoadVideo(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShouldLoadVideo(true);
    }
  }, [src]);

  const handleVideoLoad = () => {
    setIsLoading(false);
  };

  const handleVideoError = (error) => {
    console.error('Video loading error:', error);
    setVideoError(true);
    setIsLoading(false);
  };

  const handleLoadVideo = () => {
    if (isMobile && !shouldLoadVideo) {
      setShouldLoadVideo(true);
    }
  };

  return (
    <div className="my-10 text-center">
      <h3 className="text-lg sm:text-xl font-semibold mb-2 text-cyan-300">{title}</h3>
      {!videoError ? (
        <div className="relative">
          {isLoading && (
            <div 
              className="w-full max-w-2xl sm:max-w-xl mx-auto rounded shadow-md bg-gray-800 flex items-center justify-center h-64 cursor-pointer"
              onClick={handleLoadVideo}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <span className="text-gray-400 text-sm">
                  {isMobile && !shouldLoadVideo ? 'Tap to load video...' : 'Loading video...'}
                </span>
              </div>
            </div>
          )}
          {(shouldLoadVideo || !isMobile) && (
            <video
              key={src}
              controls
              preload="metadata"
              playsInline
              className={`w-full max-w-2xl sm:max-w-xl mx-auto rounded shadow-md ${isLoading ? 'hidden' : ''}`}
              onLoadStart={handleVideoLoad}
              onCanPlay={handleVideoLoad}
              onError={handleVideoError}
              onLoadedData={handleVideoLoad}
            >
              <source src={src} type="video/mp4" />
              <source src={src} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
              ) : (
          <div className="w-full max-w-2xl sm:max-w-xl mx-auto rounded shadow-md bg-gray-800 flex items-center justify-center h-64">
            <div className="text-center">
              <span className="text-gray-400 block mb-2">Video not available</span>
              {isMobile && (
                <div className="text-gray-500 text-sm space-y-1">
                  <span className="block">Try refreshing the page</span>
                  {!isOnline && (
                    <span className="block text-red-400">You appear to be offline</span>
                  )}
                  {connectionType === 'slow-2g' || connectionType === '2g' && (
                    <span className="block text-yellow-400">Slow connection detected</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      {explanation && (
        <div className="prose prose-invert text-left mx-auto max-w-2xl mt-4">
          <p className="text-gray-300">{explanation}</p>
        </div>
      )}
    </div>
  );
}

const explanations = {
  'ZAMS Plot': [
    {
      title: "ZAMS Plot (Z=0.014)",
      src: "/work/ZAMS_H_0.014.png",
      explanation: "This plot shows the Zero Age Main Sequence (ZAMS) for stars at solar metallicity (Z = 0.014). The ZAMS represents the initial positions of stars when they first begin hydrogen fusion in their cores. Stars of different masses are plotted along this sequence, showing the relationship between mass, luminosity, and temperature at the start of their main sequence evolution."
    },
    {
      title: "ZAMS All Metallicities",
      src: "/work/ZAMS_All_Metallicities.png",
      explanation: "This comprehensive plot displays ZAMS positions for 6 different metallicities, demonstrating how metallicity affects stellar structure and evolution. Lower metallicity stars tend to be hotter and more luminous at equivalent masses due to reduced opacity, while higher metallicity stars are cooler and less luminous. This plot illustrates the fundamental impact of chemical composition on stellar properties."
    }
  ]
};

  const markdownContent = {
    'Hydrogen-Exhaustion': {
    'Introduction': `Hydrogen exhaustion marks the end of the main sequence for a star. This phase is characterized by the depletion of core hydrogen below a threshold value (typically 10⁻⁵), after which the core contracts and outer layers expand. Our simulations capture this transition in detail, showing how mass and metallicity affect the timing and scale of hydrogen exhaustion.`,
    'Discussion': `The results reaffirm that stellar evolution is primarily governed by initial mass and metallicity. Higher-mass stars exhaust their hydrogen faster due to higher core temperatures and fusion rates. Lower-metallicity stars tend to be hotter and more luminous at equivalent masses due to reduced opacity. Evolutionary tracks show clear differences in lifetimes, HRD slopes, and core behavior.`,
    'Comparison': `To validate the simulations, HR diagrams were compared with real observational data from Gaia DR3. The overlay confirms a strong match in the main sequence regime, especially for intermediate-mass stars. Deviations at the low-mass or high-luminosity ends highlight the need for future improvements in modeling stellar winds and rotation.`,
    'Conclusion': `Simulations until hydrogen exhaustion successfully reproduce classical stellar evolution features. The results highlight consistent trends in HR diagrams, core temperature-density tracks, and main-sequence widths across metallicities. Hydrogen exhaustion serves as a reliable stopping point for observing early stellar evolution.`
    },
    'Helium-Exhaustion': {
    'Introduction': `Simulations with this stopping condition continue beyond hydrogen burning until the central helium fraction falls below 10⁻⁵. This allows tracking stellar behavior through the red giant branch, horizontal branch, and early AGB phases. The tracks reveal thermal pulses, shell burning, and core helium fusion, all dependent on initial conditions.`,
    'Discussion': `The HR diagrams now include red giant branches and post-main-sequence loops. High-mass stars progress rapidly to advanced stages, showing core contraction and temperature spikes. Low-mass stars evolve more gently, with longer red giant phases. Metallicity modifies loop extent and thermal pulse frequency.`,
    'Comparison': `Comparing helium-depletion tracks to Gaia DR3 data confirms the expected extension of stars beyond the main sequence. Many red giants and subgiants align with predicted tracks. Slight deviations could stem from observational uncertainties or binary interaction effects.`,
    'Conclusion': `Simulating evolution until helium exhaustion allows deeper insight into the late stages of stellar life. This stage reveals critical transitions and instabilities in stellar structure, especially in intermediate- and high-mass regimes. The tracks match both theoretical predictions and observed populations.`
  }
};

const simulationData = {
  'Hydrogen-Exhaustion': {
    'Z = 0.0001': [
      { type: 'image', title: 'HR Diagram with Gaia Overlay', src: '/work/Hydrogen-Exhaustion/Z = 0.0001/HRD_Gaia_MESA_AutoOverlay.png', explanation: 'HR diagram for stars at very low metallicity (Z = 0.0001) with Gaia observational data overlaid for comparison. This shows how well our simulations match real stellar observations.' },
      { type: 'image', title: 'HR Diagram Highlighted', src: '/work/Hydrogen-Exhaustion/Z = 0.0001/HRD_highlighted.png', explanation: 'HR diagram with highlighted evolutionary tracks showing the main sequence and post-main sequence evolution for very low metallicity stars.' },
      { type: 'image', title: 'Core Temperature vs Density', src: '/work/Hydrogen-Exhaustion/Z = 0.0001/Tc_Rhoc.png', explanation: 'Core temperature versus density evolution showing the central conditions of stars at very low metallicity (Z = 0.0001) as they evolve from the main sequence to hydrogen exhaustion.' },
      { type: 'image', title: 'Central Hydrogen Abundance', src: '/work/Hydrogen-Exhaustion/Z = 0.0001/Central_H.png', explanation: 'Evolution of central hydrogen abundance showing how hydrogen is depleted in the core as stars evolve at very low metallicity.' },
      { type: 'image', title: 'Age vs Radius', src: '/work/Hydrogen-Exhaustion/Z = 0.0001/Age_Radius.png', explanation: 'Radius evolution showing how stellar size changes with age for stars at very low metallicity (Z = 0.0001).' },
      { type: 'image', title: 'Age vs Luminosity', src: '/work/Hydrogen-Exhaustion/Z = 0.0001/Age_Luminosity.png', explanation: 'Luminosity evolution showing brightness changes over time for stars at very low metallicity.' },
      { type: 'video', title: 'Age vs Luminosity Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.0001/age_vs_luminosity_evolution.mp4', explanation: 'Animated evolution showing how luminosity changes with age for stars at very low metallicity.' },
      { type: 'video', title: 'Age vs Radius Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.0001/age_vs_radius_evolution.mp4', explanation: 'Animated evolution showing how stellar radius changes with age for very low metallicity stars.' },
      { type: 'video', title: 'Central Hydrogen Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.0001/central_H_vs_time_evolution.mp4', explanation: 'Animated evolution showing how central hydrogen abundance decreases over time for very low metallicity stars.' },
      { type: 'video', title: 'Core Temperature-Density Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.0001/Tc_vs_rhoc_evolution.mp4', explanation: 'Animated core evolution showing how central temperature and density change throughout stellar evolution at very low metallicity.' },
      { type: 'video', title: 'HR Mass Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.0001/hr_mass_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of stars of different masses at very low metallicity.' },
    ],
    'Z = 0.001': [
      { type: 'image', title: 'HR Diagram with Gaia Overlay', src: '/work/Hydrogen-Exhaustion/Z = 0.001/HRD_Gaia_MESA_AutoOverlay.png', explanation: 'HR diagram for stars at low metallicity (Z = 0.001) with Gaia observational data overlaid for comparison.' },
      { type: 'image', title: 'HR Diagram Highlighted', src: '/work/Hydrogen-Exhaustion/Z = 0.001/HRD_highlighted.png', explanation: 'HR diagram with highlighted evolutionary tracks showing the main sequence and post-main sequence evolution for low metallicity stars.' },
      { type: 'image', title: 'Core Temperature vs Density', src: '/work/Hydrogen-Exhaustion/Z = 0.001/Tc_Rhoc.png', explanation: 'Core temperature versus density evolution showing the central conditions of stars at low metallicity.' },
      { type: 'image', title: 'Central Hydrogen Abundance', src: '/work/Hydrogen-Exhaustion/Z = 0.001/Central_H.png', explanation: 'Evolution of central hydrogen abundance showing how hydrogen is depleted in the core as stars evolve at low metallicity.' },
      { type: 'image', title: 'Age vs Radius', src: '/work/Hydrogen-Exhaustion/Z = 0.001/Age_Radius.png', explanation: 'Radius evolution showing how stellar size changes with age for stars at low metallicity (Z = 0.001).' },
      { type: 'image', title: 'Age vs Luminosity', src: '/work/Hydrogen-Exhaustion/Z = 0.001/Age_Luminosity.png', explanation: 'Luminosity evolution showing brightness changes over time for stars at low metallicity.' },
      { type: 'video', title: 'Age vs Luminosity Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.001/age_vs_luminosity_evolution.mp4', explanation: 'Animated evolution showing how luminosity changes with age for stars at low metallicity.' },
      { type: 'video', title: 'Age vs Radius Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.001/age_vs_radius_evolution.mp4', explanation: 'Animated evolution showing how stellar radius changes with age for low metallicity stars.' },
      { type: 'video', title: 'Central Hydrogen Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.001/central_H_vs_time_evolution.mp4', explanation: 'Animated evolution showing how central hydrogen abundance decreases over time for low metallicity stars.' },
      { type: 'video', title: 'Core Temperature-Density Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.001/Tc_vs_rhoc_evolution.mp4', explanation: 'Animated core evolution showing how central temperature and density change throughout stellar evolution at low metallicity.' },
      { type: 'video', title: 'HR Mass Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.001/hr_mass_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of stars of different masses at low metallicity.' },
    ],
    'Z = 0.006': [
      { type: 'image', title: 'HR Diagram with Gaia Overlay', src: '/work/Hydrogen-Exhaustion/Z = 0.006/HRD_Gaia_MESA_AutoOverlay.png', explanation: 'HR diagram for stars at medium metallicity (Z = 0.006) with Gaia observational data overlaid for comparison.' },
      { type: 'image', title: 'HR Diagram Highlighted', src: '/work/Hydrogen-Exhaustion/Z = 0.006/HRD_highlighted.png', explanation: 'HR diagram with highlighted evolutionary tracks showing the main sequence and post-main sequence evolution for medium metallicity stars.' },
      { type: 'image', title: 'Core Temperature vs Density', src: '/work/Hydrogen-Exhaustion/Z = 0.006/Tc_Rhoc.png', explanation: 'Core temperature versus density evolution showing the central conditions of stars at medium metallicity.' },
      { type: 'image', title: 'Central Hydrogen Abundance', src: '/work/Hydrogen-Exhaustion/Z = 0.006/Central_H.png', explanation: 'Evolution of central hydrogen abundance showing how hydrogen is depleted in the core as stars evolve at medium metallicity.' },
      { type: 'image', title: 'Age vs Radius', src: '/work/Hydrogen-Exhaustion/Z = 0.006/Age_Radius.png', explanation: 'Radius evolution showing how stellar size changes with age for stars at medium metallicity (Z = 0.006).' },
      { type: 'image', title: 'Age vs Luminosity', src: '/work/Hydrogen-Exhaustion/Z = 0.006/Age_Luminosity.png', explanation: 'Luminosity evolution showing brightness changes over time for stars at medium metallicity.' },
      { type: 'video', title: 'Age vs Luminosity Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.006/age_vs_luminosity_evolution.mp4', explanation: 'Animated evolution showing how luminosity changes with age for stars at medium metallicity.' },
      { type: 'video', title: 'Age vs Radius Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.006/age_vs_radius_evolution.mp4', explanation: 'Animated evolution showing how stellar radius changes with age for medium metallicity stars.' },
      { type: 'video', title: 'Central Hydrogen Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.006/central_H_vs_time_evolution.mp4', explanation: 'Animated evolution showing how central hydrogen abundance decreases over time for medium metallicity stars.' },
      { type: 'video', title: 'Core Temperature-Density Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.006/Tc_vs_rhoc_evolution.mp4', explanation: 'Animated core evolution showing how central temperature and density change throughout stellar evolution at medium metallicity.' },
      { type: 'video', title: 'HR Mass Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.006/hr_mass_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of stars of different masses at medium metallicity.' },
    ],
    'Z = 0.014': [
      { type: 'image', title: 'HR Diagram with Gaia Overlay', src: '/work/Hydrogen-Exhaustion/Z = 0.014/HRD_Gaia_MESA_AutoOverlay.png', explanation: 'HR diagram for stars at solar metallicity (Z = 0.014) with Gaia observational data overlaid for comparison.' },
      { type: 'image', title: 'HR Diagram Highlighted', src: '/work/Hydrogen-Exhaustion/Z = 0.014/HRD_highlighted.png', explanation: 'HR diagram with highlighted evolutionary tracks showing the main sequence and post-main sequence evolution for solar metallicity stars.' },
      { type: 'image', title: 'Core Temperature vs Density', src: '/work/Hydrogen-Exhaustion/Z = 0.014/Tc_Rhoc.png', explanation: 'Core temperature versus density evolution showing the central conditions of stars at solar metallicity.' },
      { type: 'image', title: 'Central Hydrogen Abundance', src: '/work/Hydrogen-Exhaustion/Z = 0.014/Central_H.png', explanation: 'Evolution of central hydrogen abundance showing how hydrogen is depleted in the core as stars evolve at solar metallicity.' },
      { type: 'image', title: 'Age vs Radius', src: '/work/Hydrogen-Exhaustion/Z = 0.014/Age_Radius.png', explanation: 'Radius evolution showing how stellar size changes with age for stars at solar metallicity (Z = 0.014).' },
      { type: 'image', title: 'Age vs Luminosity', src: '/work/Hydrogen-Exhaustion/Z = 0.014/Age_Luminosity.png', explanation: 'Luminosity evolution showing brightness changes over time for stars at solar metallicity.' },
      { type: 'video', title: 'Age vs Luminosity Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.014/age_vs_luminosity_evolution.mp4', explanation: 'Animated evolution showing how luminosity changes with age for stars at solar metallicity.' },
      { type: 'video', title: 'Age vs Radius Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.014/age_vs_radius_evolution.mp4', explanation: 'Animated evolution showing how stellar radius changes with age for solar metallicity stars.' },
      { type: 'video', title: 'Central Hydrogen Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.014/central_H_vs_time_evolution.mp4', explanation: 'Animated evolution showing how central hydrogen abundance decreases over time for solar metallicity stars.' },
      { type: 'video', title: 'Core Temperature-Density Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.014/Tc_vs_rhoc_evolution.mp4', explanation: 'Animated core evolution showing how central temperature and density change throughout stellar evolution at solar metallicity.' },
      { type: 'video', title: 'HR Mass Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.014/hr_mass_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of stars of different masses at solar metallicity.' },
    ],
    'Z = 0.02': [
      { type: 'image', title: 'HR Diagram with Gaia Overlay', src: '/work/Hydrogen-Exhaustion/Z = 0.02/HRD_Gaia_MESA_AutoOverlay.png', explanation: 'HR diagram for stars at high metallicity (Z = 0.02) with Gaia observational data overlaid for comparison.' },
      { type: 'image', title: 'HR Diagram Highlighted', src: '/work/Hydrogen-Exhaustion/Z = 0.02/HRD_highlighted.png', explanation: 'HR diagram with highlighted evolutionary tracks showing the main sequence and post-main sequence evolution for high metallicity stars.' },
      { type: 'image', title: 'Core Temperature vs Density', src: '/work/Hydrogen-Exhaustion/Z = 0.02/Tc_Rhoc.png', explanation: 'Core temperature versus density evolution showing the central conditions of stars at high metallicity.' },
      { type: 'image', title: 'Central Hydrogen Abundance', src: '/work/Hydrogen-Exhaustion/Z = 0.02/Central_H.png', explanation: 'Evolution of central hydrogen abundance showing how hydrogen is depleted in the core as stars evolve at high metallicity.' },
      { type: 'video', title: 'HR Mass Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.02/hr_mass_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of stars of different masses at high metallicity.' },
    ],
    'Z = 0.04': [
      { type: 'image', title: 'HR Diagram with Gaia Overlay', src: '/work/Hydrogen-Exhaustion/Z = 0.04/HRD_Gaia_MESA_AutoOverlay.png', explanation: 'HR diagram for stars at very high metallicity (Z = 0.04) with Gaia observational data overlaid for comparison.' },
      { type: 'image', title: 'HR Diagram Highlighted', src: '/work/Hydrogen-Exhaustion/Z = 0.04/HRD_highlighted.png', explanation: 'HR diagram with highlighted evolutionary tracks showing the main sequence and post-main sequence evolution for very high metallicity stars.' },
      { type: 'image', title: 'Core Temperature vs Density', src: '/work/Hydrogen-Exhaustion/Z = 0.04/Tc_Rhoc.png', explanation: 'Core temperature versus density evolution showing the central conditions of stars at very high metallicity.' },
      { type: 'image', title: 'Central Hydrogen Abundance', src: '/work/Hydrogen-Exhaustion/Z = 0.04/Central_H.png', explanation: 'Evolution of central hydrogen abundance showing how hydrogen is depleted in the core as stars evolve at very high metallicity.' },
      { type: 'video', title: 'HR Mass Evolution', src: '/work/Hydrogen-Exhaustion/Z = 0.04/hr_mass_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of stars of different masses at very high metallicity.' },
    ],
    'Individual Example': {
      '1Msun': [
        { type: 'image', title: 'HR Diagram', src: '/work/Hydrogen-Exhaustion/Individual-Example/1Msun/hr_diagram.png', explanation: 'HR diagram for a 1 solar mass star at very low metallicity (Z = 0.0001). Shows the evolutionary track of a star with minimal metallicity.' },
        { type: 'image', title: 'Core Temp vs Density', src: '/work/Hydrogen-Exhaustion/Individual-Example/1Msun/Tc_vs_rhoc.png', explanation: 'Core evolution showing the internal conditions of this very low metallicity star.' },
        { type: 'image', title: 'Age vs Radius', src: '/work/Hydrogen-Exhaustion/Individual-Example/1Msun/age_vs_radius.png', explanation: 'Radius evolution showing the size changes of this very low metallicity star.' },
        { type: 'image', title: 'Age vs Luminosity', src: '/work/Hydrogen-Exhaustion/Individual-Example/1Msun/age_vs_luminosity.png', explanation: 'Luminosity evolution showing the brightness changes of this very low metallicity star.' },
        { type: 'video', title: 'HR Evolution', src: '/work/Hydrogen-Exhaustion/Individual-Example/1Msun/hr_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of this very low metallicity star.' },
        { type: 'video', title: 'TRho Evolution', src: '/work/Hydrogen-Exhaustion/Individual-Example/1Msun/TRho_evolution.mp4', explanation: 'Animated core evolution showing the internal changes of this very low metallicity star.' },
      ],
      '20Msun': [
        { type: 'image', title: 'HR Diagram', src: '/work/Hydrogen-Exhaustion/Individual-Example/20Msun/hr_diagram.png', explanation: 'HR diagram for a 20 solar mass star at very low metallicity, showing the evolutionary track of a massive star with minimal metallicity.' },
        { type: 'image', title: 'Core Temp vs Density', src: '/work/Hydrogen-Exhaustion/Individual-Example/20Msun/Tc_vs_rhoc.png', explanation: 'Core evolution showing the internal structure and conditions of this massive star at minimal metallicity.' },
        { type: 'image', title: 'Age vs Radius', src: '/work/Hydrogen-Exhaustion/Individual-Example/20Msun/age_vs_radius.png', explanation: 'Radius evolution showing the size changes of this massive star at minimal metallicity.' },
        { type: 'image', title: 'Age vs Luminosity', src: '/work/Hydrogen-Exhaustion/Individual-Example/20Msun/age_vs_luminosity.png', explanation: 'Luminosity evolution showing the brightness changes of this massive star at minimal metallicity.' },
        { type: 'video', title: 'HR Evolution', src: '/work/Hydrogen-Exhaustion/Individual-Example/20Msun/hr_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of this massive star at minimal metallicity.' },
        { type: 'video', title: 'TRho Evolution', src: '/work/Hydrogen-Exhaustion/Individual-Example/20Msun/TRho_evolution.mp4', explanation: 'Animated core evolution showing the internal changes of this massive star at minimal metallicity.' },
      ],
      '50Msun': [
        { type: 'image', title: 'HR Diagram', src: '/work/Hydrogen-Exhaustion/Individual-Example/50Msun/hr_diagram.png', explanation: 'HR diagram for an extremely massive 50 solar mass star at very low metallicity, showing the evolutionary track of an extremely massive star with minimal metallicity.' },
        { type: 'image', title: 'Core Temp vs Density', src: '/work/Hydrogen-Exhaustion/Individual-Example/50Msun/Tc_vs_rhoc.png', explanation: 'Core evolution showing the extreme internal conditions of this extremely massive star at minimal metallicity.' },
        { type: 'image', title: 'Age vs Radius', src: '/work/Hydrogen-Exhaustion/Individual-Example/50Msun/age_vs_radius.png', explanation: 'Radius evolution showing the dramatic size changes of this extremely massive star at minimal metallicity.' },
        { type: 'image', title: 'Age vs Luminosity', src: '/work/Hydrogen-Exhaustion/Individual-Example/50Msun/age_vs_luminosity.png', explanation: 'Luminosity evolution showing the extreme brightness changes of this extremely massive star at minimal metallicity.' },
        { type: 'video', title: 'HR Evolution', src: '/work/Hydrogen-Exhaustion/Individual-Example/50Msun/hr_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of this extremely massive star at minimal metallicity.' },
        { type: 'video', title: 'TRho Evolution', src: '/work/Hydrogen-Exhaustion/Individual-Example/50Msun/TRho_evolution.mp4', explanation: 'Animated core evolution showing the internal changes of this extremely massive star at minimal metallicity.' },
      ],
    },
  },
  'Helium-Exhaustion': {
    'Z = 0.0001': [
      { type: 'image', title: 'HR Diagram with Gaia Overlay', src: '/work/Helium-Exhaustion/Z = 0.0001/HRD_Gaia_MESA_AutoOverlay.png', explanation: 'HR diagram for stars at very low metallicity (Z = 0.0001) with Gaia observational data overlaid, showing complete evolution until helium exhaustion.' },
      { type: 'image', title: 'HR Diagram Highlighted', src: '/work/Helium-Exhaustion/Z = 0.0001/HRD_highlighted.png', explanation: 'HR diagram with highlighted evolutionary tracks showing the complete evolution including red giant branch for very low metallicity stars.' },
      { type: 'image', title: 'Core Temperature vs Density', src: '/work/Helium-Exhaustion/Z = 0.0001/Tc_Rhoc.png', explanation: 'Core temperature versus density evolution showing the central conditions of stars at very low metallicity through helium exhaustion.' },
      { type: 'image', title: 'Central Hydrogen Abundance', src: '/work/Helium-Exhaustion/Z = 0.0001/Central_H.png', explanation: 'Evolution of central hydrogen abundance showing how hydrogen is depleted in the core as stars evolve at very low metallicity until helium exhaustion.' },
      { type: 'image', title: 'Age vs Radius', src: '/work/Helium-Exhaustion/Z = 0.0001/Age_Radius.png', explanation: 'Radius evolution showing how stellar size changes with age for stars at very low metallicity through helium exhaustion.' },
      { type: 'image', title: 'Age vs Luminosity', src: '/work/Helium-Exhaustion/Z = 0.0001/Age_Luminosity.png', explanation: 'Luminosity evolution showing brightness changes over time for stars at very low metallicity through helium exhaustion.' },
      { type: 'video', title: 'Age vs Luminosity Evolution', src: '/work/Helium-Exhaustion/Z = 0.0001/age_vs_luminosity_evolution.mp4', explanation: 'Animated evolution showing how luminosity changes with age for stars at very low metallicity through helium exhaustion.' },
      { type: 'video', title: 'Age vs Radius Evolution', src: '/work/Helium-Exhaustion/Z = 0.0001/age_vs_radius_evolution.mp4', explanation: 'Animated evolution showing how stellar radius changes with age for very low metallicity stars through helium exhaustion.' },
      { type: 'video', title: 'Central Hydrogen Evolution', src: '/work/Helium-Exhaustion/Z = 0.0001/central_H_vs_time_evolution.mp4', explanation: 'Animated evolution showing how central hydrogen abundance decreases over time for very low metallicity stars through helium exhaustion.' },
      { type: 'video', title: 'Core Temperature-Density Evolution', src: '/work/Helium-Exhaustion/Z = 0.0001/Tc_vs_rhoc_evolution.mp4', explanation: 'Animated core evolution showing how central temperature and density change throughout stellar evolution at very low metallicity through helium exhaustion.' },
      { type: 'video', title: 'HR Mass Evolution', src: '/work/Helium-Exhaustion/Z = 0.0001/hr_mass_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of stars of different masses at very low metallicity through helium exhaustion.' },
    ],
    'Z = 0.001': [
      { type: 'image', title: 'HR Diagram with Gaia Overlay', src: '/work/Helium-Exhaustion/Z = 0.001/HRD_Gaia_MESA_AutoOverlay.png', explanation: 'HR diagram for stars at low metallicity (Z = 0.001) with Gaia observational data overlaid, showing complete evolution until helium exhaustion.' },
      { type: 'image', title: 'HR Diagram Highlighted', src: '/work/Helium-Exhaustion/Z = 0.001/HRD_highlighted.png', explanation: 'HR diagram with highlighted evolutionary tracks showing the complete evolution including red giant branch for low metallicity stars.' },
      { type: 'image', title: 'Core Temperature vs Density', src: '/work/Helium-Exhaustion/Z = 0.001/Tc_Rhoc.png', explanation: 'Core temperature versus density evolution showing the central conditions of stars at low metallicity through helium exhaustion.' },
      { type: 'image', title: 'Central Hydrogen Abundance', src: '/work/Helium-Exhaustion/Z = 0.001/Central_H.png', explanation: 'Evolution of central hydrogen abundance showing how hydrogen is depleted in the core as stars evolve at low metallicity until helium exhaustion.' },
      { type: 'image', title: 'Age vs Radius', src: '/work/Helium-Exhaustion/Z = 0.001/Age_Radius.png', explanation: 'Radius evolution showing how stellar size changes with age for stars at low metallicity through helium exhaustion.' },
      { type: 'image', title: 'Age vs Luminosity', src: '/work/Helium-Exhaustion/Z = 0.001/Age_Luminosity.png', explanation: 'Luminosity evolution showing brightness changes over time for stars at low metallicity through helium exhaustion.' },
      { type: 'video', title: 'Age vs Luminosity Evolution', src: '/work/Helium-Exhaustion/Z = 0.001/age_vs_luminosity_evolution.mp4', explanation: 'Animated evolution showing how luminosity changes with age for stars at low metallicity through helium exhaustion.' },
      { type: 'video', title: 'Age vs Radius Evolution', src: '/work/Helium-Exhaustion/Z = 0.001/age_vs_radius_evolution.mp4', explanation: 'Animated evolution showing how stellar radius changes with age for low metallicity stars through helium exhaustion.' },
      { type: 'video', title: 'Central Hydrogen Evolution', src: '/work/Helium-Exhaustion/Z = 0.001/central_H_vs_time_evolution.mp4', explanation: 'Animated evolution showing how central hydrogen abundance decreases over time for low metallicity stars through helium exhaustion.' },
      { type: 'video', title: 'Core Temperature-Density Evolution', src: '/work/Helium-Exhaustion/Z = 0.001/Tc_vs_rhoc_evolution.mp4', explanation: 'Animated core evolution showing how central temperature and density change throughout stellar evolution at low metallicity through helium exhaustion.' },
      { type: 'video', title: 'HR Mass Evolution', src: '/work/Helium-Exhaustion/Z = 0.001/hr_mass_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of stars of different masses at low metallicity through helium exhaustion.' },
    ],
    'Z = 0.006': [
      { type: 'image', title: 'HR Diagram with Gaia Overlay', src: '/work/Helium-Exhaustion/Z = 0.006/HRD_Gaia_MESA_AutoOverlay.png', explanation: 'HR diagram for stars at medium metallicity (Z = 0.006) with Gaia observational data overlaid, showing complete evolution until helium exhaustion.' },
      { type: 'image', title: 'HR Diagram Highlighted', src: '/work/Helium-Exhaustion/Z = 0.006/HRD_highlighted.png', explanation: 'HR diagram with highlighted evolutionary tracks showing the complete evolution including red giant branch for medium metallicity stars.' },
      { type: 'image', title: 'Core Temperature vs Density', src: '/work/Helium-Exhaustion/Z = 0.006/Tc_Rhoc.png', explanation: 'Core temperature versus density evolution showing the central conditions of stars at medium metallicity through helium exhaustion.' },
      { type: 'image', title: 'Central Hydrogen Abundance', src: '/work/Helium-Exhaustion/Z = 0.006/Central_H.png', explanation: 'Evolution of central hydrogen abundance showing how hydrogen is depleted in the core as stars evolve at medium metallicity until helium exhaustion.' },
      { type: 'image', title: 'Age vs Radius', src: '/work/Helium-Exhaustion/Z = 0.006/Age_Radius.png', explanation: 'Radius evolution showing how stellar size changes with age for stars at medium metallicity through helium exhaustion.' },
      { type: 'image', title: 'Age vs Luminosity', src: '/work/Helium-Exhaustion/Z = 0.006/Age_Luminosity.png', explanation: 'Luminosity evolution showing brightness changes over time for stars at medium metallicity through helium exhaustion.' },
      { type: 'video', title: 'Age vs Luminosity Evolution', src: '/work/Helium-Exhaustion/Z = 0.006/age_vs_luminosity_evolution.mp4', explanation: 'Animated evolution showing how luminosity changes with age for stars at medium metallicity through helium exhaustion.' },
      { type: 'video', title: 'Age vs Radius Evolution', src: '/work/Helium-Exhaustion/Z = 0.006/age_vs_radius_evolution.mp4', explanation: 'Animated evolution showing how stellar radius changes with age for medium metallicity stars through helium exhaustion.' },
      { type: 'video', title: 'Central Hydrogen Evolution', src: '/work/Helium-Exhaustion/Z = 0.006/central_H_vs_time_evolution.mp4', explanation: 'Animated evolution showing how central hydrogen abundance decreases over time for medium metallicity stars through helium exhaustion.' },
      { type: 'video', title: 'Core Temperature-Density Evolution', src: '/work/Helium-Exhaustion/Z = 0.006/Tc_vs_rhoc_evolution.mp4', explanation: 'Animated core evolution showing how central temperature and density change throughout stellar evolution at medium metallicity through helium exhaustion.' },
      { type: 'video', title: 'HR Mass Evolution', src: '/work/Helium-Exhaustion/Z = 0.006/hr_mass_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of stars of different masses at medium metallicity through helium exhaustion.' },
    ],
    'Z = 0.014': [
      { type: 'image', title: 'HR Diagram with Gaia Overlay', src: '/work/Helium-Exhaustion/Z = 0.014/HRD_Gaia_MESA_AutoOverlay.png', explanation: 'HR diagram for stars at solar metallicity (Z = 0.014) with Gaia observational data overlaid, showing complete evolution until helium exhaustion.' },
      { type: 'image', title: 'HR Diagram Highlighted', src: '/work/Helium-Exhaustion/Z = 0.014/HRD_highlighted.png', explanation: 'HR diagram with highlighted evolutionary tracks showing the complete evolution including red giant branch for solar metallicity stars.' },
      { type: 'image', title: 'Core Temperature vs Density', src: '/work/Helium-Exhaustion/Z = 0.014/Tc_Rhoc.png', explanation: 'Core temperature versus density evolution showing the central conditions of stars at solar metallicity through helium exhaustion.' },
      { type: 'image', title: 'Central Hydrogen Abundance', src: '/work/Helium-Exhaustion/Z = 0.014/Central_H.png', explanation: 'Evolution of central hydrogen abundance showing how hydrogen is depleted in the core as stars evolve at solar metallicity until helium exhaustion.' },
      { type: 'image', title: 'Age vs Radius', src: '/work/Helium-Exhaustion/Z = 0.014/Age_Radius.png', explanation: 'Radius evolution showing how stellar size changes with age for stars at solar metallicity through helium exhaustion.' },
      { type: 'image', title: 'Age vs Luminosity', src: '/work/Helium-Exhaustion/Z = 0.014/Age_Luminosity.png', explanation: 'Luminosity evolution showing brightness changes over time for stars at solar metallicity through helium exhaustion.' },
      { type: 'video', title: 'Age vs Luminosity Evolution', src: '/work/Helium-Exhaustion/Z = 0.014/age_vs_luminosity_evolution.mp4', explanation: 'Animated evolution showing how luminosity changes with age for stars at solar metallicity through helium exhaustion.' },
      { type: 'video', title: 'Age vs Radius Evolution', src: '/work/Helium-Exhaustion/Z = 0.014/age_vs_radius_evolution.mp4', explanation: 'Animated evolution showing how stellar radius changes with age for solar metallicity stars through helium exhaustion.' },
      { type: 'video', title: 'Central Hydrogen Evolution', src: '/work/Helium-Exhaustion/Z = 0.014/central_H_vs_time_evolution.mp4', explanation: 'Animated evolution showing how central hydrogen abundance decreases over time for solar metallicity stars through helium exhaustion.' },
      { type: 'video', title: 'Core Temperature-Density Evolution', src: '/work/Helium-Exhaustion/Z = 0.014/Tc_vs_rhoc_evolution.mp4', explanation: 'Animated core evolution showing how central temperature and density change throughout stellar evolution at solar metallicity through helium exhaustion.' },
      { type: 'video', title: 'HR Mass Evolution', src: '/work/Helium-Exhaustion/Z = 0.014/hr_mass_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of stars of different masses at solar metallicity through helium exhaustion.' },
    ],
    'Z = 0.02': [
      { type: 'image', title: 'HR Diagram with Gaia Overlay', src: '/work/Helium-Exhaustion/Z = 0.02/HRD_Gaia_MESA_AutoOverlay.png', explanation: 'HR diagram for stars at high metallicity (Z = 0.02) with Gaia observational data overlaid, showing complete evolution until helium exhaustion.' },
      { type: 'image', title: 'HR Diagram Highlighted', src: '/work/Helium-Exhaustion/Z = 0.02/HRD_highlighted.png', explanation: 'HR diagram with highlighted evolutionary tracks showing the complete evolution including red giant branch for high metallicity stars.' },
      { type: 'image', title: 'Core Temperature vs Density', src: '/work/Helium-Exhaustion/Z = 0.02/Tc_Rhoc.png', explanation: 'Core temperature versus density evolution showing the central conditions of stars at high metallicity through helium exhaustion.' },
      { type: 'image', title: 'Central Hydrogen Abundance', src: '/work/Helium-Exhaustion/Z = 0.02/Central_H.png', explanation: 'Evolution of central hydrogen abundance showing how hydrogen is depleted in the core as stars evolve at high metallicity until helium exhaustion.' },
      { type: 'video', title: 'HR Mass Evolution', src: '/work/Helium-Exhaustion/Z = 0.02/hr_mass_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of stars of different masses at high metallicity through helium exhaustion.' },
    ],
    'Z = 0.04': [
      { type: 'image', title: 'HR Diagram with Gaia Overlay', src: '/work/Helium-Exhaustion/Z = 0.04/HRD_Gaia_MESA_AutoOverlay.png', explanation: 'HR diagram for stars at very high metallicity (Z = 0.04) with Gaia observational data overlaid, showing complete evolution until helium exhaustion.' },
      { type: 'image', title: 'HR Diagram Highlighted', src: '/work/Helium-Exhaustion/Z = 0.04/HRD_highlighted.png', explanation: 'HR diagram with highlighted evolutionary tracks showing the complete evolution including red giant branch for very high metallicity stars.' },
      { type: 'image', title: 'Core Temperature vs Density', src: '/work/Helium-Exhaustion/Z = 0.04/Tc_Rhoc.png', explanation: 'Core temperature versus density evolution showing the central conditions of stars at very high metallicity through helium exhaustion.' },
      { type: 'image', title: 'Central Hydrogen Abundance', src: '/work/Helium-Exhaustion/Z = 0.04/Central_H.png', explanation: 'Evolution of central hydrogen abundance showing how hydrogen is depleted in the core as stars evolve at very high metallicity until helium exhaustion.' },
      { type: 'video', title: 'HR Mass Evolution', src: '/work/Helium-Exhaustion/Z = 0.04/hr_mass_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of stars of different masses at very high metallicity through helium exhaustion.' },
    ],
    'Individual Example': {
      '1Msun': [
        { type: 'image', title: 'HR Diagram', src: '/work/Helium-Exhaustion/Individual-Example/1Msun/hr_diagram.png', explanation: 'HR diagram for a 1 solar mass star at very low metallicity (Z = 0.0001). Shows the evolutionary track of a star with minimal metallicity through helium exhaustion.' },
        { type: 'image', title: 'Core Temp vs Density', src: '/work/Helium-Exhaustion/Individual-Example/1Msun/Tc_vs_rhoc.png', explanation: 'Core evolution showing the internal conditions of this very low metallicity star through helium exhaustion.' },
        { type: 'image', title: 'Age vs Radius', src: '/work/Helium-Exhaustion/Individual-Example/1Msun/age_vs_radius.png', explanation: 'Radius evolution showing the size changes of this very low metallicity star through helium exhaustion.' },
        { type: 'image', title: 'Age vs Luminosity', src: '/work/Helium-Exhaustion/Individual-Example/1Msun/age_vs_luminosity.png', explanation: 'Luminosity evolution showing the brightness changes of this very low metallicity star through helium exhaustion.' },
        { type: 'video', title: 'HR Evolution', src: '/work/Helium-Exhaustion/Individual-Example/1Msun/hr_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of this very low metallicity star through helium exhaustion.' },
        { type: 'video', title: 'TRho Evolution', src: '/work/Helium-Exhaustion/Individual-Example/1Msun/TRho_evolution.mp4', explanation: 'Animated core evolution showing the internal changes of this very low metallicity star through helium exhaustion.' },
      ],
      '20Msun': [
        { type: 'image', title: 'HR Diagram', src: '/work/Helium-Exhaustion/Individual-Example/20Msun/hr_diagram.png', explanation: 'HR diagram for a 20 solar mass star at very low metallicity, showing the evolutionary track of a massive star with minimal metallicity through helium exhaustion.' },
        { type: 'image', title: 'Core Temp vs Density', src: '/work/Helium-Exhaustion/Individual-Example/20Msun/Tc_vs_rhoc.png', explanation: 'Core evolution showing the internal structure and conditions of this massive star at minimal metallicity through helium exhaustion.' },
        { type: 'image', title: 'Age vs Radius', src: '/work/Helium-Exhaustion/Individual-Example/20Msun/age_vs_radius.png', explanation: 'Radius evolution showing the size changes of this massive star at minimal metallicity through helium exhaustion.' },
        { type: 'image', title: 'Age vs Luminosity', src: '/work/Helium-Exhaustion/Individual-Example/20Msun/age_vs_luminosity.png', explanation: 'Luminosity evolution showing the brightness changes of this massive star at minimal metallicity through helium exhaustion.' },
        { type: 'video', title: 'HR Evolution', src: '/work/Helium-Exhaustion/Individual-Example/20Msun/hr_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of this massive star at minimal metallicity through helium exhaustion.' },
        { type: 'video', title: 'TRho Evolution', src: '/work/Helium-Exhaustion/Individual-Example/20Msun/TRho_evolution.mp4', explanation: 'Animated core evolution showing the internal changes of this massive star at minimal metallicity through helium exhaustion.' },
      ],
      '50Msun': [
        { type: 'image', title: 'HR Diagram', src: '/work/Helium-Exhaustion/Individual-Example/50Msun/hr_diagram.png', explanation: 'HR diagram for an extremely massive 50 solar mass star at very low metallicity, showing the evolutionary track of an extremely massive star with minimal metallicity through helium exhaustion.' },
        { type: 'image', title: 'Core Temp vs Density', src: '/work/Helium-Exhaustion/Individual-Example/50Msun/Tc_vs_rhoc.png', explanation: 'Core evolution showing the extreme internal conditions of this extremely massive star at minimal metallicity through helium exhaustion.' },
        { type: 'image', title: 'Age vs Radius', src: '/work/Helium-Exhaustion/Individual-Example/50Msun/age_vs_radius.png', explanation: 'Radius evolution showing the dramatic size changes of this extremely massive star at minimal metallicity through helium exhaustion.' },
        { type: 'image', title: 'Age vs Luminosity', src: '/work/Helium-Exhaustion/Individual-Example/50Msun/age_vs_luminosity.png', explanation: 'Luminosity evolution showing the extreme brightness changes of this extremely massive star at minimal metallicity through helium exhaustion.' },
        { type: 'video', title: 'HR Evolution', src: '/work/Helium-Exhaustion/Individual-Example/50Msun/hr_evolution.mp4', explanation: 'Animated HR diagram showing the evolution of this extremely massive star at minimal metallicity through helium exhaustion.' },
        { type: 'video', title: 'TRho Evolution', src: '/work/Helium-Exhaustion/Individual-Example/50Msun/TRho_evolution.mp4', explanation: 'Animated core evolution showing the internal changes of this extremely massive star at minimal metallicity through helium exhaustion.' },
      ],
    },
  },
};

// Function to download all files for a given selection
const downloadAllFiles = (stopGroup, zGroup, mass = null) => {
  // Create a list of all file URLs for the current selection
  let fileUrls = [];
  
  if (zGroup === 'Individual Example' && mass) {
    // For Individual Example, get files from the mass subdirectory
    const basePath = `/work/${stopGroup}/Individual-Example/${mass}`;
    fileUrls = [
      `${basePath}/hr_diagram.png`,
      `${basePath}/Tc_vs_rhoc.png`,
      `${basePath}/age_vs_radius.png`,
      `${basePath}/age_vs_luminosity.png`,
      `${basePath}/hr_evolution.mp4`,
      `${basePath}/TRho_evolution.mp4`
    ];
  } else {
    // For regular metallicity folders, get files directly from the folder
    const basePath = `/work/${stopGroup}/${zGroup}`;
    fileUrls = [
      `${basePath}/HRD_Gaia_MESA_AutoOverlay.png`,
      `${basePath}/HRD_highlighted.png`,
      `${basePath}/Tc_Rhoc.png`,
      `${basePath}/Central_H.png`,
      `${basePath}/Age_Radius.png`,
      `${basePath}/Age_Luminosity.png`,
      `${basePath}/age_vs_luminosity_evolution.mp4`,
      `${basePath}/age_vs_radius_evolution.mp4`,
      `${basePath}/central_H_vs_time_evolution.mp4`,
      `${basePath}/Tc_vs_rhoc_evolution.mp4`,
      `${basePath}/hr_mass_evolution.mp4`
    ];
  }

  // Create a zip file using JSZip
  const zip = new JSZip();
  
  // Download each file and add to zip
  const downloadPromises = fileUrls.map(async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const fileName = url.split('/').pop();
        zip.file(fileName, blob);
      }
    } catch (error) {
      console.error(`Failed to download ${url}:`, error);
    }
  });

  // Wait for all downloads to complete, then generate zip
  Promise.all(downloadPromises).then(() => {
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      const fileName = mass ? `${stopGroup}_${zGroup}_${mass}.zip` : `${stopGroup}_${zGroup}.zip`;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  });
};

// Function to download ZAMS plots
const downloadZAMSPlots = () => {
  const fileUrls = [
    '/work/ZAMS_H_0.014.png',
    '/work/ZAMS_All_Metallicities.png'
  ];

  // Create a zip file using JSZip
  const zip = new JSZip();
  
  // Download each file and add to zip
  const downloadPromises = fileUrls.map(async (url) => {
    try {
      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const fileName = url.split('/').pop();
        zip.file(fileName, blob);
      }
    } catch (error) {
      console.error(`Failed to download ${url}:`, error);
    }
  });

  // Wait for all downloads to complete, then generate zip
  Promise.all(downloadPromises).then(() => {
    zip.generateAsync({ type: 'blob' }).then((content) => {
      // Create download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'ZAMS_Plots.zip';
      link.click();
      URL.revokeObjectURL(link.href);
    });
  });
};

export default function Atlas() {
  const [currentStopGroup, setCurrentStopGroup] = useState('Hydrogen-Exhaustion');
  const [currentSection, setCurrentSection] = useState('Project Overview');
  const [currentZGroup, setCurrentZGroup] = useState('Z = 0.0001');
  const [currentMass, setCurrentMass] = useState('1Msun');
  const { isOnline, connectionType } = useNetworkStatus();
  const isMobile = isMobileDevice();

  // Get content based on selections
  const overviewContent = markdownContent[currentStopGroup];
  const explanationsData = explanations[currentSection];
  
  // For Star Simulations
  let starSimItems = [];
  if (currentSection === 'Star Simulations' && simulationData[currentStopGroup]) {
    if (currentZGroup === 'Individual Example') {
      if (simulationData[currentStopGroup]['Individual Example'] && simulationData[currentStopGroup]['Individual Example'][currentMass]) {
        starSimItems = simulationData[currentStopGroup]['Individual Example'][currentMass];
      }
    } else {
      // For regular metallicity folders, the data is directly in the metallicity key
      if (simulationData[currentStopGroup][currentZGroup]) {
        starSimItems = simulationData[currentStopGroup][currentZGroup];
      }
    }
  }

  // Debug logging for mobile issues
  useEffect(() => {
    if (isMobile && currentSection === 'Star Simulations' && currentZGroup === 'Z = 0.014') {
      console.log('Mobile Debug - Z = 0.014:', {
        stopGroup: currentStopGroup,
        zGroup: currentZGroup,
        itemCount: starSimItems.length,
        items: starSimItems.map(item => ({ title: item.title, type: item.type, src: item.src }))
      });
    }
  }, [currentStopGroup, currentSection, currentZGroup, starSimItems.length, isMobile]);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-[#0b0f1a] text-white relative overflow-x-hidden">
        <StarsCanvas />
        <ConstellationReveal />
        <MouseTrail />
        
        <main className="relative z-10 max-w-4xl mx-auto w-full py-12 px-2 sm:px-4 md:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-cyan-400 text-center mb-6 drop-shadow">
          <Typewriter
              words={['🌠', 'Stellar Atlas']}
              loop={0}
            cursor
              cursorStyle="_"
            typeSpeed={70}
            deleteSpeed={50}
              delaySpeed={1000}
          />
        </h1>

          {/* Network Status Indicator for Mobile */}
          {isMobile && (
            <div className="text-center mb-4 space-y-2">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                isOnline 
                  ? connectionType === 'slow-2g' || connectionType === '2g'
                    ? 'bg-yellow-900 text-yellow-200'
                    : 'bg-green-900 text-green-200'
                  : 'bg-red-900 text-red-200'
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isOnline 
                    ? connectionType === 'slow-2g' || connectionType === '2g'
                      ? 'bg-yellow-400'
                      : 'bg-green-400'
                    : 'bg-red-400'
                }`}></div>
                {isOnline 
                  ? connectionType === 'slow-2g' || connectionType === '2g'
                    ? 'Slow Connection'
                    : 'Online'
                  : 'Offline'
                }
              </div>
              {currentSection === 'Star Simulations' && (
                <div className="text-yellow-400 text-xs bg-yellow-900/20 px-3 py-1 rounded">
                  ⚠️ Videos are large files. Loading may take time on slow connections.
                </div>
              )}
            </div>
          )}

          {/* Navigation Dropdowns */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
        <div>
              <label className="block text-cyan-300 font-medium mb-2">Stopping Condition</label>
              <select
                value={currentStopGroup}
                onChange={e => setCurrentStopGroup(e.target.value)}
                className="bg-[#0b0f1a] text-cyan-200 border-2 border-cyan-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md transition duration-200 hover:border-cyan-300 min-w-[200px]"
              >
                {stopGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
          </select>
        </div>
            
        <div>
              <label className="block text-cyan-300 font-medium mb-2">Section</label>
              <select
                value={currentSection}
                onChange={e => setCurrentSection(e.target.value)}
                className="bg-[#0b0f1a] text-cyan-200 border-2 border-cyan-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md transition duration-200 hover:border-cyan-300 min-w-[200px]"
              >
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
          </select>
        </div>
            
            {/* Additional dropdowns for Star Simulations */}
            {currentSection === 'Star Simulations' && (
              <>
          <div>
                  <label className="block text-cyan-300 font-medium mb-2">Metallicity</label>
                  <select
                    value={currentZGroup}
                    onChange={e => setCurrentZGroup(e.target.value)}
                    className="bg-[#0b0f1a] text-cyan-200 border-2 border-cyan-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md transition duration-200 hover:border-cyan-300 min-w-[200px]"
                  >
              {zGroups.map(z => (
                      <option key={z.folder} value={z.label}>{z.label}</option>
              ))}
            </select>
          </div>
                
                {currentZGroup === 'Individual Example' && (
          <div>
                    <label className="block text-cyan-300 font-medium mb-2">Mass</label>
                    <select
                      value={currentMass}
                      onChange={e => setCurrentMass(e.target.value)}
                      className="bg-[#0b0f1a] text-cyan-200 border-2 border-cyan-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-md transition duration-200 hover:border-cyan-300 min-w-[200px]"
                    >
                      {exampleMasses.map(mass => (
                        <option key={mass} value={mass}>{mass}</option>
              ))}
            </select>
          </div>
                )}
              </>
        )}
      </div>

          {/* Content Sections */}
          <div className="space-y-8">
            
            {/* Project Overview Section */}
            {currentSection === 'Project Overview' && (
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
                <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Project Overview</h2>
                <div className="prose prose-invert max-w-3xl mx-auto text-gray-300 space-y-8">
                  {Object.entries(overviewContent).map(([section, content]) => (
                    <div key={section}>
                      <h3 className="text-xl font-semibold text-cyan-300 mb-4">{section}</h3>
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ZAMS Plot Section */}
            {currentSection === 'ZAMS Plot' && (
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-cyan-400">ZAMS Plots</h2>
                  <button
                    onClick={downloadZAMSPlots}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download All ZAMS Plots
                  </button>
                </div>
                {Array.isArray(explanationsData) && explanationsData.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {explanationsData.map((item, index) => (
                      <DisplayImage key={index} {...item} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-12">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-lg">No ZAMS plot data available.</p>
                  </div>
          )}
        </div>
            )}

            {/* Star Simulations Section */}
            {currentSection === 'Star Simulations' && (
              <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-cyan-400">Star Simulations</h2>
                  <button
                    onClick={() => downloadAllFiles(currentStopGroup, currentZGroup, currentZGroup === 'Individual Example' ? currentMass : null)}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download All Files
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {starSimItems.length === 0 ? (
                    <div className="col-span-2 text-center text-gray-400 py-12">
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-lg">No simulation data available for this selection.</p>
                      <p className="text-sm text-gray-500 mt-2">Please try different parameters.</p>
        </div>
      ) : (
                    starSimItems.map((item, idx) => (
                      item.type === 'image' ? (
                        <DisplayImage key={idx} title={item.title} src={item.src} explanation={item.explanation} />
                      ) : (
                        <DisplayVideo key={idx} title={item.title} src={item.src} explanation={item.explanation} />
                      )
                    ))
                  )}
                </div>
        </div>
      )}
    </div>
        </main>
      </div>
    </PageWrapper>
  );
}
