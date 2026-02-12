import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAchievements } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Plus, Trash2, Edit2, Save, Loader2, Trophy, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { getSaveErrorMessage, getDeleteErrorMessage } from "@/lib/errorUtils";
import { achievementSchema, getValidationErrors } from "@/lib/validationSchemas";

const emptyAchievement = { title: "", description: "", date: "", category: "", image_url: "" };

export const AchievementsEditor = () => {
  const { data: achievements, isLoading } = useAchievements();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { uploadFile, uploading } = useFileUpload();
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyAchievement);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = await uploadFile(file, "achievements");
    if (url) {
      setForm({ ...form, image_url: url });
      toast({ title: "Image uploaded!", description: "Achievement image uploaded successfully" });
    }
  };

  const handleSave = async () => {
    setErrors({});
    
    // Validate
    const result = achievementSchema.safeParse(form);
    if (!result.success) {
      setErrors(getValidationErrors(result));
      toast({ title: "Validation Error", description: "Please check your input", variant: "destructive" });
      return;
    }

    setSaving(true);
    const payload = { ...result.data, date: form.date || null };
    
    if (editingId) {
      const { error } = await supabase.from("achievements").update(payload).eq("id", editingId);
      if (error) toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
      else toast({ title: "Success", description: "Achievement updated!" });
    } else {
      const { error } = await supabase.from("achievements").insert([{ ...form, date: form.date || null }]);
      if (error) toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
      else toast({ title: "Success", description: "Achievement added!" });
    }
    
    setSaving(false);
    setEditingId(null);
    setIsAdding(false);
    setForm(emptyAchievement);
    setErrors({});
    queryClient.invalidateQueries({ queryKey: ["achievements"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this achievement?")) return;
    const { error } = await supabase.from("achievements").delete().eq("id", id);
    if (error) toast({ title: "Error", description: getDeleteErrorMessage(error), variant: "destructive" });
    else {
      toast({ title: "Deleted", description: "Achievement removed" });
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
    }
  };

  const openEdit = (achievement: any) => {
    setEditingId(achievement.id);
    setForm({ 
      title: achievement.title, 
      description: achievement.description || "", 
      date: achievement.date || "", 
      category: achievement.category || "",
      image_url: achievement.image_url || ""
    });
    setErrors({});
    setIsAdding(true);
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Achievements ({achievements?.length || 0})</h2>
        <Button onClick={() => { setIsAdding(true); setEditingId(null); setForm(emptyAchievement); setErrors({}); }} className="gradient-bg"><Plus className="mr-2 h-4 w-4" /> Add Achievement</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements?.map((achievement) => (
          <div key={achievement.id} className="p-4 rounded-xl bg-card border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-start gap-3">
              {achievement.image_url ? (
                <img src={achievement.image_url} alt={achievement.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0"><Trophy className="w-5 h-5 text-primary-foreground" /></div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{achievement.title}</h3>
                {achievement.category && <span className="text-xs text-primary">{achievement.category}</span>}
                {achievement.date && <p className="text-xs text-muted-foreground">{format(new Date(achievement.date), "MMM yyyy")}</p>}
              </div>
            </div>
            {achievement.description && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{achievement.description}</p>}
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => openEdit(achievement)} className="flex-1"><Edit2 className="h-3 w-3" /></Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(achievement.id)} className="flex-1"><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAdding} onOpenChange={(open) => { setIsAdding(open); if (!open) setErrors({}); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? "Edit Achievement" : "Add Achievement"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Achievement Image</Label>
              {form.image_url ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                  <img src={form.image_url} alt="Achievement" className="w-full h-full object-cover" />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => setForm({ ...form, image_url: "" })}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center">
                    {uploading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Click to upload achievement image</span>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              )}
            </div>
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
              <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Award, Competition, etc." maxLength={100} />
            </div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
                maxLength={2000}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || uploading} className="gradient-bg">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
