import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCertifications } from "@/hooks/usePortfolioData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Plus, Trash2, Edit2, Save, Loader2, Award, Upload, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { getSaveErrorMessage, getDeleteErrorMessage } from "@/lib/errorUtils";
import { certificationSchema, getValidationErrors } from "@/lib/validationSchemas";

const emptyCert = { name: "", issuer: "", issue_date: "", credential_url: "", image_url: "" };

export const CertificationsEditor = () => {
  const { data: certifications, isLoading } = useCertifications();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { uploadFile, uploading } = useFileUpload();
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyCert);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = await uploadFile(file, "certifications");
    if (url) {
      setForm({ ...form, image_url: url });
      toast({ title: "Image uploaded!", description: "Certificate image uploaded successfully" });
    }
  };

  const handleSave = async () => {
    setErrors({});
    
    // Validate
    const result = certificationSchema.safeParse(form);
    if (!result.success) {
      setErrors(getValidationErrors(result));
      toast({ title: "Validation Error", description: "Please check your input", variant: "destructive" });
      return;
    }

    setSaving(true);
    const payload = { ...result.data, issue_date: form.issue_date || null };
    
    if (editingId) {
      const { error } = await supabase.from("certifications").update(payload).eq("id", editingId);
      if (error) toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
      else toast({ title: "Success", description: "Certification updated!" });
    } else {
      const { error } = await supabase.from("certifications").insert([{ ...form, issue_date: form.issue_date || null }]);
      if (error) toast({ title: "Error", description: getSaveErrorMessage(error), variant: "destructive" });
      else toast({ title: "Success", description: "Certification added!" });
    }
    
    setSaving(false);
    setEditingId(null);
    setIsAdding(false);
    setForm(emptyCert);
    setErrors({});
    queryClient.invalidateQueries({ queryKey: ["certifications"] });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this certification?")) return;
    const { error } = await supabase.from("certifications").delete().eq("id", id);
    if (error) toast({ title: "Error", description: getDeleteErrorMessage(error), variant: "destructive" });
    else {
      toast({ title: "Deleted", description: "Certification removed" });
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    }
  };

  const openEdit = (cert: any) => {
    setEditingId(cert.id);
    setForm({ 
      name: cert.name, 
      issuer: cert.issuer, 
      issue_date: cert.issue_date || "", 
      credential_url: cert.credential_url || "",
      image_url: cert.image_url || ""
    });
    setErrors({});
    setIsAdding(true);
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Certifications ({certifications?.length || 0})</h2>
        <Button onClick={() => { setIsAdding(true); setEditingId(null); setForm(emptyCert); setErrors({}); }} className="gradient-bg"><Plus className="mr-2 h-4 w-4" /> Add Certification</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications?.map((cert) => (
          <div key={cert.id} className="p-4 rounded-xl bg-card border" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-start gap-3">
              {cert.image_url ? (
                <img src={cert.image_url} alt={cert.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0"><Award className="w-5 h-5 text-primary-foreground" /></div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{cert.name}</h3>
                <p className="text-primary text-xs">{cert.issuer}</p>
                <p className="text-xs text-muted-foreground">{cert.issue_date && format(new Date(cert.issue_date), "MMM yyyy")}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => openEdit(cert)} className="flex-1"><Edit2 className="h-3 w-3" /></Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(cert.id)} className="flex-1"><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAdding} onOpenChange={(open) => { setIsAdding(open); if (!open) setErrors({}); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? "Edit Certification" : "Add Certification"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Certificate Image</Label>
              {form.image_url ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                  <img src={form.image_url} alt="Certificate" className="w-full h-full object-cover" />
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
                        <span className="text-sm text-muted-foreground">Click to upload certificate image</span>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              )}
            </div>
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                maxLength={200}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label>Issuer *</Label>
              <Input 
                value={form.issuer} 
                onChange={(e) => setForm({ ...form, issuer: e.target.value })} 
                maxLength={200}
                className={errors.issuer ? "border-destructive" : ""}
              />
              {errors.issuer && <p className="text-destructive text-sm">{errors.issuer}</p>}
            </div>
            <div className="space-y-2"><Label>Issue Date</Label><Input type="date" value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} /></div>
            <div className="space-y-2">
              <Label>Credential URL</Label>
              <Input 
                value={form.credential_url} 
                onChange={(e) => setForm({ ...form, credential_url: e.target.value })} 
                maxLength={500}
                className={errors.credential_url ? "border-destructive" : ""}
              />
              {errors.credential_url && <p className="text-destructive text-sm">{errors.credential_url}</p>}
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
