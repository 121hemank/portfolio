import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "application/pdf"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, folder: string = "images"): Promise<string | null> => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Allowed: JPEG, PNG, WebP, GIF, SVG, PDF", variant: "destructive" });
      return null;
    }
    if (file.size > MAX_SIZE) {
      toast({ title: "File too large", description: "Maximum size is 5MB", variant: "destructive" });
      return null;
    }

    setUploading(true);
    
    try {
      const fileExt = file.name.split(".").pop();
      const safeFolder = folder.replace(/[^a-z0-9_-]/gi, "");
      const safeName = `${safeFolder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(safeName, file);

      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        setUploading(false);
        return null;
      }

      const { data } = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(safeName);

      setUploading(false);
      return data.publicUrl;
    } catch (error) {
      toast({ title: "Upload failed", description: "An error occurred during upload", variant: "destructive" });
      setUploading(false);
      return null;
    }
  };

  return { uploadFile, uploading };
};
