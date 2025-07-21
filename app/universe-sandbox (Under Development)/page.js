"use client";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FaPlus, FaPlay, FaPause, FaInfoCircle } from "react-icons/fa";

// NOTE: If you want to disable scrolling globally, add this to globals.css:
// html, body { overflow: hidden !important; }

function Minimap({ planets, draggedPlanet }) {
  const size = 100;
  const cx = size / 2;
  const cy = size / 2;
  const scale = 2.2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="bg-black/70 backdrop-blur-md rounded-full shadow-lg border-2 border-cyan-400 transition-all duration-300"
      style={{ minWidth: size, minHeight: size }}
    >
      <defs>
        <radialGradient id="minimap-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#22292f" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0b0f1a" stopOpacity="0.7" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={size / 2 - 2} fill="url(#minimap-bg)" />
      {/* Sun */}
      <circle cx={cx} cy={cy} r={8} fill="#ffe066" stroke="#fff" strokeWidth={1.5} />
      {/* Orbits */}
      {planets.map((p, i) => (
        <circle key={p.id} cx={cx} cy={cy} r={p.orbit * scale} fill="none" stroke="#3cf" strokeDasharray="2 2" strokeWidth={0.7} />
      ))}
      {/* Planets */}
      {planets.map((p, i) => (
        <circle
          key={p.id}
          cx={cx + Math.cos(p.angle) * p.orbit * scale}
          cy={cy + Math.sin(p.angle) * p.orbit * scale}
          r={p.radius * scale + (draggedPlanet === p.id ? 2 : 0)}
          fill={`#${p.color.toString(16).padStart(6, "0")}`}
          stroke={draggedPlanet === p.id ? "#fff" : "#222"}
          strokeWidth={draggedPlanet === p.id ? 2 : 1}
          style={{ filter: draggedPlanet === p.id ? "drop-shadow(0 0 6px #fff)" : undefined }}
        />
      ))}
    </svg>
  );
}

