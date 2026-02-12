-- Add instagram_url column to profile table
ALTER TABLE public.profile ADD COLUMN instagram_url text;

-- Create storage bucket for portfolio assets
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-assets', 'portfolio-assets', true);

-- Allow anyone to view files in the bucket (public access for portfolio images)
CREATE POLICY "Public can view portfolio assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-assets');

-- Allow admins to upload files
CREATE POLICY "Admins can upload portfolio assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update files
CREATE POLICY "Admins can update portfolio assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete files
CREATE POLICY "Admins can delete portfolio assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-assets' AND public.has_role(auth.uid(), 'admin'::app_role));