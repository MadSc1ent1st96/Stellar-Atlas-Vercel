// components/MouseTrail.tsx
"use client";
import { useEffect } from "react";

export default function MouseTrail() {
  useEffect(() => {
    const createParticle = (x: number, y: number) => {
      const particle = document.createElement("div");
      particle.className = "starlight-particle";
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      document.body.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 800); // Duration before it disappears
    };

    const handleMouseMove = (e: MouseEvent) => {
      createParticle(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return null;
}
