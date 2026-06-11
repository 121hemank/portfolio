import { motion } from "framer-motion";

export const TextReveal = ({
  text,
  className = "",
  as = "h2",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  delay?: number;
}) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: delay },
    },
  };

  const wordItem = {
    hidden: { opacity: 0, y: 20, rotateX: -20 },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const Tag = motion[as as keyof typeof motion] as any;
  const MotionTag = Tag || motion.h2;

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.35 }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={wordItem}
          className="inline-block"
          style={{ perspective: 600 }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
};

export const CharReveal = ({
  text,
  className = "",
  as = "h2",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  delay?: number;
}) => {
  const chars = text.split("");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.02, delayChildren: delay },
    },
  };

  const charItem = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  const Tag = motion[as as keyof typeof motion] as any;
  const MotionTag = Tag || motion.h2;

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.35 }}
    >
      {chars.map((char, i) => (
        <motion.span key={i} variants={charItem} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </MotionTag>
  );
};
