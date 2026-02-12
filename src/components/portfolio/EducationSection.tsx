import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { GraduationCap, Award, ExternalLink } from "lucide-react";
import { useEducation, useCertifications } from "@/hooks/usePortfolioData";
import { format } from "date-fns";
import { useMemo } from "react";

export const EducationSection = () => {
  const { data: education } = useEducation();
  const { data: certifications } = useCertifications();

  const edu = useMemo(() => education || [], [education]);
  const certs = useMemo(() => certifications || [], [certifications]);

  // Subtle scroll parallax for background objects
  const { scrollY } = useScroll();
  const orbY1 = useTransform(scrollY, [0, 1200], [0, 80]);
  const orbY2 = useTransform(scrollY, [0, 1200], [0, -70]);
  const prismY1 = useTransform(scrollY, [0, 1200], [0, 60]);
  const prismY2 = useTransform(scrollY, [0, 1200], [0, -55]);

  return (
    <section className="section-padding relative overflow-hidden bg-muted/30">
      {/* ===== Subtle 3D Objects Background ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft wash */}
        <div className="absolute inset-0 opacity-70 bg-[radial-gradient(800px_circle_at_20%_20%,hsl(var(--primary)/0.10),transparent_55%),radial-gradient(900px_circle_at_85%_70%,hsl(var(--accent)/0.08),transparent_60%)]" />

        {/* 3D Orbs */}
        <FloatingOrb
          className="left-[-140px] top-[10%] w-[380px] h-[380px]"
          delay={0}
          y={orbY1}
        />
        <FloatingOrb
          className="right-[-190px] top-[40%] w-[480px] h-[480px]"
          delay={0.2}
          y={orbY2}
        />

        {/* 3D Prisms */}
        <FloatingPrism className="left-[8%] bottom-[12%]" delay={0.1} y={prismY1} />
        <FloatingPrism className="right-[10%] bottom-[18%]" delay={0.35} y={prismY2} />

        {/* Fine grain */}
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="container-wide relative z-10">
        {/* ================= EDUCATION ================= */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold flex justify-center items-center gap-3">
            <GraduationCap className="w-9 h-9 text-primary" />
            <span className="gradient-text">Education</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-3 max-w-2xl mx-auto">
            Strong foundations + continuous learning.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-24">
          {edu.map((item, index) => (
            <TiltGlassCard key={item.id} delay={index * 0.06} className="p-6">
              <div style={{ transform: "translateZ(28px)" }}>
                <h4 className="text-lg font-semibold text-foreground mb-1">
                  {item.degree}
                </h4>
                <p className="text-primary font-medium text-sm">
                  {item.institution}
                </p>

                {item.field && (
                  <p className="text-muted-foreground text-sm mt-1">
                    {item.field}
                  </p>
                )}

                <p className="text-xs text-muted-foreground mt-3">
                  {item.start_date && format(new Date(item.start_date), "yyyy")} –{" "}
                  {item.end_date ? format(new Date(item.end_date), "yyyy") : "Present"}
                </p>
              </div>
            </TiltGlassCard>
          ))}
        </div>

        {/* ================= CERTIFICATIONS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold flex justify-center items-center gap-3">
            <Award className="w-9 h-9 text-primary" />
            <span className="gradient-text">Certifications</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-3 max-w-2xl mx-auto">
            Verified skills and professional credentials.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {certs.map((cert, index) => (
            <TiltGlassCard
              key={cert.id}
              delay={index * 0.05}
              className="overflow-hidden p-0"
            >
              {cert.image_url ? (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={cert.image_url}
                    alt={cert.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />

                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/55 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    >
                      <span className="text-white text-sm font-medium flex items-center gap-2">
                        View Credential <ExternalLink className="w-4 h-4" />
                      </span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] flex items-center justify-center bg-muted/50">
                  <Award className="w-10 h-10 text-primary" />
                </div>
              )}

              <div className="p-4" style={{ transform: "translateZ(20px)" }}>
                <h4 className="text-sm font-semibold text-foreground line-clamp-2">
                  {cert.name}
                </h4>
                <p className="text-primary text-xs font-medium mt-1">{cert.issuer}</p>
                {cert.issue_date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(cert.issue_date), "MMM yyyy")}
                  </p>
                )}
              </div>
            </TiltGlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ====================== 3D OBJECTS ====================== */

const FloatingOrb = ({
  className = "",
  delay = 0,
  y,
}: {
  className?: string;
  delay?: number;
  y?: any;
}) => {
  return (
    <motion.div className={`absolute ${className}`} style={{ y }}>
      <motion.div
        className="w-full h-full rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, hsl(var(--primary)/0.55), transparent 60%)",
        }}
        animate={{ x: [0, 28, 0], y: [0, 16, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay }}
      />
    </motion.div>
  );
};

const FloatingPrism = ({
  className = "",
  delay = 0,
  y,
}: {
  className?: string;
  delay?: number;
  y?: any;
}) => {
  return (
    <motion.div
      className={`absolute ${className} hidden md:block`}
      style={{ perspective: 1200, y }}
    >
      <motion.div
        className="w-44 h-44 rounded-2xl opacity-[0.22] blur-[0.5px]"
        style={{
          background:
            "conic-gradient(from 0deg, hsl(var(--gradient-start)/0.55), hsl(var(--gradient-mid)/0.45), hsl(var(--gradient-end)/0.50), hsl(var(--gradient-start)/0.55))",
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateX: [18, 26, 18],
          rotateY: [-16, -28, -16],
          y: [0, -10, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay }}
      />
    </motion.div>
  );
};

/* ====================== HERO-LIKE TILT + JUMP-OUT CARD ====================== */

const TiltGlassCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  // ✅ Exact Hero tilt math
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rX = useSpring(rx, { stiffness: 180, damping: 22 });
  const rY = useSpring(ry, { stiffness: 180, damping: 22 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const dx = px - r.width / 2;
    const dy = py - r.height / 2;

    rx.set(-(dy / r.height) * 10);
    ry.set((dx / r.width) * 10);

    mx.set(px);
    my.set(py);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      // ✅ JUMP OUT OF PAGE on scroll
      initial={{ opacity: 0, y: 26, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.22 }}
      transition={{ delay, duration: 0.55, ease: "easeOut" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rX,
        rotateY: rY,
        transformStyle: "preserve-3d",
      }}
      className={[
        "group relative rounded-2xl",
        "bg-card/55 backdrop-blur-xl border border-white/10",
        "shadow-[0_14px_45px_-20px_rgba(0,0,0,0.55)]",
        "hover:shadow-[0_26px_70px_-24px_rgba(0,0,0,0.75)] transition-shadow",
        "overflow-hidden",
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
      <div className="absolute inset-[1px] rounded-[inherit] bg-card/55 backdrop-blur-xl" />

      {/* Cursor spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-[1px] rounded-[inherit] opacity-75"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx) var(--my), rgba(255,255,255,0.12), transparent 60%)",
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
        transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
