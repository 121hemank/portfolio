import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const ScrollScenes = () => {
  useLayoutEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) return;

    const ctx = gsap.context(() => {
      const wraps = gsap.utils.toArray<HTMLElement>("[data-scene].scene-wrap");

      wraps.forEach((wrap) => {
        const scene = wrap.querySelector<HTMLElement>(".scene");
        if (!scene) return;

        // Reset baseline (prevents "keeps zooming forever")
        gsap.set(scene, {
          clearProps: "transform,filter",
          transformPerspective: 1600,
          transformOrigin: "50% 50%",
          willChange: "transform, filter",
        });

        // Timeline: enter -> hold -> exit (scrubbed)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: "+=120%",              // IMPORTANT: short pin distance
            scrub: 0.8,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // ENTER
        tl.fromTo(
          scene,
          {
            opacity: 0,
            y: 90,
            rotateX: 18,
            rotateY: -10,
            z: -220,
            scale: 0.94,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            rotateY: 0,
            z: 0,
            scale: 1,
            filter: "blur(0px)",
            ease: "power3.out",
            duration: 0.45,
          }
        );

        // HOLD (stops the “continuous zoom” feeling)
        tl.to(scene, { duration: 0.25 });

        // EXIT (slight, not destructive)
        tl.to(scene, {
          y: -60,
          rotateX: -10,
          z: -140,
          scale: 0.98,
          filter: "blur(3px)",
          ease: "power2.inOut",
          duration: 0.45,
        });
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return null;
};
