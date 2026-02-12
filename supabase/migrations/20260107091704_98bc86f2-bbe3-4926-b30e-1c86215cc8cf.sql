-- Portfolio Configuration Table
CREATE TABLE public.portfolio_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Profile/About Section
CREATE TABLE public.profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Your Name',
  title TEXT NOT NULL DEFAULT 'Full Stack Developer',
  bio TEXT,
  about_me TEXT,
  years_experience INTEGER DEFAULT 0,
  projects_completed INTEGER DEFAULT 0,
  technologies_mastered INTEGER DEFAULT 0,
  profile_image_url TEXT,
  cv_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  response_time TEXT DEFAULT '24 hours',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skills Table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 80 CHECK (level >= 0 AND level <= 100),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Education Table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT,
  start_date DATE,
  end_date DATE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Certifications Table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date DATE,
  credential_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Projects Table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  tech_stack TEXT[] DEFAULT '{}',
  category TEXT,
  live_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Experience Table
CREATE TABLE public.experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Achievements Table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Contact Messages Table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_details TEXT,
  budget TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin Users Table
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.portfolio_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Public read policies (for portfolio display)
CREATE POLICY "Anyone can view profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Anyone can view education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Anyone can view certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Anyone can view experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Anyone can view config" ON public.portfolio_config FOR SELECT USING (true);

-- Public insert for contact messages
CREATE POLICY "Anyone can send contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Admin policies (check if user is admin)
CREATE POLICY "Admins can manage profile" ON public.profile FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage skills" ON public.skills FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage education" ON public.education FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage certifications" ON public.certifications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage experience" ON public.experience FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage achievements" ON public.achievements FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can delete contact messages" ON public.contact_messages FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can manage config" ON public.portfolio_config FOR ALL USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);
CREATE POLICY "Admins can view admin_users" ON public.admin_users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
);

-- Insert default profile
INSERT INTO public.profile (name, title, bio, about_me, years_experience, projects_completed, technologies_mastered, response_time)
VALUES (
  'John Developer',
  'Full Stack Developer & UI/UX Designer',
  'Passionate full-stack developer with expertise in building modern web applications. I transform ideas into elegant, scalable solutions that make a real impact.',
  'I am a creative and detail-oriented developer who loves turning complex problems into simple, beautiful solutions. With a strong foundation in both frontend and backend technologies, I create seamless digital experiences that delight users and drive business growth.',
  5,
  50,
  25,
  '24 hours'
);

-- Insert sample skills
INSERT INTO public.skills (name, category, level, sort_order) VALUES
('JavaScript', 'Programming Languages', 95, 1),
('TypeScript', 'Programming Languages', 90, 2),
('Python', 'Programming Languages', 85, 3),
('React', 'Frameworks', 95, 1),
('Node.js', 'Frameworks', 88, 2),
('Next.js', 'Frameworks', 85, 3),
('PostgreSQL', 'Tools & Databases', 85, 1),
('MongoDB', 'Tools & Databases', 80, 2),
('Docker', 'Tools & Databases', 75, 3),
('Git', 'Tools & Databases', 90, 4),
('Figma', 'Design', 85, 1),
('Tailwind CSS', 'Design', 95, 2);

-- Insert sample education
INSERT INTO public.education (institution, degree, field, start_date, end_date, sort_order) VALUES
('MIT', 'Bachelor of Science', 'Computer Science', '2015-09-01', '2019-06-01', 1),
('Stanford Online', 'Professional Certificate', 'Machine Learning', '2020-01-01', '2020-06-01', 2);

-- Insert sample certifications
INSERT INTO public.certifications (name, issuer, issue_date, sort_order) VALUES
('AWS Solutions Architect', 'Amazon Web Services', '2022-03-15', 1),
('Google Cloud Professional', 'Google', '2021-08-20', 2),
('Meta Frontend Developer', 'Meta', '2023-01-10', 3);

-- Insert sample projects
INSERT INTO public.projects (title, description, tech_stack, category, featured, sort_order) VALUES
('E-Commerce Platform', 'A full-featured e-commerce solution with real-time inventory, payment processing, and admin dashboard.', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], 'Web App', true, 1),
('AI Chat Assistant', 'Intelligent chatbot powered by GPT-4 with context awareness and multi-language support.', ARRAY['Python', 'FastAPI', 'OpenAI', 'Redis'], 'AI/ML', true, 2),
('Task Management System', 'Collaborative project management tool with real-time updates and team features.', ARRAY['Next.js', 'TypeScript', 'Supabase', 'Tailwind'], 'SaaS', false, 3);

-- Insert sample experience
INSERT INTO public.experience (company, position, start_date, end_date, is_current, description, achievements, sort_order) VALUES
('Tech Innovations Inc', 'Senior Full Stack Developer', '2022-01-01', NULL, true, 'Leading development of enterprise SaaS products', ARRAY['Led team of 5 developers', 'Reduced load time by 60%', 'Implemented CI/CD pipeline'], 1),
('StartupXYZ', 'Full Stack Developer', '2020-03-01', '2021-12-31', false, 'Built and maintained multiple web applications', ARRAY['Developed 3 production apps', 'Mentored junior developers'], 2),
('Freelance', 'Web Developer', '2019-06-01', '2020-02-28', false, 'Delivered custom solutions for various clients', ARRAY['15+ successful projects', '100% client satisfaction'], 3);

-- Insert sample achievements
INSERT INTO public.achievements (title, description, date, category, sort_order) VALUES
('Best Developer Award', 'Recognized as top performer for innovative solutions', '2023-06-15', 'Award', 1),
('Open Source Contributor', 'Major contributions to React ecosystem libraries', '2022-09-01', 'Contribution', 2),
('Hackathon Winner', 'First place in Regional Tech Hackathon 2021', '2021-11-20', 'Competition', 3);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profile_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_config_updated_at
  BEFORE UPDATE ON public.portfolio_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();