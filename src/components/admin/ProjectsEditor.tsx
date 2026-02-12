import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProjects } from "@/hooks/usePortfolioData";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, X, Save, Loader2, Folder, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getSaveErrorMessage, getDeleteErrorMessage } from "@/lib/errorUtils";
import { projectSchema, getValidationErrors } from "@/lib/validationSchemas";

type Project = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  tech_stack: string[] | null;
  category: string | null;
  live_url: string | null;
  github_url: string | null;
  featured: boolean | null;
};

const emptyProject = { title: "", description: "", image_url: "", tech_stack: [] as string[], category: "", live_url: "", github_url: "", featured: false };

export const ProjectsEditor = () => {
  const { data: projects, isLoading } = useProjects();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { uploadFile, uploading } = useFileUpload();
  const [saving, setSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyProject);
  const [techInput, setTechInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please upload an image file", variant: "destructive" });
      return;
    }
    
    const url = await uploadFile(file, "projects");
    if (url) {
      setForm({ ...form, image_url: url });
      toast({ title: "Success", description: "Image uploaded!" });
    }
  };

  const handleSave = async () => {
    setErrors({});
    
    // Validate
    const result = projectSchema.safeParse(form);
    if (!result.success) {
      setErrors(getValidationErrors(result));
      toast({ title: "Validation Error", description: "Please check your input", variant: "destructive" });
      return;
    }

    setSaving(true);
    
    if (editingProject) {
      const { error } = await supabase.from("projects").update(result.data).eq("id", editingProject.id);
      if (error) toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
      else toast({ title: "Success", description: "Project updated!" });
    } else {
      const { error } = await supabase.from("projects").insert([form]);
      if (error) toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
      else toast({ title: "Success", description: "Project added!" });
    }
    
    setSaving(false);
    setEditingProject(null);
    setIsAdding(false);
    setForm(emptyProject);
    setErrors({});
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast({ title: "Error", description: getDeleteErrorMessage(error), variant: "destructive" });
    else {
      toast({ title: "Deleted", description: "Project removed" });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    }
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setForm({
      title: project.title,
      description: project.description || "",
      image_url: project.image_url || "",
      tech_stack: project.tech_stack || [],
      category: project.category || "",
      live_url: project.live_url || "",
      github_url: project.github_url || "",
      featured: project.featured || false,
    });
    setErrors({});
    setIsAdding(true);
  };

  const addTech = () => {
    if (techInput.trim() && !form.tech_stack.includes(techInput.trim()) && form.tech_stack.length < 20) {
      setForm({ ...form, tech_stack: [...form.tech_stack, techInput.trim().substring(0, 50)] });
      setTechInput("");
    }
  };

  const removeTech = (tech: string) => {
    setForm({ ...form, tech_stack: form.tech_stack.filter((t) => t !== tech) });
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Projects ({projects?.length || 0})</h2>
        <Button onClick={() => { setIsAdding(true); setEditingProject(null); setForm(emptyProject); setErrors({}); }} className="gradient-bg">
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <div key={project.id} className="p-4 rounded-xl bg-card border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
              {project.image_url ? <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Folder className="w-12 h-12 text-muted-foreground" /></div>}
            </div>
            <h3 className="font-semibold mb-1">{project.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(project as Project)}><Edit2 className="h-4 w-4" /></Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAdding} onOpenChange={(open) => { setIsAdding(open); if (!open) setErrors({}); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input 
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  maxLength={200}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Web App, Mobile, etc." maxLength={100} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                rows={3} 
                maxLength={2000}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
            </div>
            
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Project Image</Label>
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
              {form.image_url && (
                <div className="mt-2">
                  <img src={form.image_url} alt="Project preview" className="w-full h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Live URL</Label>
                <Input 
                  value={form.live_url} 
                  onChange={(e) => setForm({ ...form, live_url: e.target.value })} 
                  maxLength={500}
                  className={errors.live_url ? "border-destructive" : ""}
                />
                {errors.live_url && <p className="text-destructive text-sm">{errors.live_url}</p>}
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
            </div>
            <div className="space-y-2">
              <Label>Tech Stack ({form.tech_stack.length}/20)</Label>
              <div className="flex gap-2">
                <Input 
                  value={techInput} 
                  onChange={(e) => setTechInput(e.target.value)} 
                  placeholder="Add technology" 
                  maxLength={50}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} 
                />
                <Button type="button" onClick={addTech} variant="outline" disabled={form.tech_stack.length >= 20}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tech_stack.map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-muted rounded text-sm flex items-center gap-1">
                    {tech} <button onClick={() => removeTech(tech)}><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
              <Label>Featured Project</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || uploading} className="gradient-bg">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
