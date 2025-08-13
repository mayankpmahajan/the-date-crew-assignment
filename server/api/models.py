from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from .constants import *
 
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.signals import post_save
from django.dispatch import receiver


class AdvancedMatchmakingEngine:
    """
    Research-driven matrimonial matching engine based on comprehensive 
    behavioral and preference data for Indian professionals
    """
    
    # Gender-specific parameter weights (as percentages)
    MALE_WEIGHTS = {
        'age': 15,
        'income': 9,
        'caste_religion': 15,
        'location_relocate': 9,
        'want_kids': 14,
        'education': 5,
        'company_designation': 8,
        'marital_status': 7,
        'siblings': 3,
        'languages': 4,
        'height': 7,
        'open_to_pets': 4
    }
    
    FEMALE_WEIGHTS = {
        'age': 12,
        'income': 12,
        'caste_religion': 14,
        'location_relocate': 6,
        'want_kids': 14,
        'education': 6,
        'company_designation': 10,
        'marital_status': 7,
        'siblings': 5,
        'languages': 3,
        'height': 8,
        'open_to_pets': 3
    }
    
    # Education hierarchy for better matching
    EDUCATION_HIERARCHY = {
        # Doctorate/Medical (Level 6)
        'phd': 6, 'md': 6, 'dm': 6, 'mch': 6, 'ms_medical': 6,
        
        # Masters/Professional (Level 5)
        'mtech': 5, 'me': 5, 'ms': 5, 'mba': 5, 'mba_finance': 5, 
        'mba_marketing': 5, 'mba_hr': 5, 'mba_operations': 5, 'mba_it': 5,
        'pgdm': 5, 'msc': 5, 'mcom': 5, 'ma': 5, 'mca': 5, 'llm': 5,
        'med': 5, 'mpharm': 5, 'mds': 5, 'march': 5, 'mdes': 5,
        
        # Professional Bachelor's (Level 4)
        'mbbs': 4, 'btech': 4, 'be': 4, 'btech_cse': 4, 'btech_ece': 4,
        'btech_eee': 4, 'btech_mech': 4, 'btech_civil': 4, 'btech_chemical': 4,
        'btech_it': 4, 'llb': 4, 'bpharm': 4, 'bds': 4, 'barch': 4, 'bvsc': 4,
        'bca': 4,
        
        # Regular Bachelor's (Level 3)
        'bsc': 3, 'bcom': 3, 'ba': 3, 'bba': 3, 'bcom_honours': 3,
        'bsc_physics': 3, 'bsc_chemistry': 3, 'bsc_cs': 3, 'bsc_it': 3,
        'ba_english': 3, 'ba_economics': 3, 'bed': 3, 'bfa': 3,
        
        # Diplomas (Level 2)
        'diploma': 2, 'polytechnic': 2, 'iti': 2,
        
        # School (Level 1)
        '12th': 1,
        
        # Generic
        'graduation': 3, 'postgraduation': 5, 'other': 3
    }
    
    # High-prestige companies for company scoring
    PRESTIGE_COMPANIES = [
        'google', 'microsoft', 'apple', 'amazon', 'meta', 'netflix', 'tesla',
        'goldman sachs', 'jp morgan', 'morgan stanley', 'blackrock',
        'mckinsey', 'bain', 'bcg', 'deloitte', 'pwc', 'kpmg', 'ey',
        'tcs', 'infosys', 'wipro', 'hcl', 'tech mahindra', 'cognizant',
        'reliance', 'tata', 'adani', 'bajaj', 'mahindra', 'birla'
    ]
    
    # Senior designations
    SENIOR_DESIGNATIONS = [
        'director', 'vp', 'vice president', 'ceo', 'cto', 'cfo', 'founder',
        'co-founder', 'head', 'lead', 'principal', 'senior manager', 'manager'
    ]



class MatchMaker(AbstractUser):

    USERNAME_FIELD = 'username'  
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
    class Meta:
        db_table = 'api_matchmaker'
    

class User(models.Model):
   
    
    # Basic Information
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    
    matchmaker = models.ForeignKey(
        MatchMaker, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_users'  # This allows matchmaker.assigned_users.all()
    )
    
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
    
    


    def __str__(self):
        return f"{self.email}"
    
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
    name = models.CharField(max_length=50, choices=LANGUAGE_CHOICES, unique=True)
    
    def __str__(self):
        return self.get_name_display()
    
    class Meta:
        verbose_name = "Language"
        verbose_name_plural = "Languages"


@receiver(post_save, sender=MatchMaker)
def assign_users_to_new_matchmaker_bulk(sender, instance, created, **kwargs):
    """
    More efficient version using bulk_update
    """
    if created:
        # Get up to 10 unassigned users
        unassigned_users = list(User.objects.filter(matchmaker__isnull=True)[:10])
        
        # Assign matchmaker to all users
        for user in unassigned_users:
            user.matchmaker = instance
        
        # Bulk update for better performance
        if unassigned_users:
            User.objects.bulk_update(unassigned_users, ['matchmaker'])
            print(f"Assigned {len(unassigned_users)} users to MatchMaker: {instance.username}")