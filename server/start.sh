#!/bin/bash
python manage.py migrate --noinput
gunicorn assignment.wsgi:application --bind 0.0.0.0:8000
