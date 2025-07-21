"use client";
import { useState, useEffect } from "react";

function spectralColor(temp) {
  // Map temperature to color (OBAFGKM)
  if (temp > 30000) return "#9ecbff"; // O (blue)
  if (temp > 10000) return "#b2d6ff"; // B (blue-white)
  if (temp > 7500) return "#e0e7ff"; // A (white)
  if (temp > 6000) return "#fffbe6"; // F (yellow-white)
  if (temp > 5200) return "#fff6c2"; // G (yellow)
  if (temp > 3700) return "#ffd6a1"; // K (orange)
  return "#ffb07c"; // M (red)
}

function metallicityGlow(metallicity) {
  // More visible metallicity glow - only visible for non-solar metallicity
  if (metallicity === 0.014) return null;
  
  // Z = 0.0001 (blue) to Z = 0.04 (red)
  const blue = [56, 189, 248]; // #38bdf8
  const red = [255, 176, 124]; // #ffb07c
  const t = Math.min(1, Math.max(0, (metallicity - 0.0001) / (0.04 - 0.0001)));
  const rgb = blue.map((b, i) => Math.round(b + (red[i] - b) * t));
  
  // More visible opacity - stronger effect
  const opacity = 0.3 + 0.4 * Math.abs(metallicity - 0.014) / 0.04;
  return `rgba(${rgb.join(",")},${opacity})`;
}

function getStarProperties(mass, metallicity, fracAge) {
  mass = Math.max(0.1, Math.min(100, mass));
  metallicity = Math.max(0.0001, Math.min(0.04, metallicity));
  fracAge = Math.max(0, Math.min(1, fracAge));
  const tMS = 10000 * Math.pow(mass, -2.5) * (1 + 2 * (metallicity - 0.014));
  let Lzams = Math.pow(mass, 3.5);
  let Rzams = Math.pow(mass, 0.8);
  let Tzams = 5800 * Math.pow(mass, 0.505) * (1 - 0.2 * (metallicity - 0.014));
  let Ltams = Lzams * 1.8;
  let Rtams = Rzams * 1.5;
  let Ttams = Tzams * 0.93;
  let Lgiant = Lzams * 200 * (mass > 8 ? 2 : 1);
  let Rgiant = Rzams * 30 * (mass > 8 ? 2 : 1);
  let Tgiant = Tzams * 0.6;
  let luminosity, radius, temp, stage;
  if (fracAge < 0.98) {
    const f = fracAge / 0.98;
    luminosity = Lzams + (Ltams - Lzams) * f;
    radius = Rzams + (Rtams - Rzams) * f;
    temp = Tzams + (Ttams - Tzams) * f;
    stage = "Main Sequence";
  } else {
    const f = (fracAge - 0.98) / 0.02;
    luminosity = Ltams + (Lgiant - Ltams) * f;
    radius = Rtams + (Rgiant - Rtams) * f;
    temp = Ttams + (Tgiant - Ttams) * f;
    stage = mass > 8 ? "Supergiant (about to explode)" : "Red Giant";
  }
  let spectral = "G";
  if (temp > 30000) spectral = "O";
  else if (temp > 10000) spectral = "B";
  else if (temp > 7500) spectral = "A";
  else if (temp > 6000) spectral = "F";
  else if (temp > 5200) spectral = "G";
  else if (temp > 3700) spectral = "K";
  else spectral = "M";
  let color = spectralColor(temp);
  return { luminosity, radius, temp, spectral, stage, color, tMS };
}

function ProgressArc({ fracAge, mass }) {
  // Create a circular progress arc around the star
  const radius = 80; // Arc radius
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(fracAge, 1);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);
  
  // Color based on stage
  let arcColor = "#38bdf8"; // cyan for main sequence
  if (progress > 0.98) {
    arcColor = mass > 8 ? "#f472b6" : "#f59e0b"; // pink for supergiant, amber for giant
  } else if (progress > 0.5) {
    arcColor = "#10b981"; // emerald for mid-life
  }
  
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg width="200" height="200" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke={arcColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          fill="none"
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.3s ease-in-out',
            filter: 'drop-shadow(0 0 8px currentColor)'
          }}
        />
      </svg>
    </div>
  );
}

