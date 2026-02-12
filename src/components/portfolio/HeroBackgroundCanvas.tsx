import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

/**
 * Premium subtle background:
 * - Mouse parallax (pointer-reactive)
 * - Scroll parallax (drifts with scroll)
 * - Depth grid (perspective feel)
 * - Slow gradient sweep (ActiveTheory-ish light pass)
 *
 * IMPORTANT:
 * - No React re-renders on scroll
 * - Uses requestAnimationFrame and refs for smoothness
 */
export const HeroBackgroundCanvas: React.FC<Props> = ({ className }) => {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const layerA = useRef<HTMLDivElement | null>(null);
  const layerB = useRef<HTMLDivElement | null>(null);
  const layerC = useRef<HTMLDivElement | null>(null);
  const grain = useRef<HTMLDivElement | null>(null);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const sweepRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // pointer target (normalized -0.5..0.5)
    let targetPX = 0;
    let targetPY = 0;

    // smoothed pointer
    let px = 0;
    let py = 0;

    // scroll
    let targetScroll = window.scrollY || 0;
    let scrollY = targetScroll;

    let raf = 0;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width; // 0..1
      const y = (e.clientY - rect.top) / rect.height; // 0..1
      targetPX = x - 0.5;
      targetPY = y - 0.5;
    };

    const onLeave = () => {
      targetPX = 0;
      targetPY = 0;
    };

    const onScroll = () => {
      targetScroll = window.scrollY || 0;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      // smooth pointer
      px = lerp(px, targetPX, 0.08);
      py = lerp(py, targetPY, 0.08);

      // smooth scroll
      scrollY = lerp(scrollY, targetScroll, 0.06);

      // map scroll to a tiny drift (subtle!)
      const s = scrollY * 0.02;

      // blob layers
      if (layerA.current) {
        const x = px * 26 + s * 0.35;
        const y = py * 18 + s * 0.25;
        layerA.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (layerB.current) {
        const x = px * -20 + s * -0.28;
        const y = py * 14 + s * 0.18;
        layerB.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (layerC.current) {
        const x = px * 14 + s * 0.22;
        const y = py * -16 + s * -0.2;
        layerC.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      // grain tiny drift
      if (grain.current) {
        const gx = px * 6 + s * 0.1;
        const gy = py * 6 + s * 0.08;
        grain.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      }

      // depth grid: scroll creates "movement in space"
      if (gridRef.current) {
        const gx = px * 14;
        const gy = py * 10;
        const scrollShift = (scrollY * 0.35) % 200; // grid flow
        gridRef.current.style.transform = `
          perspective(900px)
          rotateX(${10 + py * 6}deg)
          rotateY(${px * -6}deg)
          translate3d(${gx}px, ${gy + scrollShift}px, 0)
        `;
      }

      // sweep: slightly reacts to pointer so it feels alive
      if (sweepRef.current) {
        sweepRef.current.style.transform = `translate3d(${px * 20}px, ${py * 10}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={cn("relative w-full h-full overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Local keyframes (no CSS file edits needed) */}
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-120%) rotate(12deg); opacity: 0; }
          18% { opacity: 0.45; }
          50% { opacity: 0.30; }
          82% { opacity: 0.45; }
          100% { transform: translateX(120%) rotate(12deg); opacity: 0; }
        }

        @keyframes gridPulse {
          0%,100% { opacity: 0.22; }
          50% { opacity: 0.30; }
        }
      `}</style>

      {/* Base */}
      <div className="absolute inset-0 bg-background" />

      {/* Soft wash */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(900px circle at 25% 25%, rgba(99,102,241,0.16), transparent 60%)," +
            "radial-gradient(900px circle at 80% 70%, rgba(236,72,153,0.12), transparent 60%)",
        }}
      />

      {/* Depth Grid (subtle, perspective) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          ref={gridRef}
          className="absolute left-1/2 top-[60%] -translate-x-1/2 w-[160%] h-[140%] will-change-transform"
          style={{
            transformOrigin: "50% 30%",
            opacity: 0.24,
            animation: "gridPulse 6s ease-in-out infinite",
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(236,72,153,0.10) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(circle at 50% 40%, rgba(0,0,0,0.9), transparent 62%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 40%, rgba(0,0,0,0.9), transparent 62%)",
          }}
        />
      </div>

      {/* Parallax blobs */}
      <div
        ref={layerA}
        className="absolute -top-48 -left-48 h-[560px] w-[560px] rounded-full blur-[95px] opacity-25 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.55), transparent 62%)",
        }}
      />

      <div
        ref={layerB}
        className="absolute -bottom-56 -right-56 h-[700px] w-[700px] rounded-full blur-[110px] opacity-20 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(236,72,153,0.48), transparent 62%)",
        }}
      />

      <div
        ref={layerC}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full blur-[105px] opacity-[0.14] will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.45), transparent 65%)",
        }}
      />

      {/* Slow Gradient Sweep (ActiveTheory-ish) */}
      <div ref={sweepRef} className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-0 top-0 h-full w-[55%]"
          style={{
            animation: "sweep 10.5s linear infinite",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0), rgba(99,102,241,0.10), rgba(236,72,153,0.08), rgba(255,255,255,0))",
            filter: "blur(12px)",
            mixBlendMode: "soft-light",
          }}
        />
      </div>

      {/* readability vignette (very light) */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/5 via-transparent to-background/18" />

      {/* Film grain */}
      <div
        ref={grain}
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none will-change-transform"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
};
