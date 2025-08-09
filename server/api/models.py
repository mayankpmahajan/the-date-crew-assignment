from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

 
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

ROLE_CHOICES = [
        ('user', 'User'),
        ('matchmaker', 'Matchmaker'),
        ('admin', 'Admin'),
    ]

class EmailWhitelist(models.Model):
    username = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.username



class User(AbstractUser):
    # Choice fields
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
    
    # Basic Information
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    role = models.CharField(max_length=128, choices=ROLE_CHOICES, default='user')
    
    # Location
    country = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    
    # Physical
    height = models.FloatField(
        validators=[MinValueValidator(0.5), MaxValueValidator(3.0)],
        help_text="Height in meters (e.g., 1.75)",
        null=True, blank=True
    )
    
    # Contact Information
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    
    # Education & Career
    undergraduate_college = models.CharField(max_length=200, null=True, blank=True)
    degree = models.CharField(max_length=50, choices=DEGREE_CHOICES, null=True, blank=True)
    income = models.DecimalField(
        max_digits=12, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Annual income in your local currency",
        
    )
    current_company = models.CharField(max_length=200, blank=True, null=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    
    # Personal Details
    marital_status = models.CharField(max_length=20, choices=MARITAL_STATUS_CHOICES, null=True, blank=True)
    languages_known = models.ManyToManyField(
        'Language',
        blank=True,
        help_text="Select languages you know"
    )
    siblings = models.PositiveIntegerField(
        default=0,
        validators=[MaxValueValidator(20)]
    )
    
    # Cultural Background
    caste = models.CharField(max_length=50, choices=CASTE_CHOICES, blank=True, null=True)
    religion = models.CharField(max_length=50, choices=RELIGION_CHOICES, blank=True, null=True)
    
    # Preferences
    want_kids = models.CharField(max_length=10, choices=YES_NO_MAYBE_CHOICES, null=True, blank=True)
    open_to_relocate = models.CharField(max_length=10, choices=YES_NO_MAYBE_CHOICES, null=True, blank=True)
    open_to_pets = models.CharField(max_length=10, choices=YES_NO_MAYBE_CHOICES, null=True, blank=True)
    
    # System fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
    # Handle Django auth conflicts
    groups = models.ManyToManyField(
        Group,
        related_name='matrimonial_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='matrimonial_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )

    def __str__(self):
        return f"{self.username}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def age(self):
        from datetime import date
        today = date.today()
        return today.year - self.date_of_birth.year - ((today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day))
    
    @property
    def height_display(self):
        """Convert height to feet and inches for display"""
        feet = int(self.height * 3.28084)
        inches = round((self.height * 3.28084 - feet) * 12)
        return f"{feet}'{inches}\""
    
    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"


class Language(models.Model):
    """Separate model for languages to support many-to-many relationship"""
    name = models.CharField(max_length=50, choices=User.LANGUAGE_CHOICES, unique=True)
    
    def __str__(self):
        return self.get_name_display()
    
    class Meta:
        verbose_name = "Language"
        verbose_name_plural = "Languages"


