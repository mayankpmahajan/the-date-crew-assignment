
GENDER_CHOICES = [
        

        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]
    
MARITAL_STATUS_CHOICES = [
        
        ('single', 'Single'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed'),
        ('separated', 'Separated'),
    ]
    
YES_NO_MAYBE_CHOICES = [
        ('yes', 'Yes'),
        ('no', 'No'),
        ('maybe', 'Maybe'),
    ]
    
RELIGION_CHOICES = [
        ('hinduism', 'Hinduism'),
        ('islam', 'Islam'),
        ('christianity', 'Christianity'),
        ('sikhism', 'Sikhism'),
        ('buddhism', 'Buddhism'),
        ('jainism', 'Jainism'),
        ('zoroastrianism', 'Zoroastrianism'),
        ('judaism', 'Judaism'),
        ('bahai', 'Baháʼí Faith'),
        ('atheist', 'Atheist'),
        ('agnostic', 'Agnostic'),
        ('spiritual', 'Spiritual but not religious'),
        ('other', 'Other'),
    ]
    
CASTE_CHOICES = [
        # General/Unreserved
        ('general', 'General'),
        ('brahmin', 'Brahmin'),
        ('kshatriya', 'Kshatriya'),
        ('vaishya', 'Vaishya'),
        ('kayastha', 'Kayastha'),
        ('bhumihar', 'Bhumihar'),
        ('rajput', 'Rajput'),
        ('baniya', 'Baniya'),
        ('khatri', 'Khatri'),
        ('arora', 'Arora'),
        ('agarwal', 'Agarwal'),
        ('marwari', 'Marwari'),
        ('sindhi', 'Sindhi'),
        
        # OBC (Other Backward Classes)
        ('obc', 'OBC'),
        ('yadav', 'Yadav'),
        ('kurmi', 'Kurmi'),
        ('jat', 'Jat'),
        ('gujjar', 'Gujjar'),
        ('ahir', 'Ahir'),
        ('mali', 'Mali'),
        ('teli', 'Teli'),
        ('sonar', 'Sonar'),
        ('kumhar', 'Kumhar'),
        ('nai', 'Nai'),
        ('dhobi', 'Dhobi'),
        
        # SC (Scheduled Caste)
        ('sc', 'SC'),
        ('chamar', 'Chamar'),
        ('balmiki', 'Balmiki'),
        ('mahar', 'Mahar'),
        ('mang', 'Mang'),
        ('matang', 'Matang'),
        ('dom', 'Dom'),
        ('musahar', 'Musahar'),
        
        # ST (Scheduled Tribe)
        ('st', 'ST'),
        ('gond', 'Gond'),
        ('bhil', 'Bhil'),
        ('santhal', 'Santhal'),
        ('munda', 'Munda'),
        ('oraon', 'Oraon'),
        ('ho', 'Ho'),
        ('khasi', 'Khasi'),
        ('garo', 'Garo'),
        
        # Regional specific
        ('reddy', 'Reddy'),
        ('kamma', 'Kamma'),
        ('kapu', 'Kapu'),
        ('nair', 'Nair'),
        ('menon', 'Menon'),
        ('iyer', 'Iyer'),
        ('iyengar', 'Iyengar'),
        ('naidu', 'Naidu'),
        ('chettiar', 'Chettiar'),
        ('pillai', 'Pillai'),
        ('gounder', 'Gounder'),
        ('mudaliar', 'Mudaliar'),
        ('patel', 'Patel'),
        ('shah', 'Shah'),
        ('thakkar', 'Thakkar'),
        
        # Don't specify
        ('no_preference', 'No Preference'),
        ('other', 'Other'),
    ]
    
LANGUAGE_CHOICES = [
        # Official Languages of India
        ('hindi', 'Hindi'),
        ('english', 'English'),
        
        # Scheduled Languages
        ('assamese', 'Assamese'),
        ('bengali', 'Bengali'),
        ('gujarati', 'Gujarati'),
        ('kannada', 'Kannada'),
        ('kashmiri', 'Kashmiri'),
        ('konkani', 'Konkani'),
        ('malayalam', 'Malayalam'),
        ('manipuri', 'Manipuri'),
        ('marathi', 'Marathi'),
        ('nepali', 'Nepali'),
        ('odia', 'Odia'),
        ('punjabi', 'Punjabi'),
        ('sanskrit', 'Sanskrit'),
        ('sindhi', 'Sindhi'),
        ('tamil', 'Tamil'),
        ('telugu', 'Telugu'),
        ('urdu', 'Urdu'),
        ('bodo', 'Bodo'),
        ('santhali', 'Santhali'),
        ('maithili', 'Maithili'),
        ('dogri', 'Dogri'),
        
        # Other Indian Languages
        ('bhojpuri', 'Bhojpuri'),
        ('magahi', 'Magahi'),
        ('awadhi', 'Awadhi'),
        ('haryanvi', 'Haryanvi'),
        ('rajasthani', 'Rajasthani'),
        ('tulu', 'Tulu'),
        ('kodava', 'Kodava'),
        ('garo', 'Garo'),
        ('khasi', 'Khasi'),
        ('mizo', 'Mizo'),
        ('nagamese', 'Nagamese'),
        
        # International Languages
        ('arabic', 'Arabic'),
        ('french', 'French'),
        ('german', 'German'),
        ('spanish', 'Spanish'),
        ('portuguese', 'Portuguese'),
        ('chinese', 'Chinese'),
        ('japanese', 'Japanese'),
        ('korean', 'Korean'),
        ('russian', 'Russian'),
        ('italian', 'Italian'),
        ('dutch', 'Dutch'),
        ('swedish', 'Swedish'),
        ('norwegian', 'Norwegian'),
        ('danish', 'Danish'),
        ('thai', 'Thai'),
        ('vietnamese', 'Vietnamese'),
        ('indonesian', 'Indonesian'),
        ('malay', 'Malay'),
        ('persian', 'Persian'),
        ('turkish', 'Turkish'),
        ('hebrew', 'Hebrew'),
        ('swahili', 'Swahili'),
        ('greek', 'Greek'),
        
        ('other', 'Other'),
    ]
    
DEGREE_CHOICES = [
        # Undergraduate Degrees
        # Engineering
        ('btech', 'B.Tech'),
        ('be', 'B.E.'),
        ('btech_cse', 'B.Tech Computer Science'),
        ('btech_ece', 'B.Tech Electronics & Communication'),
        ('btech_eee', 'B.Tech Electrical & Electronics'),
        ('btech_mech', 'B.Tech Mechanical'),
        ('btech_civil', 'B.Tech Civil'),
        ('btech_chemical', 'B.Tech Chemical'),
        ('btech_it', 'B.Tech Information Technology'),
        
        # Science
        ('bsc', 'B.Sc.'),
        ('bsc_physics', 'B.Sc. Physics'),
        ('bsc_chemistry', 'B.Sc. Chemistry'),
        ('bsc_mathematics', 'B.Sc. Mathematics'),
        ('bsc_biology', 'B.Sc. Biology'),
        ('bsc_botany', 'B.Sc. Botany'),
        ('bsc_zoology', 'B.Sc. Zoology'),
        ('bsc_microbiology', 'B.Sc. Microbiology'),
        ('bsc_biotechnology', 'B.Sc. Biotechnology'),
        ('bsc_cs', 'B.Sc. Computer Science'),
        ('bsc_it', 'B.Sc. Information Technology'),
        ('bsc_statistics', 'B.Sc. Statistics'),
        ('bsc_geology', 'B.Sc. Geology'),
        ('bsc_geography', 'B.Sc. Geography'),
        
        # Commerce
        ('bcom', 'B.Com'),
        ('bcom_honours', 'B.Com (Honours)'),
        ('bba', 'BBA'),
        
        # Arts & Humanities
        ('ba', 'B.A.'),
        ('ba_english', 'B.A. English'),
        ('ba_hindi', 'B.A. Hindi'),
        ('ba_history', 'B.A. History'),
        ('ba_political_science', 'B.A. Political Science'),
        ('ba_economics', 'B.A. Economics'),
        ('ba_sociology', 'B.A. Sociology'),
        ('ba_psychology', 'B.A. Psychology'),
        ('ba_philosophy', 'B.A. Philosophy'),
        ('ba_journalism', 'B.A. Journalism'),
        
        # Professional Courses
        ('bca', 'BCA'),
        ('bcs', 'BCS'),
        ('llb', 'LLB'),
        ('bjmc', 'BJMC'),
        ('bfa', 'BFA'),
        ('bed', 'B.Ed'),
        ('bpharm', 'B.Pharm'),
        ('bds', 'BDS'),
        ('bhms', 'BHMS'),
        ('bams', 'BAMS'),
        ('bnys', 'BNYS'),
        ('bpt', 'BPT'),
        ('bvsc', 'BVSc'),
        ('barch', 'B.Arch'),
        ('bdes', 'B.Des'),
        ('bhtm', 'BHTM'),
        ('bmm', 'BMM'),
        
        # Medical
        ('mbbs', 'MBBS'),
        
        # Postgraduate Degrees
        # Engineering
        ('mtech', 'M.Tech'),
        ('me', 'M.E.'),
        ('ms', 'M.S.'),
        
        # Management
        ('mba', 'MBA'),
        ('mba_finance', 'MBA Finance'),
        ('mba_marketing', 'MBA Marketing'),
        ('mba_hr', 'MBA HR'),
        ('mba_operations', 'MBA Operations'),
        ('mba_it', 'MBA IT'),
        ('pgdm', 'PGDM'),
        
        # Science
        ('msc', 'M.Sc.'),
        ('msc_physics', 'M.Sc. Physics'),
        ('msc_chemistry', 'M.Sc. Chemistry'),
        ('msc_mathematics', 'M.Sc. Mathematics'),
        ('msc_biology', 'M.Sc. Biology'),
        ('msc_cs', 'M.Sc. Computer Science'),
        ('msc_it', 'M.Sc. Information Technology'),
        ('msc_biotechnology', 'M.Sc. Biotechnology'),
        ('msc_statistics', 'M.Sc. Statistics'),
        
        # Commerce
        ('mcom', 'M.Com'),
        
        # Arts & Humanities
        ('ma', 'M.A.'),
        ('ma_english', 'M.A. English'),
        ('ma_hindi', 'M.A. Hindi'),
        ('ma_history', 'M.A. History'),
        ('ma_political_science', 'M.A. Political Science'),
        ('ma_economics', 'M.A. Economics'),
        ('ma_sociology', 'M.A. Sociology'),
        ('ma_psychology', 'M.A. Psychology'),
        
        # Professional
        ('mca', 'MCA'),
        ('llm', 'LLM'),
        ('med', 'M.Ed'),
        ('mpharm', 'M.Pharm'),
        ('mds', 'MDS'),
        ('march', 'M.Arch'),
        ('mdes', 'M.Des'),
        ('mjmc', 'MJMC'),
        ('mfa', 'MFA'),
        ('mpt', 'MPT'),
        ('mvsc', 'MVSc'),
        
        # Medical
        ('md', 'MD'),
        ('ms_medical', 'MS (Medical)'),
        ('dm', 'DM'),
        ('mch', 'MCh'),
        
        # Doctoral
        ('phd', 'Ph.D'),
        
        # Diplomas
        ('diploma', 'Diploma'),
        ('polytechnic', 'Polytechnic'),
        ('iti', 'ITI'),
        
        # Other
        ('12th', '12th Pass'),
        ('graduation', 'Graduate'),
        ('postgraduation', 'Post Graduate'),
        ('other', 'Other'),
    ]