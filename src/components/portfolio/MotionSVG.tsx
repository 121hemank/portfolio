import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Optimized for Chrome — uses only transform & opacity (GPU-composited),
// avoids SVG-internal attribute animations that skip the GPU.

export const AnimatedWaves = () => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none will-change-transform"
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.08 }}
    >
      <motion.path
        d="M0 500 Q 180 380, 360 470 T 720 440 T 1080 480 T 1440 430"
        stroke="url(#wave1)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.path
        d="M0 560 Q 200 480, 400 540 T 800 510 T 1200 550 T 1440 500"
        stroke="url(#wave2)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3.5, ease: "easeInOut", delay: 0.6 }}
      />
      <motion.path
        d="M0 620 Q 220 550, 440 600 T 880 570 T 1320 610 T 1440 570"
        stroke="url(#wave3)"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 4, ease: "easeInOut", delay: 1.0 }}
      />
      <defs>
        <linearGradient id="wave1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
        <linearGradient id="wave2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </linearGradient>
        <linearGradient id="wave3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const AnimatedDots = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const rows = 8;
  const cols = 14;
  const r = 2.5;
  const spacingX = 1440 / cols;
  const spacingY = 900 / rows;

  const dots = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col;
      const cx = col * spacingX + spacingX / 2;
      const cy = row * spacingY + spacingY / 2;
      dots.push(
        <motion.circle
          key={idx}
          cx={cx}
          cy={cy}
          r={r}
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 0.15, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, delay: idx * 0.008, ease: "easeOut" }}
        />
      );
    }
  }

  return (
    <div ref={ref} className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {dots}
      </svg>
    </div>
  );
};

export const AnimatedRings = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const rings = [
    { cx: 200, cy: 200, r: 60, delay: 0 },
    { cx: 200, cy: 200, r: 100, delay: 0.3 },
    { cx: 200, cy: 200, r: 140, delay: 0.6 },
  ];

  return (
    <div ref={ref} className="absolute top-1/4 right-[10%] pointer-events-none">
      <svg width="300" height="300" viewBox="0 0 300 300" fill="none">
        {rings.map((ring, i) => (
          <motion.circle
            key={i}
            cx={ring.cx}
            cy={ring.cy}
            r={ring.r}
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0, scale: 0.8 }}
            animate={
              inView
                ? { pathLength: 1, opacity: 0.12, scale: 1 }
                : { pathLength: 0, opacity: 0, scale: 0.8 }
            }
            transition={{ duration: 2, delay: ring.delay, ease: "easeInOut" }}
          />
        ))}
        <motion.circle
          cx={200}
          cy={200}
          r={4}
          fill="hsl(var(--primary))"
          initial={{ opacity: 0, scale: 0 }}
          animate={inView ? { opacity: 0.3, scale: 1 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        />
      </svg>
    </div>
  );
};

export const AnimatedCodeLines = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const lines = [
    { y: 20, width: 120, delay: 0 },
    { y: 44, width: 180, delay: 0.15 },
    { y: 68, width: 100, delay: 0.3 },
    { y: 92, width: 160, delay: 0.45 },
    { y: 116, width: 80, delay: 0.6 },
  ];

  return (
    <div ref={ref} className="absolute bottom-[10%] left-[5%] pointer-events-none">
      <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
        {lines.map((line, i) => (
          <motion.rect
            key={i}
            x={20}
            y={line.y}
            width={line.width}
            height={6}
            rx={3}
            fill="hsl(var(--primary))"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 0.12 } : { scaleX: 0, opacity: 0 }}
            style={{ originX: 0 }}
            transition={{ duration: 1, delay: line.delay, ease: "easeOut" }}
          />
        ))}
        <motion.rect
          x={20}
          y={8}
          width={40}
          height={6}
          rx={3}
          fill="hsl(var(--accent))"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={inView ? { scaleX: 1, opacity: 0.2 } : { scaleX: 0, opacity: 0 }}
          style={{ originX: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
};

export const AnimatedGeometricShapes = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.04]">
      {/* Using CSS keyframes via motion.div for GPU-composited transforms */}
      <motion.div
        className="absolute top-[7%] left-[7%] w-28 h-28"
        style={{ willChange: "transform" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 120 100" className="w-full h-full" fill="none">
          <polygon
            points="60,10 110,40 90,95 30,95 10,40"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[22%] right-[8%] w-28 h-28"
        style={{ willChange: "transform" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 120 100" className="w-full h-full" fill="none">
          <polygon
            points="60,10 110,40 90,95 30,95 10,40"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[20%] left-[6%] w-16 h-16"
        style={{ willChange: "transform" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 50 50" className="w-full h-full" fill="none">
          <rect
            x="2"
            y="2"
            width="46"
            height="46"
            rx="4"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-[25%] right-[5%] w-20 h-20"
        style={{ willChange: "transform" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 80 100" className="w-full h-full" fill="none">
          <polygon
            points="40,10 75,40 65,80 15,80 5,40"
            stroke="hsl(var(--accent))"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </motion.div>

      {/* Concentric circles */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px]"
        style={{ willChange: "transform" }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
          <circle
            cx="200"
            cy="200"
            r="180"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            fill="none"
          />
          <circle
            cx="200"
            cy="200"
            r="230"
            stroke="hsl(var(--accent))"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </motion.div>
    </div>
  );
};
