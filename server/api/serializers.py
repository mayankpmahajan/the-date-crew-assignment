from rest_framework import serializers
from .models import MatchMaker, User
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError






class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        is_oldUser = MatchMaker.objects.filter(username = username).exists()
        
        if not is_oldUser:
            user = MatchMaker(username = username)
            user.set_password(password)
            user.save()
        else:
            user = authenticate(username=username, password=password)


        if not user:
            raise ValidationError({'password': 'Invalid password'})
        
        if not user.is_active:
            raise ValidationError({"email":'Account is deactivated'})
        
        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    matchmaker_info = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id',
            'first_name',
            'last_name',
            'gender',
            'date_of_birth',
            'matchmaker',
            'matchmaker_info',
            'country',
            'city',
            'height',
            'email',
            'phone_number',
            'undergraduate_college',
            'degree',
            'income',
            'current_company',
            'designation',
            'marital_status',
            'languages_known',
            'siblings',
            'caste',
            'religion',
            'want_kids',
            'open_to_relocate',
            'open_to_pets',
            'created_at',
            'updated_at',
            'age',
        ]

    
    def get_matchmaker_info(self, obj):
        if obj.matchmaker:
            return {
                'id': obj.matchmaker.id,
                'username': obj.matchmaker.username
            }
        return None
    
class MatchSerializer(serializers.ModelSerializer):
    match_score = serializers.FloatField(read_only=True)
    compatibility_reasons = serializers.ListField(read_only=True)
    distance_km = serializers.FloatField(read_only=True, allow_null=True)
    profile_completeness = serializers.FloatField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'name', 'age', 'bio', 'gender', 'city', 'education', 
            'occupation', 'interests', 'profile_picture', 'last_active',
            'match_score', 'compatibility_reasons', 'distance_km', 'profile_completeness'
        ]