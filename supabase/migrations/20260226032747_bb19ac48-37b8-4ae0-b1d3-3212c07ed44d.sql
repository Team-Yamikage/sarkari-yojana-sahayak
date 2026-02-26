
-- Insert Education schemes
INSERT INTO public.schemes (name_hi, name_en, description_hi, description_en, category, required_documents, target_group, eligibility_criteria) VALUES
('पीएम श्री स्कूल योजना', 'PM SHRI Schools Scheme', 'प्रधानमंत्री स्कूल्स फॉर राइजिंग इंडिया - मॉडल स्कूलों का विकास', 'PM Schools for Rising India - Development of model schools with modern infrastructure and pedagogy', 'education', ARRAY['School ID', 'Registration Certificate', 'UDISE Code'], ARRAY['schools', 'students'], '{"description": "Government and government-aided schools across India"}'),

('राष्ट्रीय मेधा-सह-साधन छात्रवृत्ति', 'National Means-cum-Merit Scholarship', 'कक्षा 9-12 के मेधावी छात्रों को ₹12,000 प्रतिवर्ष छात्रवृत्ति', 'Scholarship of ₹12,000 per annum for meritorious students of class 9-12 from economically weaker sections', 'education', ARRAY['Income Certificate', 'Marksheet', 'Aadhar Card', 'Bank Account'], ARRAY['students'], '{"max_income": 350000, "min_marks": 55, "class": "8th pass"}'),

('बेटी बचाओ बेटी पढ़ाओ', 'Beti Bachao Beti Padhao', 'बालिका शिक्षा और सुरक्षा को बढ़ावा देने वाली योजना', 'Scheme to promote education and protection of girl child, addressing declining child sex ratio', 'education', ARRAY['Birth Certificate', 'Aadhar Card', 'Bank Account'], ARRAY['girls', 'women'], '{"gender": "female", "description": "All girl children across India"}'),

('मध्याह्न भोजन योजना', 'Mid-Day Meal Scheme', 'सरकारी स्कूलों में मुफ्त पोषक भोजन', 'Free nutritious cooked meal to every child in government and government-aided schools (Class 1-8)', 'education', ARRAY['School Enrollment Proof'], ARRAY['students', 'children'], '{"class": "1 to 8", "school_type": "government"}'),

('AICTE प्रगति छात्रवृत्ति', 'AICTE Pragati Scholarship', 'तकनीकी शिक्षा में लड़कियों के लिए ₹50,000 प्रतिवर्ष', 'Scholarship of ₹50,000 per year for girls pursuing technical education in AICTE approved institutions', 'education', ARRAY['Aadhar Card', 'Income Certificate', 'Admission Letter', 'Bank Account', '10th/12th Marksheet'], ARRAY['girls', 'women', 'students'], '{"gender": "female", "max_income": 800000, "education": "technical degree/diploma"}'),

('राष्ट्रीय डिजिटल लाइब्रेरी मिशन', 'National Digital Library Mission', 'मुफ्त ऑनलाइन शैक्षिक सामग्री तक पहुंच', 'Free access to online educational resources including books, articles, videos, and thesis for all learners', 'education', ARRAY['Email ID', 'Mobile Number'], ARRAY['students', 'teachers', 'researchers'], '{"description": "Open to all learners across India"}'),

-- Health schemes
('आयुष्मान भारत योजना', 'Ayushman Bharat Yojana', 'गरीब परिवारों को ₹5 लाख तक मुफ्त इलाज', 'Health insurance of up to ₹5 lakh per family per year for secondary and tertiary care hospitalization', 'health', ARRAY['Aadhar Card', 'Ration Card', 'SECC Data', 'Family ID'], ARRAY['poor families', 'BPL'], '{"max_income": 200000, "description": "Families listed in SECC 2011 database"}'),

('राष्ट्रीय स्वास्थ्य मिशन', 'National Health Mission', 'ग्रामीण और शहरी क्षेत्रों में स्वास्थ्य सेवाओं का विस्तार', 'Strengthening healthcare delivery across rural and urban India with focus on reproductive and child health', 'health', ARRAY['Aadhar Card', 'BPL Card'], ARRAY['rural population', 'women', 'children'], '{"description": "All citizens especially rural and underserved populations"}'),

