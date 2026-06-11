import { useEffect, useRef } from "react";

export const LenisSmoothScroll = () => {
  const destroyedRef = useRef(false);

  useEffect(() => {
    let rafId: number;
    let lenis: any;
    destroyedRef.current = false;

    const init = async () => {
      try {
        const mod = await import("@studio-freight/lenis");
        const Lenis = mod.default || mod.Lenis;
        if (destroyedRef.current) return;
        lenis = new Lenis({
          duration: 1.3,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: "vertical",
          smoothWheel: true,
        });

        const raf = (time: number) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
      } catch {
        // silently fall back to native scroll
      }
    };

    init();

    return () => {
      destroyedRef.current = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    };
  }, []);

  return null;
};
