import { motion, useMotionValue, useSpring } from "framer-motion";
import { Sparkles, Target, Rocket } from "lucide-react";
import { useProfile } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";

export const AboutSection = () => {
  const { data: profile } = useProfile();

  const features = useMemo(
    () => [
      {
        icon: Sparkles,
        title: "Creative Solutions",
        description:
          "Transforming complex problems into elegant, user-friendly interfaces",
      },
      {
        icon: Target,
        title: "Goal-Oriented",
        description:
          "Focused on delivering measurable results and real business value",
      },
      {
        icon: Rocket,
        title: "Innovation Driven",
        description: "Continuously exploring new technologies and best practices",
      },
    ],
    []
  );

  return (
    <section
      id="about"
      className="section-padding bg-muted/30 relative overflow-hidden"
    >
      {/* Ambient soft glows */}
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-48 -right-40 w-[640px] h-[640px] bg-accent/10 rounded-full blur-3xl" />

      <div className="container-wide relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            About <span className="gradient-text">Me</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Passionate about crafting impactful digital experiences
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* About Text Card */}
          <div className="perspective-1200">
            <TiltCard className="p-8 md:p-10 rounded-3xl">
              <div style={{ transform: "translateZ(55px)" }}>
                <h3 className="text-2xl font-display font-semibold mb-6">
                  What I Do
                </h3>
              </div>

              <div style={{ transform: "translateZ(30px)" }}>
                <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                  {profile?.about_me ||
                    "I specialize in building modern web applications that blend beautiful design with powerful functionality. My focus is on delivering smooth user experiences with clean, scalable code."}
                </p>

                <p className="text-muted-foreground mb-8 leading-relaxed">
                  From idea to deployment, I take care of everything — responsive
                  layouts, scalable architecture, and performance-driven
                  solutions.
                </p>
              </div>

              <div style={{ transform: "translateZ(70px)" }}>
                <Button
                  size="lg"
                  className="gradient-bg hover:scale-105 transition-transform shadow-lg"
                  onClick={() =>
                    document
                      .querySelector("#contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Let’s Collaborate
                </Button>
              </div>
            </TiltCard>
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6">
            {features.map((feature, index) => (
              <div className="perspective-1200" key={feature.title}>
                <TiltCard
                  className="flex gap-4 p-6 rounded-2xl"
                  delay={index * 0.05}
                >
                  {/* Icon float */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl gradient-bg flex items-center justify-center"
                    style={{ transform: "translateZ(55px)" }}
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </motion.div>
                  </div>

                  <div style={{ transform: "translateZ(35px)" }}>
                    <h4 className="font-display font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ====================== REUSABLE TILT CARD ====================== */
const TiltCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  // ✅ EXACT HERO TILT
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rX = useSpring(rotateX, { stiffness: 180, damping: 22 });
  const rY = useSpring(rotateY, { stiffness: 180, damping: 22 });

  // cursor spotlight
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    const dx = px - rect.width / 2;
    const dy = py - rect.height / 2;

    // ✅ EXACT SAME AS HEROSECTION
    rotateX.set(-(dy / rect.height) * 10);
    rotateY.set((dx / rect.width) * 10);

    mx.set(px);
    my.set(py);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay, duration: 0.55, ease: "easeOut" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rX,
        rotateY: rY,
        transformStyle: "preserve-3d",
      }}
      className={[
        "relative overflow-hidden",
        "bg-card/70 backdrop-blur-xl border border-white/10",
        "shadow-[0_40px_90px_-35px_rgba(0,0,0,0.65)]",
        "hover:shadow-[0_60px_140px_-35px_rgba(0,0,0,0.85)] transition-shadow",
        className,
      ].join(" ")}
    >
      {/* Border light loop */}
      <motion.div
        className="pointer-events-none absolute -inset-[2px] rounded-[inherit] opacity-40"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(99,102,241,0.0), rgba(99,102,241,0.35), rgba(236,72,153,0.35), rgba(99,102,241,0.0))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-[1px] rounded-[inherit] bg-card/70 backdrop-blur-xl" />

      {/* Cursor spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-[1px] rounded-[inherit] opacity-70"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx) var(--my), rgba(255,255,255,0.14), transparent 60%)",
          // @ts-ignore
          "--mx": mx,
          // @ts-ignore
          "--my": my,
        }}
      />

      {/* Glass sweep */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          background:
            "linear-gradient(120deg, transparent 40%, rgba(255,255,255,0.35), transparent 60%)",
        }}
        animate={{ x: ["-120%", "120%"] }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