('जननी सुरक्षा योजना', 'Janani Suraksha Yojana', 'गर्भवती महिलाओं को अस्पताल में प्रसव के लिए नकद सहायता', 'Cash assistance to pregnant women for institutional delivery to reduce maternal and neonatal mortality', 'health', ARRAY['Aadhar Card', 'BPL Card', 'MCH Card', 'Bank Account'], ARRAY['pregnant women', 'BPL'], '{"gender": "female", "description": "Pregnant women from BPL families"}'),

('पीएम जन आरोग्य योजना', 'PM Jan Arogya Yojana', 'आयुष्मान भारत के तहत कैशलेस उपचार', 'Cashless and paperless treatment at empanelled hospitals under Ayushman Bharat for eligible families', 'health', ARRAY['Aadhar Card', 'Ayushman Card', 'Ration Card'], ARRAY['poor families', 'BPL'], '{"description": "10.74 crore deprived rural families and identified urban workers"}'),

('राष्ट्रीय स्वास्थ्य बीमा योजना', 'Rashtriya Swasthya Bima Yojana', 'BPL परिवारों के लिए ₹30,000 का स्वास्थ्य बीमा', 'Health insurance of ₹30,000 for BPL families covering hospitalization expenses for a family of 5', 'health', ARRAY['BPL Card', 'Aadhar Card', 'Family Photo', 'Bank Account'], ARRAY['BPL families'], '{"max_income": 150000, "description": "Below poverty line families"}'),

('मिशन इंद्रधनुष', 'Mission Indradhanush', 'बच्चों और गर्भवती महिलाओं का मुफ्त टीकाकरण', 'Full immunization of children under 2 years and pregnant women against 12 vaccine-preventable diseases', 'health', ARRAY['Birth Certificate', 'MCH Card'], ARRAY['children', 'pregnant women'], '{"description": "Children under 2 years and pregnant women"}'),

-- Agriculture schemes
('पीएम किसान सम्मान निधि', 'PM Kisan Samman Nidhi', 'किसानों को ₹6,000 प्रतिवर्ष तीन किश्तों में', 'Direct income support of ₹6,000 per year in 3 installments to small and marginal farmer families', 'agriculture', ARRAY['Aadhar Card', 'Land Records', 'Bank Account', 'Mobile Number'], ARRAY['farmers'], '{"occupation": "farmer", "description": "All landholding farmer families"}'),

('पीएम फसल बीमा योजना', 'PM Fasal Bima Yojana', 'फसल नुकसान पर किसानों को बीमा कवर', 'Crop insurance scheme providing financial support to farmers in case of crop loss due to natural calamities', 'agriculture', ARRAY['Aadhar Card', 'Land Records', 'Bank Account', 'Sowing Certificate'], ARRAY['farmers'], '{"occupation": "farmer", "description": "All farmers growing notified crops"}'),

('मृदा स्वास्थ्य कार्ड योजना', 'Soil Health Card Scheme', 'मिट्टी की जांच और उर्वरक सुझाव', 'Soil testing and providing health cards with crop-wise recommendations for nutrients and fertilizers', 'agriculture', ARRAY['Aadhar Card', 'Land Records'], ARRAY['farmers'], '{"occupation": "farmer", "description": "All farmers across India"}'),

('किसान क्रेडिट कार्ड योजना', 'Kisan Credit Card Scheme', 'किसानों को कम ब्याज पर ऋण सुविधा', 'Short-term credit to farmers at subsidized interest rate of 4% for crop production and other needs', 'agriculture', ARRAY['Aadhar Card', 'Land Records', 'Bank Account', 'Passport Photo', 'Identity Proof'], ARRAY['farmers'], '{"occupation": "farmer", "description": "All farmers, fishermen, and animal husbandry farmers"}'),

('राष्ट्रीय कृषि बाजार (e-NAM)', 'National Agriculture Market (e-NAM)', 'ऑनलाइन मंडी में फसल बेचने की सुविधा', 'Pan-India electronic trading portal linking existing APMC mandis to create unified national market for agricultural commodities', 'agriculture', ARRAY['Aadhar Card', 'Bank Account', 'Mobile Number'], ARRAY['farmers', 'traders'], '{"description": "Farmers, traders, and buyers across India"}'),

('पीएम कृषि सिंचाई योजना', 'PM Krishi Sinchai Yojana', 'सिंचाई सुविधाओं का विस्तार - हर खेत को पानी', 'Ensuring access to irrigation for every farm (Har Khet Ko Pani) with micro-irrigation and watershed development', 'agriculture', ARRAY['Aadhar Card', 'Land Records', 'Bank Account'], ARRAY['farmers'], '{"occupation": "farmer", "description": "All farmers with focus on water-scarce areas"}');
