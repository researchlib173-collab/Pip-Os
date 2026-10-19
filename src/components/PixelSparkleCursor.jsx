import React, { useEffect, useRef } from 'react';

/**
 * PixelSparkleCursor.jsx
 * 
 * Ultra-Lightweight Pixel-Sparkle Cursor Effect:
 * - Emits glowing yellow pixel-art sparkles on pointer moves and clicks.
 * - Star and diamond pixel patterns with crisp pixel halos (no heavy canvas shadowBlur or screen blend mode).
 * - Capped at 24 active particles with throttled movement updates for zero-lag 60fps performance.
 * - Smooth fade-out of particle opacity and luminescence.
 */
export default function PixelSparkleCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = [];
    const maxParticles = 24;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    // Yellow tones palette
    const yellowTones = [
      { core: '#ffffff', glow: 'rgba(254, 240, 138, ' }, // Bright white-gold core
      { core: '#fef08a', glow: 'rgba(250, 204, 21, ' },  // Soft buttercup
      { core: '#facc15', glow: 'rgba(234, 179, 8, ' },   // Golden yellow
      { core: '#fbbf24', glow: 'rgba(217, 119, 6, ' }    // Warm amber
    ];

    const createSparkle = (x, y, vx, vy, size = 4, burst = false) => {
      if (particles.length >= maxParticles) {
        particles.shift();
      }

      const tone = yellowTones[Math.floor(Math.random() * yellowTones.length)];

      particles.push({
        x,
        y,
        vx: vx + (Math.random() - 0.5) * (burst ? 3.0 : 1.2),
        vy: vy + (Math.random() - 0.5) * (burst ? 3.0 : 1.2) - (burst ? 0.6 : 0.3),
        size,
        life: 1.0,
        decay: burst ? 0.025 + Math.random() * 0.02 : 0.035 + Math.random() * 0.02,
        tone,
        type: Math.random() > 0.4 ? 'star' : 'diamond'
      });
    };

    let prevX = 0;
    let prevY = 0;
    let lastMoveTime = 0;

    const handlePointerMove = (e) => {
      const now = performance.now();
      if (now - lastMoveTime < 24) return; // Throttle to ~40fps for event handling

      const x = e.clientX;
      const y = e.clientY;
      const dx = x - prevX;
      const dy = y - prevY;
      const distSq = dx * dx + dy * dy;

      if (distSq > 144) { // Only emit when moving more than 12px
        lastMoveTime = now;
        createSparkle(
          x + (Math.random() - 0.5) * 6,
          y + (Math.random() - 0.5) * 6,
          dx * 0.08,
          dy * 0.08,
          Math.random() > 0.5 ? 4 : 3,
          false
        );
        prevX = x;
        prevY = y;
      }
    };

    const handlePointerDown = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const burstCount = 6;
      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const spd = 1.5 + Math.random() * 2.2;
        createSparkle(
          x,
          y,
          Math.cos(angle) * spd,
          Math.sin(angle) * spd,
          4,
          true
        );
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });

    // Lightweight Crisp Pixel Star (Halo + Core)
    const drawPixelStar = (ctx, px, py, s, life, tone) => {
      const alpha = Math.max(0, life);
      const half = Math.floor(s / 2);

      // Outer pixel glow halo (fast rectangular fill without blur)
      ctx.fillStyle = tone.glow + (alpha * 0.4).toFixed(3) + ')';
      ctx.fillRect(px - half - 2, py - 1, (half + 2) * 2 + 1, 3);
      ctx.fillRect(px - 1, py - half - 2, 3, (half + 2) * 2 + 1);

      // Inner bright yellow bar
      ctx.fillStyle = tone.core;
      ctx.globalAlpha = alpha;
      ctx.fillRect(px - half, py, half * 2 + 1, 1);
      ctx.fillRect(px, py - half, 1, half * 2 + 1);

      // Center white sparkle core
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px, py, 1, 1);
    };

    // Lightweight Crisp Pixel Diamond
    const drawPixelDiamond = (ctx, px, py, s, life, tone) => {
      const alpha = Math.max(0, life);

      // Outer glow
      ctx.fillStyle = tone.glow + (alpha * 0.35).toFixed(3) + ')';
      ctx.fillRect(px - s - 1, py - 1, (s + 1) * 2 + 1, 3);
      ctx.fillRect(px - 1, py - s - 1, 3, (s + 1) * 2 + 1);

      // Inner diamond
      ctx.fillStyle = tone.core;
      ctx.globalAlpha = alpha;
      ctx.fillRect(px - s, py, s * 2 + 1, 1);
      ctx.fillRect(px, py - s, 1, s * 2 + 1);
      ctx.fillRect(px - 1, py - 1, 3, 3);
    };

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (particles.length === 0) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03; // Gentle downward float
        p.vx *= 0.96;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const px = Math.round(p.x);
        const py = Math.round(p.y);

        if (p.type === 'star') {
          drawPixelStar(ctx, px, py, p.size, p.life, p.tone);
        } else {
          drawPixelDiamond(ctx, px, py, p.size, p.life, p.tone);
        }
      }

      ctx.globalAlpha = 1.0;
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99999] select-none"
      style={{ width: '100vw', height: '100vh', willChange: 'contents' }}
    />
  );
}
