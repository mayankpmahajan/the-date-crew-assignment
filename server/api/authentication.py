from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from django.contrib.auth.models import AnonymousUser
from .utils import get_user_from_token
from rest_framework.authentication import BaseAuthentication
from rest_framework.permissions import BasePermission
from .models import *


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
            
        token = auth_header.split(' ')[1]
        user = get_user_from_token(token)
        
        if user:
            return (user, token)  # Return (user, auth) tuple
        
        return None  # Return None for anonymous users

    def authenticate_header(self, request):
        return 'Bearer'
    
    
class IsMatchMaker(BasePermission):
    def has_permission(self, request, view):
        return (request.user and 
                hasattr(request.user, 'is_authenticated') and 
                request.user.is_authenticated and 
                isinstance(request.user, MatchMaker))