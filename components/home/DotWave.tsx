"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The research section's living background: a field of low-contrast warm-grey
 * dots on the near-black ground, continuously deformed by two slow travelling
 * waves — a scientific data field, not decorative particles.
 *
 * Implementation notes, all in service of "extremely smooth":
 *
 * - One canvas, redrawn on requestAnimationFrame. Each dot's y-offset,
 *   radius and alpha are modulated by two out-of-phase sine fields, so the
 *   deformation reads as flow rather than twinkle.
 * - The loop only runs while the canvas is on screen (IntersectionObserver)
 *   and the resolution is capped at 2x DPR, so the field never competes with
 *   the scroll thread.
 * - A shallow scroll parallax (0.06x) gives the field depth against the
 *   sharp, dominant type in front of it.
 * - `prefers-reduced-motion` renders one static frame and stops.
 */
export function DotWave({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let running = false;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const PITCH = 26;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      /* Shallow parallax: the field slides against the scroll. */
      const rect = canvas.getBoundingClientRect();
      const drift = rect.top * -0.06;

      const cols = Math.ceil(width / PITCH) + 2;
      const rows = Math.ceil(height / PITCH) + 4;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = c * PITCH + ((r % 2) * PITCH) / 2 - PITCH / 2;
          const baseY = r * PITCH - PITCH + drift;

          /* Two travelling waves, out of phase, plus a slow cross-swell. */
          const w1 = Math.sin(x * 0.012 + baseY * 0.006 + t * 0.00042);
          const w2 = Math.sin(x * 0.005 - baseY * 0.011 - t * 0.00027);
          const swell = Math.sin((x + baseY) * 0.003 + t * 0.00016);

          const y = baseY + w1 * 5 + swell * 3;
          const energy = (w1 + w2) / 2;

          const radius = 1.1 + (energy + 1) * 0.55;
          const alpha = 0.05 + (energy + 1) * 0.075 + swell * 0.02;
          if (alpha <= 0.02) continue;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          /* Warm grey — the brand's stone tone, never a new hue. */
          ctx.fillStyle = `rgba(168, 156, 140, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }
    };

    const loop = (t: number) => {
      draw(t);
      if (running) raf = requestAnimationFrame(loop);
    };

    resize();
    draw(0);
    if (reduced) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false;
        if (visible && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(canvas);

    const onResize = () => {
      resize();
      if (!running) draw(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
