import { useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  Send,
  Github,
  Linkedin,
  Clock,
  Instagram,
  Twitter,
  User,
  Mail,
  DollarSign,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProfile } from "@/hooks/usePortfolioData";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

/* ------------------ Validation ------------------ */
const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  project_details: z.string().min(1),
  budget: z.string().optional(),
});

/* Floating animation */
const floatAnim = {
  animate: { y: [0, -10, 0] },
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
};

export const ContactSection = () => {
  const { data: profile } = useProfile();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    project_details: "",
    budget: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast({
        title: "Invalid input",
        description: "Please check your form fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from("contact_messages")
      .insert([form])
      .select("id")
      .single();

    if (error || !data) {
      toast({
        title: "Error",
        description: "Message failed. Try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    await supabase.functions.invoke("send-contact-confirmation", {
      body: { message_id: data.id },
    });

    toast({
      title: "Message sent 🚀",
      description: "I’ll get back to you shortly!",
    });

    setForm({ name: "", email: "", project_details: "", budget: "" });
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* subtle ambient glows (matches your other sections) */}
      <div className="absolute -top-40 -left-40 w-[520px] h-[520px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-48 -right-40 w-[640px] h-[640px] bg-accent/10 rounded-full blur-3xl" />

      <div className="container-wide relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-display font-bold mb-4">
            Let’s Build <span className="gradient-text">Something Great</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Tell me about your idea and I’ll handle the rest.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 max-w-6xl mx-auto">
          {/* CONTACT FORM */}
          <TiltGlassCard as="form" onSubmit={handleSubmit} floating className="p-8 rounded-3xl">
            <div style={{ transform: "translateZ(28px)" }} className="space-y-6">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="pl-12 h-12"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="pl-12 h-12"
                />
              </div>

              {/* Message */}
              <div className="relative">
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                <Textarea
                  rows={5}
                  placeholder="Describe your project..."
                  value={form.project_details}
                  onChange={(e) =>
                    setForm({ ...form, project_details: e.target.value })
                  }
                  className="pl-12 pt-4"
                />
              </div>

              {/* Budget */}
              <div className="relative">
                <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Budget (optional)"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="pl-12 h-12"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full gradient-bg text-lg hover:scale-[1.02] transition-transform"
              >
                <Send className="mr-2 w-5 h-5" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </TiltGlassCard>

          {/* INFO COLUMN */}
          <div className="flex flex-col justify-center gap-8">
            {/* Response Time (same treatment) */}
            <TiltGlassCard className="p-6 rounded-2xl">
              <div
                className="flex items-center gap-4"
                style={{ transform: "translateZ(24px)" }}
              >
                <div className="w-12 h-12 rounded-xl bg-card/70 border border-white/10 flex items-center justify-center">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Response Time</p>
                  <p className="text-muted-foreground">
                    {profile?.response_time || "Within 24 hours"}
                  </p>
                </div>
              </div>
            </TiltGlassCard>

            {/* Socials (leave as-is but slightly nicer hover) */}
            <div className="flex gap-4">
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-card/70 border border-white/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-card/70 border border-white/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {profile?.instagram_url && (
                <a
                  href={profile.instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-card/70 border border-white/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {profile?.twitter_url && (
                <a
                  href={profile.twitter_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-card/70 border border-white/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ====================== HERO-STYLE TILT GLASS CARD ====================== */

type TiltGlassCardProps =
  | ({
      as?: "div";
      onSubmit?: never;
      children: React.ReactNode;
      className?: string;
      floating?: boolean;
    } & React.HTMLAttributes<HTMLDivElement>)
  | ({
      as: "form";
      onSubmit: (e: React.FormEvent) => void;
      children: React.ReactNode;
      className?: string;
      floating?: boolean;
    } & React.FormHTMLAttributes<HTMLFormElement>);

const TiltGlassCard = (props: TiltGlassCardProps) => {
  const { as = "div", children, className = "", floating = false, ...rest } = props as any;

  // ✅ EXACT same math as your Hero intro card
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rX = useSpring(rx, { stiffness: 180, damping: 22 });
  const rY = useSpring(ry, { stiffness: 180, damping: 22 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
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

  const CardTag: any = motion[as];

  return (
    <CardTag
      {...(floating ? floatAnim : {})}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rX,
        rotateY: rY,
        transformStyle: "preserve-3d",
      }}
      className={[
        "relative overflow-hidden will-change-transform",
        "bg-card/55 backdrop-blur-xl border border-white/10",
        "shadow-[0_40px_90px_-35px_rgba(0,0,0,0.65)]",
        "hover:shadow-[0_60px_140px_-35px_rgba(0,0,0,0.85)] transition-shadow",
        className,
      ].join(" ")}
      {...rest}
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

      {/* Glass sweep (subtle continuous) */}
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
    </CardTag>
  );
};