export default function UniverseSandbox() {
  const mountRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [planets, setPlanets] = useState([
    { id: 1, color: 0x3399ff, radius: 1, orbit: 10, speed: 0.0005, angle: 0 },
    { id: 2, color: 0xff6633, radius: 1.5, orbit: 15, speed: 0.0003, angle: Math.PI },
  ]);
  const [draggedPlanet, setDraggedPlanet] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [dragPlanetIdx, setDragPlanetIdx] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Only run mobile detection on client
  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 640);
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 20, 30);
    camera.lookAt(0, 0, 0);
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x0b0f1a, 1);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = true;
    controls.minDistance = 10;
    controls.maxDistance = 200;
    controls.target.set(0, 0, 0);
    controls.update();
    // Starry background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const starVertices = [];
    for (let i = 0; i < starCount; i++) {
      const r = 200 + Math.random() * 400;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, sizeAttenuation: true });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    // Sun
    const sunGeometry = new THREE.SphereGeometry(3, 64, 64);
    const sunMaterial = new THREE.MeshStandardMaterial({ color: 0xffff99, emissive: 0xfff7b2, emissiveIntensity: 1.2, metalness: 0.2, roughness: 0.3 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.castShadow = false;
    sun.receiveShadow = false;
    scene.add(sun);
    // Planets
    const planetMeshes = [];
    planets.forEach((planet, i) => {
      const geometry = new THREE.SphereGeometry(planet.radius, 48, 48);
      const material = new THREE.MeshStandardMaterial({
        color: planet.color,
        metalness: 0.4,
        roughness: 0.5,
        emissive: planet.color,
        emissiveIntensity: 0.08,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData.planetId = planet.id;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      planetMeshes.push(mesh);
    });
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xfff7b2, 2, 200);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);
    // Drag logic (pointer events only on canvas)
    let dragging = false;
    let dragStartLocal = null;
    let dragPlanetIdxLocal = null;
    let dragStartAngle = 0;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    function getPointerPos(e) {
      if (e.touches) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else {
        return { x: e.clientX, y: e.clientY };
      }
    }
    function onPointerDown(e) {
      if ((e.button !== undefined && e.button !== 0) && !e.touches) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const pos = getPointerPos(e);
      mouse.x = ((pos.x - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((pos.y - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetMeshes);
      if (intersects.length > 0) {
        dragging = true;
        dragPlanetIdxLocal = planetMeshes.indexOf(intersects[0].object);
        dragStartLocal = pos;
        dragStartAngle = planets[dragPlanetIdxLocal].angle;
        setDraggedPlanet(planets[dragPlanetIdxLocal].id);
        setDragStart(pos);
        setDragPlanetIdx(dragPlanetIdxLocal);
        controls.enabled = false;
      }
    }
    function onPointerMove(e) {
      if (dragging && dragPlanetIdxLocal !== null) {
        const pos = getPointerPos(e);
        const dx = pos.x - dragStartLocal.x;
        const dAngle = dx * 0.01;
        setPlanets(prev => prev.map((p, i) =>
          i === dragPlanetIdxLocal ? { ...p, angle: dragStartAngle + dAngle } : p
        ));
      }
    }
    function onPointerUp() {
      dragging = false;
      dragPlanetIdxLocal = null;
      setDraggedPlanet(null);
      setDragPlanetIdx(null);
      setDragStart(null);
      controls.enabled = true;
    }
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("touchstart", onPointerDown, { passive: false });
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("touchmove", onPointerMove, { passive: false });
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("touchend", onPointerUp);
    // Animation loop
    let frameId;
    const animate = () => {
      planetMeshes.forEach((mesh, i) => {
        const planet = planets[i];
        if (isPlaying && draggedPlanet !== planet.id) {
          planet.angle += planet.speed * 16;
        }
        mesh.position.x = planet.orbit * Math.cos(planet.angle);
        mesh.position.z = planet.orbit * Math.sin(planet.angle);
        // Visual feedback for drag
        if (draggedPlanet === planet.id) {
          mesh.scale.set(1.2, 1.2, 1.2);
          mesh.material.emissiveIntensity = 0.3;
        } else {
          mesh.scale.set(1, 1, 1);
          mesh.material.emissiveIntensity = 0.08;
        }
      });
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();
    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("touchstart", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("touchmove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("touchend", onPointerUp);
    };
    // eslint-disable-next-line
  }, [planets, isPlaying, draggedPlanet, mounted]);

  // Add planet (Math.random only in handler, not initial state)
  function addPlanet() {
    setPlanets(prev => [
      ...prev,
      {
        id: Date.now(),
        color: Math.floor(Math.random() * 0xffffff),
        radius: 0.8 + Math.random() * 1.2,
        orbit: 7 + Math.random() * 18,
        speed: 0.0002 + Math.random() * 0.0005,
        angle: Math.random() * Math.PI * 2,
      },
    ]);
  }

  if (!mounted) return null;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-10" />
      {/* Minimap: bottom-right on mobile, top-right on desktop */}
      <div
        className={`fixed ${isMobile ? "bottom-4 right-4" : "top-4 right-4"} z-50`}
        style={{ pointerEvents: "none", marginTop: isMobile ? 0 : '64px' }}
      >
        <Minimap planets={planets} draggedPlanet={draggedPlanet} />
      </div>
      {/* Floating Action Button (FAB) for Add Planet */}
      <button
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full shadow-lg p-4 transition-all duration-200 sm:hidden"
        style={{ fontSize: 28 }}
        onClick={addPlanet}
        aria-label="Add Planet"
      >
        <FaPlus />
      </button>
      {/* Bottom Sheet Controls for Mobile, Sidebar for Desktop */}
      <div
        className={`fixed ${isMobile ? "bottom-0 left-0 right-0" : "top-4 left-4"} z-50 bg-black/80 backdrop-blur-md text-cyan-200 ${isMobile ? "rounded-t-2xl p-3" : "rounded-2xl p-5 min-w-[200px]"} shadow-lg border border-cyan-700 transition-all duration-300 flex flex-col items-center gap-3`}
        style={{ maxWidth: isMobile ? "100vw" : 260, marginTop: isMobile ? 0 : '64px' }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(p => !p)}
            className="bg-gradient-to-r from-indigo-700 to-cyan-700 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold rounded-full p-3 shadow transition-all duration-200"
            aria-label={isPlaying ? "Pause" : "Play"}
            style={{ fontSize: 22 }}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={() => setShowControls(s => !s)}
            className="bg-gradient-to-r from-cyan-700 to-indigo-700 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold rounded-full p-3 shadow transition-all duration-200"
            aria-label="Info"
            style={{ fontSize: 22 }}
          >
            <FaInfoCircle />
          </button>
        </div>
        {showControls && (
          <div className="w-full text-xs text-cyan-300 mt-2 text-center">
            <div>Drag planets in 3D view. Orbits shown in minimap.</div>
            <div className="mt-1">Pinch/scroll to zoom. Tap and drag to rotate the view.</div>
          </div>
        )}
        {/* Add Planet button for desktop */}
        <button
          onClick={addPlanet}
          className="hidden sm:block w-full mt-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-700 to-indigo-700 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold shadow transition-all duration-200"
        >
          + Add Planet
        </button>
      </div>
    </div>
  );
} 