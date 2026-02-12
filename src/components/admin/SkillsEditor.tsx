import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSkills } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { getSaveErrorMessage, getDeleteErrorMessage } from "@/lib/errorUtils";
import { skillSchema, getValidationErrors } from "@/lib/validationSchemas";

const categories = ["Programming Languages", "Frameworks", "Tools & Databases", "Design", "Other"];

export const SkillsEditor = () => {
  const { data: skills, isLoading } = useSkills();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [saving, setSaving] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({ name: "", category: "Programming Languages", level: 80 });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAdd = async () => {
    setErrors({});
    
    // Validate
    const result = skillSchema.safeParse(newSkill);
    if (!result.success) {
      setErrors(getValidationErrors(result));
      toast({ title: "Validation Error", description: "Please check your input", variant: "destructive" });
      return;
    }

    setSaving("new");
    const { error } = await supabase.from("skills").insert([newSkill]);
    setSaving(null);
    if (error) {
      toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Skill added!" });
      setNewSkill({ name: "", category: "Programming Languages", level: 80 });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    }
  };

  const handleUpdate = async (id: string, updates: Partial<typeof newSkill>) => {
    setSaving(id);
    const { error } = await supabase.from("skills").update(updates).eq("id", id);
    setSaving(null);
    if (error) {
      toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Skill updated!" });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: getDeleteErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Skill removed" });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    }
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Add New */}
      <div className="p-6 rounded-2xl bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-lg font-semibold mb-4">Add New Skill</h3>
        <div className="grid gap-4 md:grid-cols-4 items-end">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input 
              value={newSkill.name} 
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} 
              placeholder="React" 
              maxLength={100}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={newSkill.category} onValueChange={(v) => setNewSkill({ ...newSkill, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Level: {newSkill.level}%</Label>
            <Slider value={[newSkill.level]} onValueChange={([v]) => setNewSkill({ ...newSkill, level: v })} min={0} max={100} />
          </div>
          <Button onClick={handleAdd} disabled={saving === "new"} className="gradient-bg">
            {saving === "new" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add
          </Button>
        </div>
      </div>

      {/* Existing Skills */}
      <div className="p-6 rounded-2xl bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-lg font-semibold mb-4">Manage Skills ({skills?.length || 0})</h3>
        <div className="space-y-4">
          {skills?.map((skill) => (
            <div key={skill.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
              <div className="flex-1 grid gap-4 md:grid-cols-4 items-center">
                <Input 
                  defaultValue={skill.name} 
                  onBlur={(e) => e.target.value !== skill.name && handleUpdate(skill.id, { name: e.target.value })} 
                  maxLength={100}
                />
                <Select defaultValue={skill.category} onValueChange={(v) => handleUpdate(skill.id, { category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Slider defaultValue={[skill.level]} onValueCommit={([v]) => handleUpdate(skill.id, { level: v })} min={0} max={100} className="flex-1" />
                  <span className="text-sm w-12">{skill.level}%</span>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(skill.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
