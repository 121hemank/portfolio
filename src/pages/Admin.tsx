import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LogOut,
  User,
  Code,
  Briefcase,
  GraduationCap,
  Award,
  FolderKanban,
  MessageSquare,
  Trophy,
  Home,
  Shield,
} from "lucide-react";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { SkillsEditor } from "@/components/admin/SkillsEditor";
import { ProjectsEditor } from "@/components/admin/ProjectsEditor";
import { ExperienceEditor } from "@/components/admin/ExperienceEditor";
import { EducationEditor } from "@/components/admin/EducationEditor";
import { CertificationsEditor } from "@/components/admin/CertificationsEditor";
import { AchievementsEditor } from "@/components/admin/AchievementsEditor";
import { MessagesViewer } from "@/components/admin/MessagesViewer";

const Admin = () => {
  const { user, isAdmin, loading, adminChecked, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    // Redirect to auth if not logged in
    if (!loading && adminChecked && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, adminChecked, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Full-screen loading overlay that completely blocks any UI until verification is complete
  if (loading || !adminChecked) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 rounded-2xl bg-card max-w-md"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <User className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You need admin privileges to access this page. The first user to sign up becomes the admin.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/")} variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
            <Button onClick={handleSignOut} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card border-b">
        <div className="container-wide flex items-center justify-between py-4 px-4 md:px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-display font-bold gradient-text">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate("/")} variant="outline" size="sm">
              <Home className="mr-2 h-4 w-4" />
              View Site
            </Button>
            <Button onClick={handleSignOut} variant="ghost" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-wide py-8 px-4 md:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap gap-2 h-auto bg-transparent p-0">
            <TabsTrigger value="profile" className="data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground">
              <Code className="mr-2 h-4 w-4" />
              Skills
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground">
              <FolderKanban className="mr-2 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="experience" className="data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground">
              <Briefcase className="mr-2 h-4 w-4" />
              Experience
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground">
              <GraduationCap className="mr-2 h-4 w-4" />
              Education
            </TabsTrigger>
            <TabsTrigger value="certifications" className="data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground">
              <Award className="mr-2 h-4 w-4" />
              Certifications
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground">
              <Trophy className="mr-2 h-4 w-4" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:gradient-bg data-[state=active]:text-primary-foreground">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileEditor />
          </TabsContent>
          <TabsContent value="skills">
            <SkillsEditor />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsEditor />
          </TabsContent>
          <TabsContent value="experience">
            <ExperienceEditor />
          </TabsContent>
          <TabsContent value="education">
            <EducationEditor />
          </TabsContent>
          <TabsContent value="certifications">
            <CertificationsEditor />
          </TabsContent>
          <TabsContent value="achievements">
            <AchievementsEditor />
          </TabsContent>
          <TabsContent value="messages">
            <MessagesViewer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
