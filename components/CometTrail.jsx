"use client";

import { useEffect, useRef } from 'react';

export default function CometTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const comets = Array.from({ length: 5 }, () => createComet());

    function createComet() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 2 + 1,
        vy: Math.random() * 0.5 - 0.25,
        length: 100 + Math.random() * 50,
        size: 2 + Math.random() * 2,
        opacity: 0.6 + Math.random() * 0.4,
        life: 0,
        maxLife: 600 + Math.random() * 20,
      };
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let comet of comets) {
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(comet.x, comet.y, comet.x - comet.length, comet.y);
        gradient.addColorStop(0, `rgba(255,255,255,${comet.opacity})`);
        gradient.addColorStop(1, `rgba(0,0,0,0)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(comet.x - comet.length, comet.y - comet.size / 2, comet.length, comet.size);

        comet.x += comet.vx;
        comet.y += comet.vy;
        comet.life++;

        if (comet.x > canvas.width || comet.life > comet.maxLife) {
          Object.assign(comet, createComet());
          comet.x = 0;
          comet.y = Math.random() * canvas.height;
        }
      }
      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-30 opacity-50" />;
}
