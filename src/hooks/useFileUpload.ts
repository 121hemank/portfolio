import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadFile = async (file: File, folder: string = "images"): Promise<string | null> => {
    setUploading(true);
    
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(fileName, file);

      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        setUploading(false);
        return null;
      }

      const { data } = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(fileName);

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