export default function StarEvolution() {
  const [mass, setMass] = useState(1);
  const [metallicity, setMetallicity] = useState(0.014);
  const [fracAge, setFracAge] = useState(0);
  const [mounted, setMounted] = useState(false);
  const props = getStarProperties(mass, metallicity, fracAge);
  // Logarithmic scaling for display radius
  const displayRadius = Math.max(24, Math.min(120, 32 + 32 * Math.log10(props.radius + 1)));
  // Physically accurate rotation: period ~ 1/sqrt(mass) (O stars rotate fast, M stars slow)
  const rotationDuration = `${Math.max(1, 8 / Math.sqrt(mass))}s`;
  // More visible metallicity glow
  const glowColor = metallicityGlow(metallicity);
  
  useEffect(() => { setMounted(true); }, []);
  const age = props.tMS * fracAge;
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0b0f1a] to-[#1e293b] flex flex-col items-center justify-center py-10 relative overflow-hidden">
      {/* Background Components */}
      
      {/* Cosmic background elements for laptop screens */}
      <div className="hidden lg:block fixed inset-0 pointer-events-none">
        {/* Nebula-like clouds only */}
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-gradient-to-br from-cyan-500/15 to-purple-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-gradient-to-br from-pink-500/15 to-orange-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/12 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl" />
      </div>
      
      <style>{`
        @keyframes star-rotate { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }
        @keyframes pulse { 0% { opacity: 0.7; } 100% { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
      `}</style>
      <div className="max-w-2xl w-full bg-black/80 rounded-2xl shadow-lg border border-cyan-700 p-8 flex flex-col items-center mb-10 relative z-10">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Star Evolution Playground</h1>
        <div className="flex flex-col md:flex-row items-center gap-8 w-full">
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Progress arc around the star */}
              <ProgressArc fracAge={fracAge} mass={mass} />
              
              {/* More visible metallicity glow */}
              {glowColor && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  boxShadow: `0 0 60px 30px ${glowColor}, 0 0 100px 50px ${glowColor}`,
                  opacity: 0.6,
                  pointerEvents: 'none',
                  filter: 'blur(8px)',
                  animation: 'pulse 2s ease-in-out infinite',
                }} />
              )}
              
              <div
                className="rounded-full shadow-2xl animate-pulse"
                style={{
                  width: `${displayRadius}px`,
                  height: `${displayRadius}px`,
                  background: `radial-gradient(circle at 60% 40%, ${props.color} 0%, #fff0 80%)`,
                  boxShadow: `0 0 60px 10px ${props.color}99, 0 0 0 2px #fff4, 0 0 40px 10px #38bdf855` + (mass > 25 ? `, 0 0 80px 30px #fff6` : ""),
                  transition: 'all 0.5s cubic-bezier(.4,2,.3,1)',
                  filter: props.stage.includes('giant') ? 'blur(1.5px)' : 'none',
                  borderRadius: '50%',
                  animation: `star-rotate linear infinite`,
                  animationDuration: rotationDuration,
                }}
                title={`Star color and size change with mass, metallicity, and age. Metallicity adds a very faint colored glow.`}
              />
              {props.stage.includes('Supergiant') && (
                <div className="absolute inset-0 animate-ping rounded-full border-4 border-fuchsia-400/60" />
              )}
              {mass > 25 && (
                <div className="absolute inset-0 animate-pulse rounded-full border-4 border-cyan-400/30" style={{ boxShadow: '0 0 80px 30px #fff6' }} />
              )}
            </div>
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold" style={{ color: props.color }}>{props.spectral}</div>
              <div className="text-sm text-cyan-200">{props.stage}</div>
            </div>
          </div>
          <div className="flex-1 bg-[#111827]/80 rounded-xl p-4 border border-cyan-700 text-cyan-100 shadow">
            <div className="mb-2"><b>Mass:</b> {mass.toFixed(2)} M☉</div>
            <div className="mb-2 flex items-center gap-2">
              <b>Metallicity:</b> Z = {metallicity.toFixed(4)}
              {metallicity !== 0.014 && (
                <div 
                  className="w-3 h-3 rounded-full border border-white/30"
                  style={{
                    backgroundColor: metallicityGlow(metallicity)?.replace(/[^,]+\)/, '0.8)') || 'transparent',
                    boxShadow: `0 0 8px ${metallicityGlow(metallicity) || 'transparent'}`,
                  }}
                  title={`Metallicity effect: ${metallicity > 0.014 ? 'Higher' : 'Lower'} than solar (Z = 0.014)`}
                />
              )}
            </div>
            <div className="mb-2"><b>Age:</b> {age.toFixed(0)} Myr / {props.tMS.toFixed(0)} Myr (MS lifetime)</div>
            <div className="mb-2"><b>Temperature:</b> {props.temp.toFixed(0)} K</div>
            <div className="mb-2"><b>Luminosity:</b> {props.luminosity.toExponential(2)} L☉</div>
            <div className="mb-2"><b>Radius:</b> {props.radius.toFixed(2)} R☉</div>
            <div className="mb-2"><b>Spectral Type:</b> {props.spectral}</div>
          </div>
        </div>
        <div className="w-full mt-8 flex flex-col gap-6">
          <div>
            <label className="block text-cyan-300 mb-1" title="Set the star's mass (0.1–100 M☉)">Mass (M☉): {mass.toFixed(2)}</label>
            <input type="range" min={0.1} max={100} step={0.01} value={mass} onChange={e => { setMass(Number(e.target.value)); setFracAge(0); }} className="w-full" />
          </div>
          <div>
            <label className="block text-cyan-300 mb-1" title="Set the star's metallicity (Z, 0.0001–0.04)">Metallicity (Z): {metallicity.toFixed(4)}</label>
            <input type="range" min={0.0001} max={0.04} step={0.0001} value={metallicity} onChange={e => setMetallicity(Number(e.target.value))} className="w-full" />
          </div>
          <div>
            <label className="block text-cyan-300 mb-1" title="Evolve the star from birth (0%) to end of life (100%)">Age (% of lifetime): {(fracAge*100).toFixed(1)}%</label>
            <input type="range" min={0} max={1} step={0.001} value={fracAge} onChange={e => setFracAge(Number(e.target.value))} className="w-full" />
          </div>
        </div>
      </div>
      {/* How this works section */}
      <div className="max-w-2xl w-full bg-black/70 rounded-xl shadow border border-cyan-700 p-6 text-cyan-200 text-base mb-10">
        <h2 className="text-xl font-bold text-cyan-300 mb-2">How this works</h2>
        <ul className="list-disc ml-6 mb-2">
          <li><b>Mass</b> sets the star&apos;s initial properties using piecewise/interpolated empirical relations for ZAMS, TAMS, and giant/supergiant stages.</li>
          <li><b>Metallicity</b> (Z) affects temperature, color, and lifetime. Higher Z = cooler, redder, longer-lived (for low-mass). A very faint colored glow is shown for non-solar metallicity.</li>
          <li><b>Age</b> is a percentage of the star&apos;s main sequence lifetime. The star&apos;s color, size, and position change smoothly as it evolves. The progress arc around the star shows its evolutionary stage.</li>
          <li>The circular progress arc shows the star&apos;s evolutionary progress from birth to end-of-life, with color changes indicating different stages.</li>
          <li>All calculations are based on simple, widely used astrophysical scaling laws (not full MESA models). For more details, see the Atlas and Project Report pages.</li>
        </ul>
        
        <h3 className="text-lg font-bold text-cyan-300 mt-4 mb-2">Key Relations Used:</h3>
        <ul className="list-disc ml-6 mb-2 text-sm">
          <li><b>Main Sequence Lifetime:</b> τ<sub>MS</sub> ∝ M<sup>-2.5</sup> × (1 + 2(Z - Z<sub>☉</sub>))</li>
          <li><b>ZAMS Luminosity:</b> L<sub>ZAMS</sub> ∝ M<sup>3.5</sup></li>
          <li><b>ZAMS Radius:</b> R<sub>ZAMS</sub> ∝ M<sup>0.8</sup></li>
          <li><b>ZAMS Temperature:</b> T<sub>ZAMS</sub> ∝ M<sup>0.505</sup> × (1 - 0.2(Z - Z<sub>☉</sub>))</li>
          <li><b>Metallicity Effect:</b> Higher Z → cooler, redder stars with longer lifetimes</li>
          <li><b>Evolutionary Tracks:</b> Smooth interpolation between ZAMS, TAMS, and giant/supergiant phases</li>
        </ul>
        
        <div className="text-xs text-cyan-400 mt-4">References: Prialnik, D. &quot;An Introduction to Stellar Astrophysics&quot;; Carroll & Ostlie, &quot;An Introduction to Modern Astrophysics&quot; ; Salaris & Cassisi, &quot;Evolution of Stars and Stellar Populations&quot;.</div>
      </div>
    </div>
  );
} 
