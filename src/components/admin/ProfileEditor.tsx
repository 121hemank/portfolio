import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/usePortfolioData";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Loader2, Upload, Image, FileText } from "lucide-react";
import { getSaveErrorMessage } from "@/lib/errorUtils";
import { profileSchema, getValidationErrors } from "@/lib/validationSchemas";

export const ProfileEditor = () => {
  const { data: profile, isLoading } = useProfile();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { uploadFile, uploading } = useFileUpload();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const imageInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    about_me: "",
    years_experience: 0,
    projects_completed: 0,
    technologies_mastered: 0,
    profile_image_url: "",
    cv_url: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    instagram_url: "",
    response_time: "",
  });

  // Update form when profile loads
  if (profile && form.name === "" && profile.name) {
    setForm({
      name: profile.name || "",
      title: profile.title || "",
      bio: profile.bio || "",
      about_me: profile.about_me || "",
      years_experience: profile.years_experience || 0,
      projects_completed: profile.projects_completed || 0,
      technologies_mastered: profile.technologies_mastered || 0,
      profile_image_url: profile.profile_image_url || "",
      cv_url: profile.cv_url || "",
      github_url: profile.github_url || "",
      linkedin_url: profile.linkedin_url || "",
      twitter_url: profile.twitter_url || "",
      instagram_url: (profile as any).instagram_url || "",
      response_time: profile.response_time || "",
    });
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }
    
    const url = await uploadFile(file, "profile");
    if (url) {
      setForm({ ...form, profile_image_url: url });
      toast({ title: "Success", description: "Image uploaded!" });
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = await uploadFile(file, "cv");
    if (url) {
      setForm({ ...form, cv_url: url });
      toast({ title: "Success", description: "CV/Resume uploaded!" });
    }
  };

  const handleSave = async () => {
    setErrors({});
    
    // Validate form
    const result = profileSchema.safeParse(form);
    if (!result.success) {
      setErrors(getValidationErrors(result));
      toast({ title: "Validation Error", description: "Please check your input", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("profile")
      .update(result.data)
      .eq("id", profile?.id);

    setSaving(false);

    if (error) {
      toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Profile updated successfully!" });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  };

  if (isLoading) {
    return <div className="text-center py-12 text-muted-foreground">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 md:p-8 rounded-2xl bg-card"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <h2 className="text-2xl font-display font-bold mb-6">Edit Profile</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            maxLength={100}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({ ...form, title: e.target.value })} 
            maxLength={150}
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Bio (Hero Section)</Label>
          <Textarea 
            value={form.bio} 
            onChange={(e) => setForm({ ...form, bio: e.target.value })} 
            rows={3} 
            maxLength={1000}
            className={errors.bio ? "border-destructive" : ""}
          />
          {errors.bio && <p className="text-destructive text-sm">{errors.bio}</p>}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>About Me</Label>
          <Textarea 
            value={form.about_me} 
            onChange={(e) => setForm({ ...form, about_me: e.target.value })} 
            rows={4} 
            maxLength={2000}
            className={errors.about_me ? "border-destructive" : ""}
          />
          {errors.about_me && <p className="text-destructive text-sm">{errors.about_me}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Years Experience</Label>
          <Input type="number" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: parseInt(e.target.value) || 0 })} min={0} max={100} />
        </div>
        <div className="space-y-2">
          <Label>Projects Completed</Label>
          <Input type="number" value={form.projects_completed} onChange={(e) => setForm({ ...form, projects_completed: parseInt(e.target.value) || 0 })} min={0} max={10000} />
        </div>
        <div className="space-y-2">
          <Label>Technologies Mastered</Label>
          <Input type="number" value={form.technologies_mastered} onChange={(e) => setForm({ ...form, technologies_mastered: parseInt(e.target.value) || 0 })} min={0} max={1000} />
        </div>
        <div className="space-y-2">
          <Label>Response Time</Label>
          <Input value={form.response_time} onChange={(e) => setForm({ ...form, response_time: e.target.value })} placeholder="e.g., 24 hours" maxLength={100} />
        </div>
        
        {/* Profile Image Upload */}
        <div className="space-y-2">
          <Label>Profile Image</Label>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload Image
            </Button>
          </div>
          {form.profile_image_url && (
            <div className="mt-2 flex items-center gap-2">
              <Image className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate flex-1">{form.profile_image_url.split("/").pop()}</span>
              <img src={form.profile_image_url} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
            </div>
          )}
        </div>
        
        {/* CV/Resume Upload */}
        <div className="space-y-2">
          <Label>CV/Resume</Label>
          <input
            ref={cvInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleCvUpload}
            className="hidden"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => cvInputRef.current?.click()}
              disabled={uploading}
              className="flex-1"
            >
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Upload CV
            </Button>
          </div>
          {form.cv_url && (
            <div className="mt-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <a href={form.cv_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                {form.cv_url.split("/").pop()}
              </a>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>GitHub URL</Label>
          <Input 
            value={form.github_url} 
            onChange={(e) => setForm({ ...form, github_url: e.target.value })} 
            maxLength={500}
            className={errors.github_url ? "border-destructive" : ""}
          />
          {errors.github_url && <p className="text-destructive text-sm">{errors.github_url}</p>}
        </div>
        <div className="space-y-2">
          <Label>LinkedIn URL</Label>
          <Input 
            value={form.linkedin_url} 
            onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} 
            maxLength={500}
            className={errors.linkedin_url ? "border-destructive" : ""}
          />
          {errors.linkedin_url && <p className="text-destructive text-sm">{errors.linkedin_url}</p>}
        </div>
        <div className="space-y-2">
          <Label>Twitter URL</Label>
          <Input 
            value={form.twitter_url} 
            onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} 
            maxLength={500}
            className={errors.twitter_url ? "border-destructive" : ""}
          />
          {errors.twitter_url && <p className="text-destructive text-sm">{errors.twitter_url}</p>}
        </div>
        <div className="space-y-2">
          <Label>Instagram URL</Label>
          <Input 
            value={form.instagram_url} 
            onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} 
            placeholder="https://instagram.com/yourhandle" 
            maxLength={500}
            className={errors.instagram_url ? "border-destructive" : ""}
          />
          {errors.instagram_url && <p className="text-destructive text-sm">{errors.instagram_url}</p>}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSave} disabled={saving || uploading} className="gradient-bg">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>
    </motion.div>
  );
};
