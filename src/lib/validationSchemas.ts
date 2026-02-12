import { z } from "zod";

// URL validation helper - allows empty strings or valid URLs (auto-accepts www. URLs)
const optionalUrl = z.string().max(500).refine(
  (val) => val === "" || /^(https?:\/\/|www\.).+/.test(val),
  { message: "Must be a valid URL (e.g., https://example.com or www.example.com)" }
).transform((val) => {
  // Auto-prepend https:// if URL starts with www.
  if (val && val.startsWith("www.")) {
    return `https://${val}`;
  }
  return val;
}).optional().or(z.literal(""));

// Profile validation
export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  title: z.string().trim().min(1, "Title is required").max(150, "Title must be less than 150 characters"),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional().or(z.literal("")),
  about_me: z.string().max(2000, "About me must be less than 2000 characters").optional().or(z.literal("")),
  years_experience: z.number().min(0).max(100),
  projects_completed: z.number().min(0).max(10000),
  technologies_mastered: z.number().min(0).max(1000),
  profile_image_url: optionalUrl,
  cv_url: optionalUrl,
  github_url: optionalUrl,
  linkedin_url: optionalUrl,
  twitter_url: optionalUrl,
  instagram_url: optionalUrl,
  response_time: z.string().max(100).optional().or(z.literal("")),
});

// Skill validation
export const skillSchema = z.object({
  name: z.string().trim().min(1, "Skill name is required").max(100, "Name must be less than 100 characters"),
  category: z.string().min(1, "Category is required"),
  level: z.number().min(0, "Level must be at least 0").max(100, "Level cannot exceed 100"),
});

// Project validation
export const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional().or(z.literal("")),
  image_url: optionalUrl,
  tech_stack: z.array(z.string().max(50)).max(20, "Maximum 20 technologies allowed"),
  category: z.string().max(100).optional().or(z.literal("")),
  live_url: optionalUrl,
  github_url: optionalUrl,
  featured: z.boolean(),
});

// Experience validation
export const experienceSchema = z.object({
  company: z.string().trim().min(1, "Company is required").max(200, "Company must be less than 200 characters"),
  position: z.string().trim().min(1, "Position is required").max(200, "Position must be less than 200 characters"),
  start_date: z.string().optional().or(z.literal("")),
  end_date: z.string().optional().or(z.literal("")),
  is_current: z.boolean(),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional().or(z.literal("")),
  achievements: z.array(z.string().max(500)).max(20, "Maximum 20 achievements allowed"),
});

// Education validation
export const educationSchema = z.object({
  institution: z.string().trim().min(1, "Institution is required").max(200, "Institution must be less than 200 characters"),
  degree: z.string().trim().min(1, "Degree is required").max(200, "Degree must be less than 200 characters"),
  field: z.string().max(200).optional().or(z.literal("")),
  start_date: z.string().optional().or(z.literal("")),
  end_date: z.string().optional().or(z.literal("")),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional().or(z.literal("")),
});

// Certification validation
export const certificationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200, "Name must be less than 200 characters"),
  issuer: z.string().trim().min(1, "Issuer is required").max(200, "Issuer must be less than 200 characters"),
  issue_date: z.string().optional().or(z.literal("")),
  credential_url: optionalUrl,
  image_url: optionalUrl,
});

// Achievement validation
export const achievementSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().max(2000, "Description must be less than 2000 characters").optional().or(z.literal("")),
  date: z.string().optional().or(z.literal("")),
  category: z.string().max(100).optional().or(z.literal("")),
  image_url: optionalUrl,
});

// Helper function to get validation errors as a record
export function getValidationErrors(result: z.SafeParseReturnType<any, any>): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!result.success) {
    result.error.errors.forEach((err) => {
      if (err.path[0]) {
        errors[err.path[0] as string] = err.message;
      }
    });
  }
  return errors;
}
