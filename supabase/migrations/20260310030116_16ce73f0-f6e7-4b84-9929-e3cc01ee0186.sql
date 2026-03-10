
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  mobile_number TEXT NOT NULL DEFAULT '',
  age INTEGER,
  gender TEXT,
  category TEXT,
  state TEXT,
  district TEXT,
  annual_income INTEGER,
  occupation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Application tracker
CREATE TYPE public.application_status AS ENUM ('applied', 'documents_submitted', 'under_review', 'approved', 'rejected');

CREATE TABLE public.application_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_id UUID REFERENCES public.schemes(id) ON DELETE SET NULL,
  scheme_name TEXT NOT NULL,
  status application_status NOT NULL DEFAULT 'applied',
  notes TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.application_tracker ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications" ON public.application_tracker
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" ON public.application_tracker
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" ON public.application_tracker
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications" ON public.application_tracker
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_application_tracker_updated_at
  BEFORE UPDATE ON public.application_tracker
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
