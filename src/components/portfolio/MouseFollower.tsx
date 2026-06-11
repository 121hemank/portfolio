import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export const MouseFollower = () => {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const springX = useSpring(mx, { stiffness: 80, damping: 25 });
  const springY = useSpring(my, { stiffness: 80, damping: 25 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{ background: "transparent" }}
    >
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, hsl(var(--primary)/0.06) 0%, transparent 70%)",
          willChange: "transform",
        }}
      />
    </motion.div>
  );
};
