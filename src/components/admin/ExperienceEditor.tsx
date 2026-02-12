import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useExperience } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, X, Save, Loader2, Briefcase } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { getSaveErrorMessage, getDeleteErrorMessage } from "@/lib/errorUtils";
import { experienceSchema, getValidationErrors } from "@/lib/validationSchemas";

type Experience = {
  id: string;
  company: string;
  position: string;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
  description: string | null;
  achievements: string[] | null;
};

const emptyExp = { company: "", position: "", start_date: "", end_date: "", is_current: false, description: "", achievements: [] as string[] };

export const ExperienceEditor = () => {
  const { data: experience, isLoading } = useExperience();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyExp);
  const [achievementInput, setAchievementInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    setErrors({});
    
    // Validate
    const result = experienceSchema.safeParse(form);
    if (!result.success) {
      setErrors(getValidationErrors(result));
      toast({ title: "Validation Error", description: "Please check your input", variant: "destructive" });
      return;
    }

    setSaving(true);
    const payload = { ...result.data, start_date: form.start_date || null, end_date: form.is_current ? null : (form.end_date || null) };
    
    if (editingExp) {
      const { error } = await supabase.from("experience").update(payload).eq("id", editingExp.id);
      if (error) toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
      else toast({ title: "Success", description: "Experience updated!" });
    } else {
      const { error } = await supabase.from("experience").insert([{ ...form, start_date: form.start_date || null, end_date: form.is_current ? null : (form.end_date || null) }]);
      if (error) toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
      else toast({ title: "Success", description: "Experience added!" });
    }
    
    setSaving(false);
    setEditingExp(null);
    setIsAdding(false);
    setForm(emptyExp);
    setErrors({});
    queryClient.invalidateQueries({ queryKey: ["experience"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    const { error } = await supabase.from("experience").delete().eq("id", id);
    if (error) toast({ title: "Error", description: getDeleteErrorMessage(error), variant: "destructive" });
    else {
      toast({ title: "Deleted", description: "Experience removed" });
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    }
  };

  const openEdit = (exp: Experience) => {
    setEditingExp(exp);
    setForm({
      company: exp.company,
      position: exp.position,
      start_date: exp.start_date || "",
      end_date: exp.end_date || "",
      is_current: exp.is_current || false,
      description: exp.description || "",
      achievements: exp.achievements || [],
    });
    setErrors({});
    setIsAdding(true);
  };

  const addAchievement = () => {
    if (achievementInput.trim() && form.achievements.length < 20) {
      setForm({ ...form, achievements: [...form.achievements, achievementInput.trim().substring(0, 500)] });
      setAchievementInput("");
    }
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Experience ({experience?.length || 0})</h2>
        <Button onClick={() => { setIsAdding(true); setEditingExp(null); setForm(emptyExp); setErrors({}); }} className="gradient-bg">
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      <div className="space-y-4">
        {experience?.map((exp) => (
          <div key={exp.id} className="p-4 rounded-xl bg-card border flex items-start gap-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{exp.position}</h3>
              <p className="text-primary text-sm">{exp.company}</p>
              <p className="text-xs text-muted-foreground">{exp.start_date && format(new Date(exp.start_date), "MMM yyyy")} - {exp.is_current ? "Present" : exp.end_date && format(new Date(exp.end_date), "MMM yyyy")}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(exp as Experience)}><Edit2 className="h-4 w-4" /></Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(exp.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAdding} onOpenChange={(open) => { setIsAdding(open); if (!open) setErrors({}); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingExp ? "Edit Experience" : "Add Experience"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input 
                  value={form.company} 
                  onChange={(e) => setForm({ ...form, company: e.target.value })} 
                  maxLength={200}
                  className={errors.company ? "border-destructive" : ""}
                />
                {errors.company && <p className="text-destructive text-sm">{errors.company}</p>}
              </div>
              <div className="space-y-2">
                <Label>Position *</Label>
                <Input 
                  value={form.position} 
                  onChange={(e) => setForm({ ...form, position: e.target.value })} 
                  maxLength={200}
                  className={errors.position ? "border-destructive" : ""}
                />
                {errors.position && <p className="text-destructive text-sm">{errors.position}</p>}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
              <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} disabled={form.is_current} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={form.is_current} onCheckedChange={(v) => setForm({ ...form, is_current: v })} /><Label>Currently Working Here</Label></div>
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
            <div className="space-y-2">
              <Label>Achievements ({form.achievements.length}/20)</Label>
              <div className="flex gap-2">
                <Input 
                  value={achievementInput} 
                  onChange={(e) => setAchievementInput(e.target.value)} 
                  placeholder="Add achievement" 
                  maxLength={500}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAchievement())} 
                />
                <Button type="button" onClick={addAchievement} variant="outline" disabled={form.achievements.length >= 20}>Add</Button>
              </div>
              <ul className="space-y-1 mt-2">
                {form.achievements.map((a, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm bg-muted px-2 py-1 rounded">
                    <span className="flex-1">{a}</span>
                    <button onClick={() => setForm({ ...form, achievements: form.achievements.filter((_, idx) => idx !== i) })}><X className="h-3 w-3" /></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="gradient-bg">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
