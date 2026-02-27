
CREATE TABLE public.govt_jobs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_name text NOT NULL,
  department text NOT NULL,
  total_vacancies integer NOT NULL DEFAULT 1,
  qualification text NOT NULL DEFAULT 'Graduate',
  min_age integer NOT NULL DEFAULT 18,
  max_age integer NOT NULL DEFAULT 35,
  age_relaxation_obc integer DEFAULT 3,
  age_relaxation_sc_st integer DEFAULT 5,
  fee_general integer DEFAULT 0,
  fee_obc integer DEFAULT 0,
  fee_sc_st integer DEFAULT 0,
  registration_start date NOT NULL DEFAULT CURRENT_DATE,
  registration_end date NOT NULL DEFAULT (CURRENT_DATE + interval '30 days'),
  selection_process text DEFAULT 'Written Exam + Interview',
  description text,
  apply_link text,
  category_reservation text[] DEFAULT '{}',
  state text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.govt_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active jobs" ON public.govt_jobs
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can manage jobs" ON public.govt_jobs
  FOR ALL USING (true);
