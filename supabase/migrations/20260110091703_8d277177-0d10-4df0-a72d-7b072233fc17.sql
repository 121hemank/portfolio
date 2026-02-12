-- Add image_url column to certifications table
ALTER TABLE public.certifications ADD COLUMN image_url text;

-- Add image_url column to achievements table
ALTER TABLE public.achievements ADD COLUMN image_url text;