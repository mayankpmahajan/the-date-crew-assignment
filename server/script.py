#!/usr/bin/env python
import os
import django
import sys

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'assignment.settings')
django.setup()

from api.llm.main import rag_compatibility_pipeline  # adjust if file path is different
from api.models import User

def main():
    
    target_user_id = 1
    selected_user_id = 2

    if User.objects.filter(id=target_user_id).exists() and User.objects.filter(id=selected_user_id).exists():
        result = rag_compatibility_pipeline(target_user_id, selected_user_id)
        print("\n--- Compatibility Result ---")
        print(result)
    else:
        print("One or both user IDs do not exist in the database.")

if __name__ == "__main__":
    main()
