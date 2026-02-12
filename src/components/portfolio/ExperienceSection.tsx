import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { useExperience } from "@/hooks/usePortfolioData";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export const ExperienceSection = () => {
  const { data: experience, isLoading } = useExperience();

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return format(new Date(date), "MMM yyyy");
  };

  return (
    <section id="experience" className="section-padding relative">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Career <span className="gradient-text">Journey</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Roles, responsibilities, and milestones along my professional path
          </p>
        </motion.div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">
            Loading experience...
          </div>
        ) : (
          <div className="relative max-w-5xl mx-auto">
            {/* Vertical timeline */}
            <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-accent to-secondary md:-translate-x-1/2" />

            {experience?.map((exp, index) => {
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.12 }}
                  className={`relative flex mb-16 ${
                    isLeft ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-5 md:left-1/2 top-6 w-4 h-4 rounded-full gradient-bg ring-4 ring-background md:-translate-x-1/2 z-10 animate-pulse" />

                  {/* Card */}
                  <motion.div
                    whileHover={{ y: -6 }}
                    className={`ml-12 md:ml-0 md:w-[45%] ${
                      isLeft ? "md:pr-12" : "md:pl-12"
                    }`}
                  >
                    <div className="relative p-7 rounded-3xl bg-card backdrop-blur-xl border border-white/10 shadow-xl hover:shadow-2xl transition-all">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(exp.start_date)} —{" "}
                          {exp.is_current
                            ? "Present"
                            : formatDate(exp.end_date)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-display font-semibold mb-1">
                        {exp.position}
                      </h3>

                      {/* Company */}
                      <div className="flex items-center gap-2 text-primary mb-3">
                        <Briefcase className="w-4 h-4" />
                        <span className="font-medium">{exp.company}</span>
                      </div>

                      {exp.is_current && (
                        <Badge className="gradient-bg mb-4 inline-block">
                          Current Role
                        </Badge>
                      )}

                      {/* Description */}
                      <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      {exp.achievements?.length > 0 && (
                        <ul className="space-y-2">
                          {exp.achievements.map((item, i) => (
                            <li
                              key={i}
                              className="flex gap-3 text-sm leading-snug"
                            >
                              <span className="w-2 h-2 mt-2 rounded-full gradient-bg flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
