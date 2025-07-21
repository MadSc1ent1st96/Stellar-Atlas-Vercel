import { useEffect, useRef } from 'react';

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

export default function DataGridBackground() {
  const canvasRef = useRef(null);
  const auroraCloudsRef = useRef([]);
  const starsRef = useRef([]);
  // Store the initial viewport size for fixed canvas
  const initialSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId;

    // On first mount, generate aurora clouds and stars using initial viewport size
    const w0 = window.innerWidth;
    const h0 = window.innerHeight;
    initialSizeRef.current = { width: w0, height: h0 };
    canvas.width = w0;
    canvas.height = h0;
    canvas.style.width = w0 + 'px';
    canvas.style.height = h0 + 'px';

    // Aurora clouds: drifting, swirling, blurred gradients
    auroraCloudsRef.current = [
      // Cyan main swirl
      {
        x: w0 * 0.3,
        y: h0 * 0.4,
        r: w0 * 0.7,
        colorStops: [
          [0, 'rgba(6,182,212,0.18)'],
          [0.4, 'rgba(6,182,212,0.10)'],
          [1, 'rgba(11,15,26,0.0)'],
        ],
        driftAngle: rand(0, Math.PI * 2),
        driftSpeed: rand(0.00012, 0.00018),
        blur: 18,
      },
      // Magenta swirl
      {
        x: w0 * 0.7,
        y: h0 * 0.3,
        r: w0 * 0.5,
        colorStops: [
          [0, 'rgba(236,72,153,0.13)'],
          [0.5, 'rgba(236,72,153,0.07)'],
          [1, 'rgba(11,15,26,0.0)'],
        ],
        driftAngle: rand(0, Math.PI * 2),
        driftSpeed: rand(0.00009, 0.00015),
        blur: 22,
      },
      // Blue swirl
      {
        x: w0 * 0.5,
        y: h0 * 0.7,
        r: w0 * 0.6,
        colorStops: [
          [0, 'rgba(59,130,246,0.10)'],
          [0.5, 'rgba(59,130,246,0.07)'],
          [1, 'rgba(11,15,26,0.0)'],
        ],
        driftAngle: rand(0, Math.PI * 2),
        driftSpeed: rand(0.00008, 0.00013),
        blur: 16,
      },
      // Purple accent
      {
        x: w0 * 0.8,
        y: h0 * 0.8,
        r: w0 * 0.4,
        colorStops: [
          [0, 'rgba(139,92,246,0.10)'],
          [0.5, 'rgba(139,92,246,0.07)'],
          [1, 'rgba(11,15,26,0.0)'],
        ],
        driftAngle: rand(0, Math.PI * 2),
        driftSpeed: rand(0.00007, 0.00011),
        blur: 20,
      },
    ];

    // Starfield: twinkling, some with slow parallax drift
    starsRef.current = Array.from({ length: 38 }, () => ({
      x: rand(0, w0),
      y: rand(0, h0),
      r: rand(0.7, 1.8),
      baseAlpha: rand(0.3, 0.8),
      twinkleSpeed: rand(0.001, 0.003),
      twinklePhase: rand(0, Math.PI * 2),
      driftAngle: rand(0, Math.PI * 2),
      driftSpeed: rand(0.00003, 0.00009),
      driftRadius: rand(6, 22),
    }));

    function draw() {
      const w = initialSizeRef.current.width;
      const h = initialSizeRef.current.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0b0f1a';
      ctx.fillRect(0, 0, w, h);
      // Aurora clouds
      auroraCloudsRef.current.forEach(cloud => {
        cloud.driftAngle += cloud.driftSpeed;
        const dx = Math.cos(cloud.driftAngle) * 18;
        const dy = Math.sin(cloud.driftAngle) * 18;
        const grad = ctx.createRadialGradient(cloud.x + dx, cloud.y + dy, 0, cloud.x + dx, cloud.y + dy, cloud.r);
        cloud.colorStops.forEach(([stop, color]) => grad.addColorStop(stop, color));
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.filter = `blur(${cloud.blur}px)`;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cloud.x + dx, cloud.y + dy, cloud.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      // Starfield
      const t = performance.now();
      starsRef.current.forEach(star => {
        // Parallax drift
        star.driftAngle += star.driftSpeed;
        const px = star.x + Math.cos(star.driftAngle) * star.driftRadius;
        const py = star.y + Math.sin(star.driftAngle) * star.driftRadius;
        // Twinkle
        const twinkle = Math.sin(t * star.twinkleSpeed + star.twinklePhase) * 0.5 + 0.5;
        ctx.save();
        ctx.globalAlpha = star.baseAlpha * (0.7 + 0.6 * twinkle);
        ctx.beginPath();
        ctx.arc(px, py, star.r, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });
      animationId = requestAnimationFrame(draw);
    }
    draw();

    // On resize/scroll/orientation, do nothing (keep canvas fixed and centered)
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, opacity: 1, touchAction: 'none', objectFit: 'cover', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    />
  );
} 