import { motion, useMotionValue, useSpring } from "framer-motion";
import { Download, Github, Linkedin, Twitter, Instagram, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/usePortfolioData";
import { AnimatedCounter } from "./AnimatedCounter";
import { HeroBackgroundCanvas } from "./HeroBackgroundCanvas";
import { AnimatedGeometricShapes } from "./MotionSVG";
import { MagneticButton } from "./MagneticButton";

export const HeroSection = () => {
  const { data: profile, isLoading } = useProfile();

  /* ---------------- 3D TILT (CONTENT) ---------------- */
  const contentRX = useMotionValue(0);
  const contentRY = useMotionValue(0);
  const contentX = useSpring(contentRX, { stiffness: 180, damping: 22 });
  const contentY = useSpring(contentRY, { stiffness: 180, damping: 22 });

  const onContentMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const dx = px - r.width / 2;
    const dy = py - r.height / 2;
    contentRX.set(-(dy / r.height) * 10);
    contentRY.set((dx / r.width) * 10);
  };

  const resetContent = () => {
    contentRX.set(0);
    contentRY.set(0);
  };

  /* ---------------- 3D TILT (IMAGE) ---------------- */
  const imgRX = useMotionValue(0);
  const imgRY = useMotionValue(0);
  const imgX = useSpring(imgRX, { stiffness: 180, damping: 22 });
  const imgY = useSpring(imgRY, { stiffness: 180, damping: 22 });

  const onImgMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    const dx = px - r.width / 2;
    const dy = py - r.height / 2;
    imgRX.set(-(dy / r.height) * 12);
    imgRY.set((dx / r.width) * 12);
  };

  const resetImg = () => {
    imgRX.set(0);
    imgRY.set(0);
  };

  /* ---------------- ANIMATION VARIANTS ---------------- */
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.12 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
  };

  if (isLoading) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-lg">Loading...</div>
      </section>
    );
  }

  return (
    <section id="home" className="min-h-screen flex items-center relative overflow-hidden">
      {/* ================= POINTER PARALLAX BACKGROUND ================= */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HeroBackgroundCanvas className="w-full h-full" />
        <AnimatedGeometricShapes />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/25" />
      </div>

      {/* Floating decorative orbs to fill empty space */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -22, 0], opacity: [0.12, 0.28, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-48 h-48 md:w-72 md:h-72 rounded-full bg-primary/10 blur-[80px] md:blur-[120px]"
          style={{ willChange: "transform" }}
        />
        <motion.div
          animate={{ y: [0, -18, 0], opacity: [0.08, 0.22, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="hidden md:block absolute top-20 right-12 w-56 h-56 rounded-full bg-accent/10 blur-[100px]"
          style={{ willChange: "transform" }}
        />
        <motion.div
          animate={{ x: [0, 18, 0], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-32 left-8 md:bottom-40 md:left-16 w-44 h-44 md:w-64 md:h-64 rounded-full bg-purple-500/10 blur-[70px] md:blur-[110px]"
          style={{ willChange: "transform" }}
        />
        <motion.div
          animate={{ x: [0, -20, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="hidden md:block absolute bottom-32 right-20 w-48 h-48 rounded-full bg-primary/10 blur-[90px]"
          style={{ willChange: "transform" }}
        />

        {/* Small floating dots */}
        <motion.div
          animate={{ y: [0, -12, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-1/4 right-[15%] w-2 h-2 rounded-full bg-primary/30"
          style={{ willChange: "transform" }}
        />
        <motion.div
          animate={{ y: [0, -10, 0], scale: [1, 1.4, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[60%] left-[10%] w-1.5 h-1.5 rounded-full bg-accent/30"
          style={{ willChange: "transform" }}
        />
        <motion.div
          animate={{ y: [0, -14, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 3.5 }}
          className="absolute bottom-[25%] right-[12%] w-2 h-2 rounded-full bg-purple-400/25"
          style={{ willChange: "transform" }}
        />
      </div>

      <div className="container-wide py-10 md:py-28 px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-20 items-center">
          {/* IMAGE (mobile top, desktop right) */}
          <div className="order-1 lg:order-2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="perspective-1200"
            >
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
                style={{ willChange: "transform" }}
              >
                <motion.div
                  onMouseMove={onImgMove}
                  onMouseLeave={resetImg}
                  style={{ rotateX: imgX, rotateY: imgY, transformStyle: "preserve-3d" }}
                  className="relative rounded-full"
                >
                  <div className="absolute left-1/2 top-[105%] -translate-x-1/2 w-[78%] h-10 bg-black/35 blur-2xl rounded-full" />
                  <div className="absolute inset-0 gradient-bg rounded-full blur-2xl opacity-20 animate-pulse-glow" />

                  <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-primary/25 bg-card shadow-2xl">
                    {profile?.profile_image_url ? (
                      <img
                        src={profile.profile_image_url}
                        alt={profile.name || "Profile"}
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full gradient-bg flex items-center justify-center text-6xl font-bold text-primary-foreground">
                        {profile?.name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* CONTENT */}
          <div className="order-2 lg:order-1 perspective-1200">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              onMouseMove={onContentMove}
              onMouseLeave={resetContent}
              style={{ rotateX: contentX, rotateY: contentY, transformStyle: "preserve-3d" }}
              className="relative rounded-2xl p-5 md:p-8 overflow-hidden
                         backdrop-blur-xl bg-background/55
                         border border-white/10 shadow-[0_40px_90px_-35px_rgba(0,0,0,0.65)]"
            >
              <motion.div
                className="pointer-events-none absolute -inset-[2px] rounded-2xl opacity-50"
                style={{
                  background:
                    "conic-gradient(from 0deg, rgba(99,102,241,0.0), rgba(99,102,241,0.35), rgba(236,72,153,0.35), rgba(99,102,241,0.0))",
                  willChange: "transform",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-[1px] rounded-2xl bg-background/60 backdrop-blur-xl" />

              <div className="relative" style={{ transform: "translateZ(24px)" }}>
                <motion.p variants={item} className="text-sm sm:text-lg text-muted-foreground mb-3 md:mb-4">
                  Welcome to my portfolio
                </motion.p>

                <motion.h1
                  variants={item}
                  className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-extrabold mb-6 leading-tight"
                >
                  Hi, I&apos;m{" "}
                  <span className="gradient-text drop-shadow-lg">
                    {profile?.name || "Developer"}
                  </span>
                </motion.h1>

                <motion.p variants={item} className="text-base sm:text-xl md:text-2xl text-muted-foreground mb-3 md:mb-4">
                  {profile?.title || "Full Stack Developer"}
                </motion.p>

                <motion.p variants={item} className="text-sm sm:text-lg text-foreground/85 mb-6 md:mb-8 max-w-lg">
                  {profile?.bio}
                </motion.p>

                <motion.div variants={item} className="flex flex-wrap gap-3 md:gap-4 mb-6 md:mb-10">
                  {profile?.cv_url && (
                    <MagneticButton>
                      <Button
                        asChild
                        size="default"
                        className="gradient-bg hover:scale-105 transition-all duration-300 shadow-lg"
                      >
                        <a href={profile.cv_url} download>
                          <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                          Download CV
                        </a>
                      </Button>
                    </MagneticButton>
                  )}

                  <MagneticButton>
                    <Button
                      variant="outline"
                      size="default"
                      className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                      onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Let&apos;s Talk
                    </Button>
                  </MagneticButton>
                </motion.div>

                <motion.div variants={item} className="flex gap-3 md:gap-4">
                  {profile?.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 md:p-3 rounded-full bg-card/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Github className="h-4 w-4 md:h-5 md:w-5" />
                    </a>
                  )}
                  {profile?.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 md:p-3 rounded-full bg-card/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
                    </a>
                  )}
                  {profile?.twitter_url && (
                    <a
                      href={profile.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 md:p-3 rounded-full bg-card/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Twitter className="h-4 w-4 md:h-5 md:w-5" />
                    </a>
                  )}
                  {profile?.instagram_url && (
                    <a
                      href={profile.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 md:p-3 rounded-full bg-card/80 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Instagram className="h-4 w-4 md:h-5 md:w-5" />
                    </a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="grid grid-cols-3 gap-2 md:gap-8 mt-8 md:mt-24"
        >
          <div className="stat-card text-center backdrop-blur-lg bg-card/60 rounded-xl p-4 md:p-6 border border-white/10 hover:scale-105 transition-transform">
            <AnimatedCounter end={profile?.years_experience || 0} duration={2} />
            <p className="text-muted-foreground mt-2 text-sm md:text-base">Years Experience</p>
          </div>

          <div className="stat-card text-center backdrop-blur-lg bg-card/60 rounded-xl p-4 md:p-6 border border-white/10 hover:scale-105 transition-transform">
            <AnimatedCounter end={profile?.projects_completed || 0} duration={2} />
            <p className="text-muted-foreground mt-2 text-sm md:text-base">Projects Completed</p>
          </div>

          <div className="stat-card text-center backdrop-blur-lg bg-card/60 rounded-xl p-4 md:p-6 border border-white/10 hover:scale-105 transition-transform">
            <AnimatedCounter end={profile?.technologies_mastered || 0} duration={2} />
            <p className="text-muted-foreground mt-2 text-sm md:text-base">Technologies</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <motion.span
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="hidden md:block text-[10px] text-muted-foreground/40 uppercase tracking-[0.22em] font-medium"
        >
          Scroll
        </motion.span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ willChange: "transform" }}
        >
          <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground/30" />
        </motion.div>
      </motion.div>
    </section>
  );
};
