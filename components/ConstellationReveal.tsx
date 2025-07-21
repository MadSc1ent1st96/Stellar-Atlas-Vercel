"use client";

import { useEffect, useRef } from "react";

export default function ConstellationReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    // Dust particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 1.2 + 0.3,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    // Shooting stars
    let shootingStars: any[] = [];
    let shootingTimer = 0;

    const spawnShootingStar = () => {
      const startX = Math.random() * w;
      const startY = Math.random() * h * 0.4;
      const angle = Math.PI / 4;
      const speed = Math.random() * 3 + 10;
      const length = Math.random() * 100 + 80;
      const isSuper = Math.random() < 0.1;

      shootingStars.push({
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle + (isSuper ? 0.3 : 0)) * speed,
        length: isSuper ? length * 1.5 : length,
        life: isSuper ? 120 : 80,
        isSuper,
      });
    };

    const drawAurora = () => {
      const gradient1 = ctx.createRadialGradient(w * 0.2, h * 0.2, 100, w * 0.2, h * 0.2, 400);
      gradient1.addColorStop(0, "rgba(0,255,255,0.08)");
      gradient1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, w, h);

      const gradient2 = ctx.createRadialGradient(w * 0.8, h * 0.8, 100, w * 0.8, h * 0.8, 400);
      gradient2.addColorStop(0, "rgba(255,0,255,0.06)");
      gradient2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, w, h);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      drawAurora();

      // Draw dust
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
      }

      // Draw shooting stars
      shootingStars = shootingStars.filter((s) => s.life > 0);
      for (const star of shootingStars) {
        const endX = star.x - star.dx * star.length * 0.1;
        const endY = star.y - star.dy * star.length * 0.1;

        const gradient = ctx.createLinearGradient(star.x, star.y, endX, endY);
        gradient.addColorStop(0, "rgba(255,255,255,0.8)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.isSuper ? 2.5 : 1.5;
        ctx.stroke();

        star.x += star.dx;
        star.y += star.dy;
        star.life--;
      }

      // More frequent spawn rate
      if (shootingTimer++ % 300 === 0) {
        spawnShootingStar();
      }

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-1 pointer-events-none"
    />
  );
}
