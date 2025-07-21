"use client";

import { useEffect, useRef } from "react";

export default function FloatingPlanets() {
  const planetRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      planetRefs.current.forEach((planet, idx) => {
        if (!planet) return;
        const angle = Date.now() / (3000 + idx * 1000);
        const radius = 10 + idx * 5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        planet.style.transform = `translate(${x}px, ${y}px)`;
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          ref={(el) => (planetRefs.current[idx] = el)}
          className="absolute w-6 h-6 bg-gradient-to-br from-cyan-300 to-purple-500 rounded-full shadow-lg opacity-40"
          style={{ top: `${20 + idx * 30}%`, left: `${10 + idx * 25}%` }}
        ></div>
      ))}
    </div>
  );
}
