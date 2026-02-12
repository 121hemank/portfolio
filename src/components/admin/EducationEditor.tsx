import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEducation } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Save, Loader2, GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { getSaveErrorMessage, getDeleteErrorMessage } from "@/lib/errorUtils";
import { educationSchema, getValidationErrors } from "@/lib/validationSchemas";

const emptyEdu = { institution: "", degree: "", field: "", start_date: "", end_date: "", description: "" };

export const EducationEditor = () => {
  const { data: education, isLoading } = useEducation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyEdu);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    setErrors({});
    
    // Validate
    const result = educationSchema.safeParse(form);
    if (!result.success) {
      setErrors(getValidationErrors(result));
      toast({ title: "Validation Error", description: "Please check your input", variant: "destructive" });
      return;
    }

    setSaving(true);
    const payload = { ...result.data, start_date: form.start_date || null, end_date: form.end_date || null };
    
    if (editingId) {
      const { error } = await supabase.from("education").update(payload).eq("id", editingId);
      if (error) toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
      else toast({ title: "Success", description: "Education updated!" });
    } else {
      const { error } = await supabase.from("education").insert([{ ...form, start_date: form.start_date || null, end_date: form.end_date || null }]);
      if (error) toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
      else toast({ title: "Success", description: "Education added!" });
    }
    
    setSaving(false);
    setEditingId(null);
    setIsAdding(false);
    setForm(emptyEdu);
    setErrors({});
    queryClient.invalidateQueries({ queryKey: ["education"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this education entry?")) return;
    const { error } = await supabase.from("education").delete().eq("id", id);
    if (error) toast({ title: "Error", description: getDeleteErrorMessage(error), variant: "destructive" });
    else {
      toast({ title: "Deleted", description: "Education removed" });
      queryClient.invalidateQueries({ queryKey: ["education"] });
    }
  };

  const openEdit = (edu: any) => {
    setEditingId(edu.id);
    setForm({ institution: edu.institution, degree: edu.degree, field: edu.field || "", start_date: edu.start_date || "", end_date: edu.end_date || "", description: edu.description || "" });
    setErrors({});
    setIsAdding(true);
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Education ({education?.length || 0})</h2>
        <Button onClick={() => { setIsAdding(true); setEditingId(null); setForm(emptyEdu); setErrors({}); }} className="gradient-bg"><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
      </div>

      <div className="space-y-4">
        {education?.map((edu) => (
          <div key={edu.id} className="p-4 rounded-xl bg-card border flex items-start gap-4" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0"><GraduationCap className="w-6 h-6 text-primary-foreground" /></div>
            <div className="flex-1">
              <h3 className="font-semibold">{edu.degree}</h3>
              <p className="text-primary text-sm">{edu.institution}</p>
              <p className="text-xs text-muted-foreground">{edu.field} • {edu.start_date && format(new Date(edu.start_date), "yyyy")} - {edu.end_date && format(new Date(edu.end_date), "yyyy")}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => openEdit(edu)}><Edit2 className="h-4 w-4" /></Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(edu.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAdding} onOpenChange={(open) => { setIsAdding(open); if (!open) setErrors({}); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? "Edit Education" : "Add Education"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Institution *</Label>
              <Input 
                value={form.institution} 
                onChange={(e) => setForm({ ...form, institution: e.target.value })} 
                maxLength={200}
                className={errors.institution ? "border-destructive" : ""}
              />
              {errors.institution && <p className="text-destructive text-sm">{errors.institution}</p>}
            </div>
            <div className="space-y-2">
              <Label>Degree *</Label>
              <Input 
                value={form.degree} 
                onChange={(e) => setForm({ ...form, degree: e.target.value })} 
                maxLength={200}
                className={errors.degree ? "border-destructive" : ""}
              />
              {errors.degree && <p className="text-destructive text-sm">{errors.degree}</p>}
            </div>
            <div className="space-y-2">
              <Label>Field of Study</Label>
              <Input value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} maxLength={200} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></div>
              <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></div>
            </div>
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
            <Button onClick={handleSave} disabled={saving} className="gradient-bg">{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
