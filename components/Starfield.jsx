"use client";

import { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("❌ Canvas not mounted");
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error("❌ Canvas context (ctx) is null");
      return;
    }

    console.log("✅ Canvas ctx loaded:", ctx);
    console.log("🧭 Canvas size:", canvas.width, canvas.height);

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const numStars = 300;
    const stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.05,
      dy: (Math.random() - 0.5) * 0.05,
      alpha: Math.random() * 0.8 + 0.2,
      dAlpha: (Math.random() * 0.005 + 0.002) * (Math.random() < 0.5 ? 1 : -1)
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (let star of stars) {
        star.x += star.dx;
        star.y += star.dy;
        star.alpha += star.dAlpha;

        if (star.alpha <= 0.1 || star.alpha >= 1) star.dAlpha *= -1;
        if (star.x < 0 || star.x > width) star.dx *= -1;
        if (star.y < 0 || star.y > height) star.dy *= -1;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      console.log("📐 Resized to:", width, height);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
