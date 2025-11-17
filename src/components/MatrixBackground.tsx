import { useEffect, useRef } from 'react';

const hexToRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const MatrixBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowCacheRef = useRef<Map<string, HTMLCanvasElement>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use logical (CSS) pixels for layout and scale for high-DPI / mobile screens
    let logicalWidth = window.innerWidth;
    let logicalHeight = window.innerHeight;
    const cellSize = 16;
    let cols = 0;
    let rows = 0;

    const updateCanvasSize = () => {
      logicalWidth = window.innerWidth;
      logicalHeight = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;

      // Reset transform then scale so drawing units stay in CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.floor(logicalWidth / cellSize);
      rows = Math.floor(logicalHeight / cellSize);
    };

    updateCanvasSize();

    const MAX_ACTIVE = 28;

    const palette = [
      '#f5e0dc',
      '#f2cdcd',
      '#eba0ac',
      '#cba6f7',
      '#89b4fa',
      '#74c7ec',
      '#94e2d5',
      '#a6e3a1',
      '#f9e2af',
      '#fab387',
    ];

    type Spark = {
      x: number;
      y: number;
      color: string;
      age: number;
      totalDuration: number;
      fadeIn: number;
      hold: number;
      fadeOut: number;
      scale: number;
    };

    const sparks: Spark[] = [];
    const occupied = new Set<string>();

    const keyOf = (x: number, y: number) => `${x},${y}`;

    const randBetween = (min: number, max: number) => min + Math.random() * (max - min);

    const spawnSpark = () => {
      let x = 0, y = 0;
      let attempts = 0;
      do {
        x = Math.floor(Math.random() * cols);
        y = Math.floor(Math.random() * rows);
        attempts++;
      } while (occupied.has(keyOf(x, y)) && attempts < 50);

      const fadeIn = randBetween(0.25, 0.45);
      const hold = randBetween(0.25, 0.45);
      const fadeOut = randBetween(1.2, 1.8);

      const spark: Spark = {
        x,
        y,
        color: palette[Math.floor(Math.random() * palette.length)],
        age: 0,
        totalDuration: fadeIn + hold + fadeOut,
        fadeIn,
        hold,
        fadeOut,
        scale: randBetween(1.0, 1.4),
      };

      sparks.push(spark);
      occupied.add(keyOf(x, y));
    };

    for (let i = 0; i < MAX_ACTIVE; i++) spawnSpark();

    const ease = (t: number) => t * t * (3 - 2 * t);

    let lastTs = performance.now();
    let rafId = 0 as number;

    const getGlowSprite = (color: string, scale: number) => {
      const dpr = window.devicePixelRatio || 1;
      const bucketedScale = Math.round(scale * 10) / 10;
      const key = `${color}-${bucketedScale}`;
      const glowCache = glowCacheRef.current;

      if (glowCache.has(key)) {
        return glowCache.get(key)!;
      }

      const baseSize = cellSize * 3.2 * bucketedScale;
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = baseSize * dpr;
      spriteCanvas.height = baseSize * dpr;

      const spriteCtx = spriteCanvas.getContext('2d');
      if (spriteCtx) {
        spriteCtx.scale(dpr, dpr);

        const radius = baseSize / 2;
        const gradient = spriteCtx.createRadialGradient(
          radius,
          radius,
          radius * 0.2,
          radius,
          radius,
          radius
        );

        gradient.addColorStop(0, hexToRgba(color, 0.6));
        gradient.addColorStop(0.4, hexToRgba(color, 0.28));
        gradient.addColorStop(1, hexToRgba(color, 0));

        spriteCtx.fillStyle = gradient;
        spriteCtx.fillRect(0, 0, baseSize, baseSize);
      }

      glowCache.set(key, spriteCanvas);
      return spriteCanvas;
    };

    const drawFrame = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;

      // Clear in logical coordinate space (CSS pixels)
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const isMobileViewport = logicalWidth < 768;

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;

        let alpha = 0;
        if (s.age <= s.fadeIn) {
          alpha = ease(s.age / s.fadeIn);
        } else if (s.age <= s.fadeIn + s.hold) {
          alpha = 1;
        } else if (s.age <= s.totalDuration) {
          const t = (s.age - s.fadeIn - s.hold) / s.fadeOut;
          alpha = 1 - ease(Math.min(1, Math.max(0, t)));
        } else {
          alpha = 0;
        }

        if (s.age >= s.totalDuration + 0.12) {
          occupied.delete(keyOf(s.x, s.y));
          sparks.splice(i, 1);
          continue;
        }

        if (alpha <= 0.001) {
          continue;
        }

        const baseSize = cellSize * s.scale;
        const sprite = getGlowSprite(s.color, s.scale);
        const centerX = s.x * cellSize + cellSize / 2;
        const centerY = s.y * cellSize + cellSize / 2;
        const sizeMultiplier = isMobileViewport ? 2.05 : 1.8;
        const drawSize = baseSize * sizeMultiplier * (1 + 0.15 * alpha);

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.globalCompositeOperation = 'lighter';
        ctx.drawImage(sprite, centerX - drawSize / 2, centerY - drawSize / 2, drawSize, drawSize);
        ctx.restore();
      }

      while (sparks.length < MAX_ACTIVE) spawnSpark();

      rafId = requestAnimationFrame(drawFrame);
    };

    rafId = requestAnimationFrame(drawFrame);

    const clearIntervalId = setInterval(() => {
      ctx.clearRect(0, 0, logicalWidth, logicalHeight);
    }, 5000);

    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(clearIntervalId);
      window.removeEventListener('resize', handleResize);
      glowCacheRef.current.clear();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 bg-transparent"
      style={{ background: 'transparent' }}
    />
  );
};
