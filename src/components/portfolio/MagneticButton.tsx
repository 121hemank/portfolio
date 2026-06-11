import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

export const MagneticButton = ({
  children,
  asChild,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 250, damping: 15 });
  const springY = useSpring(y, { stiffness: 250, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const dx = px - r.width / 2;
    const dy = py - r.height / 2;
    x.set(dx * 0.25);
    y.set(dy * 0.25);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: springX, y: springY }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
