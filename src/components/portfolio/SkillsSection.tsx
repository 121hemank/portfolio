import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMemo } from "react";
import { useSkills } from "@/hooks/usePortfolioData";

export const SkillsSection = () => {
  const { data: skills, isLoading } = useSkills();

  const groupedSkills = useMemo(() => {
    return skills?.reduce((acc, skill) => {
      const category = skill.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {} as Record<string, typeof skills>);
  }, [skills]);

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Minimal premium background */}
      <div className="absolute inset-0 bg-muted/20" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.5] bg-[radial-gradient(800px_circle_at_20%_20%,hsl(var(--primary)/0.10),transparent_55%),radial-gradient(900px_circle_at_85%_70%,hsl(var(--accent)/0.08),transparent_60%)]" />

      <div className="container-wide relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-3">
            Technical <span className="gradient-text">Skills</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A modern toolkit — focused, scalable, and production-ready.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading skills...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
            {Object.entries(groupedSkills || {}).map(([category, categorySkills], i) => (
              <div key={category} className="perspective-1200">
                <SkillCategoryCard
                  category={category}
                  skills={categorySkills as any[]}
                  delay={i * 0.06}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ================== CATEGORY CARD ================== */

const SkillCategoryCard = ({
  category,
  skills,
  delay,
}: {
  category: string;
  skills: any[];
  delay: number;
}) => {
  // Hero-like tilt (correct)
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rX = useSpring(rx, { stiffness: 180, damping: 22 });
  const rY = useSpring(ry, { stiffness: 180, damping: 22 });

  // Cursor spotlight
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const dx = px - r.width / 2;
    const dy = py - r.height / 2;

    // ✅ same as your Hero intro card
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
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ delay, duration: 0.55, ease: "easeOut" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" }}
      className="
        group relative overflow-hidden rounded-2xl
        bg-card/55 backdrop-blur-xl
        border border-white/10
        shadow-[0_14px_45px_-20px_rgba(0,0,0,0.55)]
        hover:shadow-[0_26px_70px_-24px_rgba(0,0,0,0.75)]
        transition-shadow
      "
    >
      {/* Border “sheen” (subtle) */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.18), transparent 55%)",
        }}
        animate={{ x: ["-140%", "140%"] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Cursor spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx) var(--my), rgba(255,255,255,0.12), transparent 55%)",
          // @ts-ignore
          "--mx": mx,
          // @ts-ignore
          "--my": my,
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8" style={{ transform: "translateZ(20px)" }}>
        {/* Category header row */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="min-w-0">
            <h3 className="text-xl md:text-2xl font-display font-semibold tracking-tight truncate">
              {category}
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground mt-1 truncate">
              {skills.length} skills
            </p>
          </div>

          {/* count pill */}
          <div className="shrink-0 rounded-full px-3 py-1 text-xs border border-white/10 bg-background/40 backdrop-blur-md text-foreground/80">
            {skills.length}
          </div>
        </div>

        {/* Skill list */}
        <div className="space-y-6">
          {skills.map((skill, i) => (
            <SkillRow key={skill.id ?? `${skill.name}-${i}`} skill={skill} index={i} />
          ))}
        </div>
      </div>

      {/* Hover-only soft glow on edges */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -inset-10 bg-[radial-gradient(closest-side,rgba(99,102,241,0.10),transparent_65%)]" />
      </div>
    </motion.div>
  );
};

/* ================== ROW ================== */

const SkillRow = ({ skill, index }: { skill: any; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.6 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.03 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-end">
        <span className="text-sm md:text-base font-medium text-foreground/90">
          {skill.name}
        </span>
        <span className="text-xs md:text-sm text-muted-foreground tabular-nums">
          {skill.level}%
        </span>
      </div>

      {/* Minimal track + fill */}
      <div className="h-[6px] rounded-full bg-foreground/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--gradient-start)), hsl(var(--gradient-mid)), hsl(var(--gradient-end)))",
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: false, amount: 0.6 }}
          transition={{ duration: 1.05, ease: "easeOut", delay: index * 0.05 }}
        />
      </div>
    </motion.div>
  );
};
