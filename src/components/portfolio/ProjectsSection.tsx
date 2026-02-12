import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/usePortfolioData";

export const ProjectsSection = () => {
  const { data: projects, isLoading } = useProjects();
  const [filter, setFilter] = useState<string>("All");

  const categories = [
    "All",
    ...new Set(
      projects?.map((p) => p.category).filter(Boolean) as string[]
    ),
  ];

  const filteredProjects = projects?.filter(
    (project) => filter === "All" || project.category === filter
  );

  return (
    <section
      id="projects"
      className="section-padding bg-muted/30 relative overflow-hidden"
    >
      <div className="container-wide">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A selection of my recent work, experiments, and side projects
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={filter === category ? "default" : "outline"}
              onClick={() => setFilter(category)}
              className={
                filter === category
                  ? "gradient-bg shadow-md"
                  : "hover:bg-muted"
              }
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center text-muted-foreground">
            Loading projects...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects?.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group rounded-2xl overflow-hidden backdrop-blur-xl bg-card/60 border border-white/10 shadow-lg hover:shadow-2xl transition-all"
                >
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full gradient-bg opacity-30 flex items-center justify-center">
                        <Folder className="w-16 h-16 text-primary/60" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-all hover:scale-110"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>

                    {project.featured && (
                      <Badge className="absolute top-4 left-4 gradient-bg shadow">
                        Featured
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-display font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack?.slice(0, 4).map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {(project.tech_stack?.length || 0) > 4 && (
                        <Badge variant="secondary" className="text-xs">
                          +{(project.tech_stack?.length || 0) - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
