// components/OrbitingPlanets.tsx
import React, { useEffect, useRef } from "react";

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

export default function OrbitingPlanets() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Responsive sizing
    let mobile = isMobile();
    let w = mobile ? window.innerWidth : window.innerWidth;
    let h = mobile ? Math.round(window.innerHeight * 0.35) : window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    let driftAngle = 0;
    let time = 0;

    // Scale orbits and planet sizes for mobile
    const scale = mobile ? 0.45 : 1;
    const centerY = h / 2; // Always center vertically in canvas
    const centerX = w / 2; // Always center horizontally in canvas

    const planets = [
      { radiusX: 40, radiusY: 30, size: 2, angle: 0, speed: 0.025, color: "#888888", name: "Mercury" },
      { radiusX: 60, radiusY: 40, size: 3, angle: 0, speed: 0.02, color: "#c2b280", name: "Venus" },
      { radiusX: 90, radiusY: 65, size: 3.5, angle: 0, speed: 0.018, color: "#00aaff", name: "Earth" },
      { radiusX: 120, radiusY: 90, size: 2.8, angle: 0, speed: 0.016, color: "#ff4500", name: "Mars" },
      { radiusX: 160, radiusY: 130, size: 6, angle: 0, speed: 0.012, color: "#d2b48c", name: "Jupiter" },
      { radiusX: 200, radiusY: 160, size: 5.5, angle: 0, speed: 0.009, color: "#f5deb3", name: "Saturn" },
      { radiusX: 240, radiusY: 190, size: 4, angle: 0, speed: 0.006, color: "#add8e6", name: "Uranus" },
      { radiusX: 270, radiusY: 210, size: 4, angle: 0, speed: 0.005, color: "#4169e1", name: "Neptune" },
      { radiusX: 300, radiusY: 240, size: 2, angle: 0, speed: 0.003, color: "#aaaaaa", name: "Pluto" },
    ].map(p => ({ ...p, radiusX: p.radiusX * scale, radiusY: p.radiusY * scale, size: p.size * scale }));

    const moon = {
      radius: 10 * scale,
      angle: 0,
      speed: 0.06,
      color: "#cccccc",
    };

    // Store orbit traces
    const orbitTraces: { x: number; y: number; opacity: number }[][] = planets.map(() => []);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Drift logic (entire system moves diagonally)
      driftAngle += 0.002;
      const dx = 40 * Math.cos(driftAngle) * scale;
      const dy = 30 * Math.sin(driftAngle) * scale;
      const cx = centerX + dx;
      const cy = centerY + dy;

      // Enhanced Sun with pulsing glow
      const sunGlow = 40 * scale + 10 * Math.sin(time * 0.02);
      ctx.save();
      if (mobile) {
        ctx.globalAlpha = 0.55;
        ctx.filter = "blur(1.5px)";
      }
      ctx.beginPath();
      ctx.arc(cx, cy, 12 * scale, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffaa33";
      ctx.shadowColor = "#ffaa33";
      ctx.shadowBlur = sunGlow;
      ctx.fill();

      // Add inner sun glow
      ctx.beginPath();
      ctx.arc(cx, cy, 8 * scale, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffff66";
      ctx.shadowColor = "#ffff66";
      ctx.shadowBlur = 20 * scale;
      ctx.fill();
      ctx.restore();

      // Planets with enhanced visuals
      planets.forEach((planet, i) => {
        const px = cx + planet.radiusX * Math.cos(planet.angle);
        const py = cy + planet.radiusY * Math.sin(planet.angle);

        // Orbit path with gradient
        ctx.beginPath();
        ctx.ellipse(cx, cy, planet.radiusX, planet.radiusY, 0, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + 0.03 * Math.sin(time * 0.01 + i)})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Orbit trace (fading trail)
        if (orbitTraces[i].length > 50) {
          orbitTraces[i].shift();
        }
        orbitTraces[i].push({ x: px, y: py, opacity: 1 });

        // Draw orbit trace
        if (orbitTraces[i].length > 1) {
          ctx.beginPath();
          ctx.moveTo(orbitTraces[i][0].x, orbitTraces[i][0].y);
          for (let j = 1; j < orbitTraces[i].length; j++) {
            const trace = orbitTraces[i][j];
            const opacity = trace.opacity * (j / orbitTraces[i].length);
            ctx.strokeStyle = `${planet.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 1;
            ctx.lineTo(trace.x, trace.y);
          }
          ctx.stroke();
        }

        // Update trace opacity
        orbitTraces[i].forEach(trace => {
          trace.opacity *= 0.98;
        });

        // Planet with enhanced glow
        const planetGlow = 10 * scale + 5 * Math.sin(time * 0.03 + i);
        ctx.save();
        if (mobile) {
          ctx.globalAlpha = 0.55;
          ctx.filter = "blur(1.5px)";
        }
        ctx.beginPath();
        ctx.arc(px, py, planet.size, 0, 2 * Math.PI);
        ctx.fillStyle = planet.color;
        ctx.shadowColor = planet.color;
        ctx.shadowBlur = planetGlow;
        ctx.fill();
        ctx.restore();

        // Planet ring (for Saturn-like planets)
        if (planet.name === "Saturn") {
          ctx.beginPath();
          ctx.ellipse(px, py, planet.size * 1.5, planet.size * 0.3, planet.angle * 0.5, 0, 2 * Math.PI);
          ctx.strokeStyle = `rgba(255, 255, 255, 0.3)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        planet.angle += planet.speed;

        // Earth Moon with enhanced visuals
        if (i === 2) {
          const mx = px + moon.radius * Math.cos(moon.angle);
          const my = py + moon.radius * Math.sin(moon.angle);

          // Moon orbit trace
          ctx.beginPath();
          ctx.arc(px, py, moon.radius, 0, 2 * Math.PI);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          ctx.lineWidth = 0.5;
          ctx.stroke();

          // Moon
          ctx.save();
          if (mobile) {
            ctx.globalAlpha = 0.55;
            ctx.filter = "blur(1.5px)";
          }
          ctx.beginPath();
          ctx.arc(mx, my, 1 * scale, 0, 2 * Math.PI);
          ctx.fillStyle = moon.color;
          ctx.shadowColor = moon.color;
          ctx.shadowBlur = 5 * scale;
          ctx.fill();
          ctx.restore();
        }
      });

      moon.angle += moon.speed;
      time++;

      requestAnimationFrame(draw);
    };

    draw();

    window.addEventListener("resize", () => {
      // Only update on true device orientation/size change
      const newMobile = isMobile();
      if (newMobile !== mobile) {
        window.location.reload(); // Force remount for correct sizing
      }
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none"
      style={
        isMobile()
          ? {
              position: "absolute",
              left: "50%",
              top: 0,
              transform: "translateX(-50%)",
              width: "100vw",
              height: "35vh",
              maxWidth: "100vw",
              maxHeight: "35vh",
              opacity: 1,
              filter: "blur(1.5px)",
              transition: "filter 0.3s, opacity 0.3s",
              zIndex: 0,
            }
          : {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              maxWidth: "100vw",
              maxHeight: "100vh",
              opacity: 1,
              filter: "none",
              transition: "filter 0.3s, opacity 0.3s",
              zIndex: 0,
            }
      }
    />
  );
}
