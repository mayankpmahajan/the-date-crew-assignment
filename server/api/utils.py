import jwt
from datetime import datetime
from django.conf import settings
from .models import *


def generate_jwt_tokens(user):
    access_payload = {
        'user_id': user.id,
        'exp': datetime.now() + settings.JWT_ACCESS_TOKEN_LIFETIME,
    }
    
    access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm='HS256')
    
    return access_token


def decode_jwt_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        return payload
    except Exception as e:
        print("error", e)
        return None


def get_user_from_token(token):
    payload = decode_jwt_token(token)
    print("payload:", payload)
    if payload:
        try:
            user = MatchMaker.objects.get(id=payload['user_id'])
            return user
        except User.DoesNotExist:
            return None
    return None


