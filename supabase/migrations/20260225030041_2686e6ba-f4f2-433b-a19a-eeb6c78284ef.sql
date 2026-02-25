
-- Schemes table for admin panel
CREATE TABLE public.schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_hi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_hi TEXT,
  description_en TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  target_group TEXT[] DEFAULT '{}',
  eligibility_criteria JSONB DEFAULT '{}',
  required_documents TEXT[] DEFAULT '{}',
  apply_link TEXT,
  deadline TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User submissions/eligibility checks
CREATE TABLE public.eligibility_checks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  category TEXT NOT NULL,
  occupation TEXT NOT NULL,
  annual_income INTEGER NOT NULL,
  has_disability BOOLEAN DEFAULT false,
  ai_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_checks ENABLE ROW LEVEL SECURITY;

-- Public read access for schemes
CREATE POLICY "Anyone can view active schemes" ON public.schemes FOR SELECT USING (is_active = true);
-- Public insert for eligibility checks (no auth required for rural users)
CREATE POLICY "Anyone can submit eligibility check" ON public.eligibility_checks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view eligibility checks" ON public.eligibility_checks FOR SELECT USING (true);
-- Admin policies (allow all for now - can be restricted later)
CREATE POLICY "Anyone can manage schemes" ON public.schemes FOR ALL USING (true);

-- Insert some sample schemes
INSERT INTO public.schemes (name_hi, name_en, description_hi, description_en, category, target_group, required_documents) VALUES
('प्रधानमंत्री किसान सम्मान निधि', 'PM Kisan Samman Nidhi', 'किसानों को प्रति वर्ष ₹6000 की आर्थिक सहायता', 'Financial assistance of ₹6000 per year to farmers', 'agriculture', ARRAY['farmer'], ARRAY['आधार कार्ड', 'बैंक खाता', 'भूमि दस्तावेज']),
('प्रधानमंत्री आवास योजना', 'PM Awas Yojana', 'गरीब परिवारों को पक्का मकान बनाने के लिए सहायता', 'Housing assistance for poor families', 'housing', ARRAY['low-income'], ARRAY['आधार कार्ड', 'आय प्रमाण पत्र', 'BPL कार्ड']),
('प्रधानमंत्री उज्ज्वला योजना', 'PM Ujjwala Yojana', 'BPL परिवारों को मुफ्त LPG कनेक्शन', 'Free LPG connection for BPL families', 'welfare', ARRAY['low-income', 'women'], ARRAY['आधार कार्ड', 'BPL कार्ड', 'राशन कार्ड']),
('राष्ट्रीय छात्रवृत्ति पोर्टल', 'National Scholarship Portal', 'विद्यार्थियों को छात्रवृत्ति', 'Scholarships for students', 'education', ARRAY['student'], ARRAY['आधार कार्ड', 'मार्कशीट', 'आय प्रमाण पत्र', 'बैंक खाता']),
('आयुष्मान भारत योजना', 'Ayushman Bharat Yojana', '₹5 लाख तक का मुफ्त इलाज', 'Free treatment up to ₹5 lakh', 'health', ARRAY['low-income', 'senior'], ARRAY['आधार कार्ड', 'राशन कार्ड', 'आय प्रमाण पत्र']);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_schemes_updated_at
BEFORE UPDATE ON public.schemes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
