from rest_framework import serializers
from .models import User, EmailWhitelist
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError






class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

    

        is_oldUser = User.objects.filter(username = username).exists()
        

        if not is_oldUser:
            user = User(username = username)
            user.set_password(password)
            user.save()
        else:
            user = authenticate(username=username, password=password)


        if not user:
            raise ValidationError({'password': 'Invalid password'})
        
        if not user.is_active:
            raise ValidationError({"email":'Account is deactivated'})
        
        whitelist_check = EmailWhitelist.objects.filter(username = username).exists()
        if whitelist_check:
            user.role = "matchmaker"
            user.save()
        
        attrs['user'] = user
        return attrs




