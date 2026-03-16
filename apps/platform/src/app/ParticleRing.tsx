"use client";

import { useEffect, useRef } from "react";

const DEFAULT_CANVAS_SIZE = 340;
const DEFAULT_PARTICLE_COUNT = 350;
const DEFAULT_RING_RADIUS = 105;
const DEFAULT_RING_THICKNESS = 45;
const DEFAULT_CONNECTION_DIST = 50;
const DEFAULT_REPEL_DIST = 100;
const DEFAULT_REPEL_STRENGTH = 5;
const BREATH_SPEED = 0.0015;
const DEFAULT_BREATH_AMOUNT = 18;

interface Particle {
  x: number;
  y: number;
  baseAngle: number;
  baseRadius: number;
  angle: number;
  orbitSpeed: number;
  wobbleSpeed: number;
  wobbleAmt: number;
  wobbleOffset: number;
  pulseSpeed: number;
  pulseOffset: number;
  baseSize: number;
  size: number;
  color: [number, number, number];
  alpha: number;
  vx: number;
  vy: number;
}

const PALETTE: [number, number, number][] = [
  [62, 207, 142],  // Supabase brand green #3ECF8E
  [36, 180, 126],  // darker emerald #24B47E
  [101, 217, 165], // light mint #65D9A5
  [62, 180, 137],  // muted teal
  [170, 236, 206], // pale mint glow
  [255, 255, 255], // white sparks
  [80, 200, 150],  // soft emerald
];

export default function ParticleRing({ size }: { size?: number } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  const CANVAS_SIZE = size || DEFAULT_CANVAS_SIZE;
  const scale = CANVAS_SIZE / DEFAULT_CANVAS_SIZE;
  const PARTICLE_COUNT = Math.round(DEFAULT_PARTICLE_COUNT * scale);
  const RING_RADIUS = DEFAULT_RING_RADIUS * scale;
  const RING_THICKNESS = DEFAULT_RING_THICKNESS * scale;
  const CONNECTION_DIST = DEFAULT_CONNECTION_DIST * scale;
  const REPEL_DIST = DEFAULT_REPEL_DIST * scale;
  const REPEL_STRENGTH = DEFAULT_REPEL_STRENGTH * scale;
  const BREATH_AMOUNT = DEFAULT_BREATH_AMOUNT * scale;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    ctx.scale(dpr, dpr);

    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;

    // Initialize particles spread across a thick ring band
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = RING_RADIUS + (Math.random() - 0.5) * RING_THICKNESS * 2;
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      const isWhite = color[0] === 255 && color[1] === 255 && color[2] === 255;

      particles.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        baseAngle: angle,
        baseRadius: radius,
        angle,
        orbitSpeed: (0.001 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1),
        wobbleSpeed: 0.02 + Math.random() * 0.03,
        wobbleAmt: 2 + Math.random() * 6,
        wobbleOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.04,
        pulseOffset: Math.random() * Math.PI * 2,
        baseSize: isWhite ? 1 + Math.random() * 2 : 1.5 + Math.random() * 3.5,
        size: 2,
        color,
        alpha: 0.4 + Math.random() * 0.6,
        vx: 0,
        vy: 0,
      });
    }

    let time = 0;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      time++;

      const mouse = mouseRef.current;

      // Breathing — ring radius oscillates
      const breathOffset = Math.sin(time * BREATH_SPEED) * BREATH_AMOUNT;
      // Secondary breath for organic feel
      const breathOffset2 = Math.sin(time * BREATH_SPEED * 1.7 + 1.3) * BREATH_AMOUNT * 0.3;

      // Draw a subtle glow behind the ring
      const glowRadius = RING_RADIUS + breathOffset + breathOffset2;
      const grad = ctx.createRadialGradient(cx, cy, glowRadius - 30, cx, cy, glowRadius + 40);
      grad.addColorStop(0, "rgba(62, 207, 142, 0.0)");
      grad.addColorStop(0.5, `rgba(62, 207, 142, ${0.03 + Math.sin(time * BREATH_SPEED) * 0.02})`);
      grad.addColorStop(1, "rgba(62, 207, 142, 0.0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Update particles
      for (const p of particles) {
        p.angle += p.orbitSpeed;

        // Wobble radially for organic motion
        const wobble = Math.sin(time * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmt;
        const currentRadius = p.baseRadius + breathOffset + breathOffset2 * Math.sin(p.baseAngle * 3) + wobble;

        const targetX = cx + Math.cos(p.angle) * currentRadius;
        const targetY = cy + Math.sin(p.angle) * currentRadius;

        // Mouse repulsion
        const dx = targetX - mouse.x;
        const dy = targetY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_DIST && dist > 0) {
          const force = ((REPEL_DIST - dist) / REPEL_DIST) * REPEL_STRENGTH;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        // Spring back + damping
        p.vx += (targetX - p.x) * 0.08;
        p.vy += (targetY - p.y) * 0.08;
        p.vx *= 0.85;
        p.vy *= 0.85;

        p.x += p.vx;
        p.y += p.vy;

        // Pulsing size
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset);
        p.size = p.baseSize * (0.7 + pulse * 0.3);

        // Draw particle with glow
        const [r, g, b] = p.color;
        const alpha = p.alpha * (0.7 + pulse * 0.3);

        // Outer glow
        const glowSize = p.size * 3;
        const particleGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
        particleGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`);
        particleGrad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.2})`);
        particleGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = particleGrad;
        ctx.fillRect(p.x - glowSize, p.y - glowSize, glowSize * 2, glowSize * 2);

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      }

      // Draw connections (only check neighbors by index proximity for perf)
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        // Check a window of nearby particles
        for (let j = i + 1; j < Math.min(i + 12, particles.length); j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DIST) {
            const opacity = (1 - dist / CONNECTION_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(62, 207, 142, ${opacity})`;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [CANVAS_SIZE, scale, PARTICLE_COUNT, RING_RADIUS, RING_THICKNESS, CONNECTION_DIST, REPEL_DIST, REPEL_STRENGTH, BREATH_AMOUNT]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}
