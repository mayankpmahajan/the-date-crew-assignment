import jwt
from datetime import datetime
from django.conf import settings
from ...models import *
import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from faker import Faker
fake = Faker()

class Command(BaseCommand):
    help = "Create 100 dummy User profiles with randomized data"

    def handle(self, *args, **kwargs):
        # Ensure some languages exist in the DB
        self.stdout.write(self.style.WARNING("Checking/Creating languages..."))
        for lang_code, _ in LANGUAGE_CHOICES:
            Language.objects.get_or_create(name=lang_code)

        users_to_create = []
        for _ in range(100):
            first_name = fake.first_name()
            last_name = fake.last_name()
            gender = random.choice([c[0] for c in GENDER_CHOICES])
            dob = date.today() - timedelta(days=random.randint(20*365, 50*365))  # age 20-50
            country = fake.country()
            city = fake.city()
            height = round(random.uniform(1.5, 2.0), 2)  # meters
            email = fake.unique.email()
            phone_number = fake.phone_number()
            undergraduate_college = fake.company() + " University"
            degree = random.choice([c[0] for c in DEGREE_CHOICES])
            income = round(random.uniform(300000, 3000000), 2)  # in local currency
            current_company = fake.company()
            designation = fake.job()
            marital_status = random.choice([c[0] for c in MARITAL_STATUS_CHOICES])
            siblings = random.randint(0, 4)
            caste = random.choice([c[0] for c in CASTE_CHOICES])
            religion = random.choice([c[0] for c in RELIGION_CHOICES])
            want_kids = random.choice([c[0] for c in YES_NO_MAYBE_CHOICES])
            open_to_relocate = random.choice([c[0] for c in YES_NO_MAYBE_CHOICES])
            open_to_pets = random.choice([c[0] for c in YES_NO_MAYBE_CHOICES])

            user = User(
                first_name=first_name,
                last_name=last_name,
                gender=gender,
                date_of_birth=dob,
                country=country,
                city=city,
                height=height,
                email=email,
                phone_number=phone_number,
                undergraduate_college=undergraduate_college,
                degree=degree,
                income=income,
                current_company=current_company,
                designation=designation,
                marital_status=marital_status,
                siblings=siblings,
                caste=caste,
                religion=religion,
                want_kids=want_kids,
                open_to_relocate=open_to_relocate,
                open_to_pets=open_to_pets
            )
            users_to_create.append(user)

        created_users = User.objects.bulk_create(users_to_create)

        # Add random languages to each user
        all_languages = list(Language.objects.all())
        for user in created_users:
            langs = random.sample(all_languages, k=random.randint(1, 4))
            user.languages_known.set(langs)

        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(created_users)} dummy users successfully!"))