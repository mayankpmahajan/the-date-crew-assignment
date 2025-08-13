from .models import *
from .serializers import *
from .utils import generate_jwt_tokens
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status, generics
from rest_framework.response import Response
from .authentication import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q, F
from math import radians, cos, sin, asin, sqrt
from datetime import datetime, timedelta
from django.utils import timezone
import operator
from functools import reduce


class LoginView(generics.CreateAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]
    authentication_classes = [JWTAuthentication]


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']

        token = generate_jwt_tokens(user)
        
        return Response({'token': token}, status=status.HTTP_201_CREATED)

class UsersView(APIView):
    """
    DRF APIView to get users assigned to the authenticated matchmaker
    """
    permission_classes = [IsMatchMaker]
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        try:
            matchmaker = request.user
            

            
            user_id = request.query_params.get('id')
            
            if user_id:
                return self._get_single_user(matchmaker, user_id)
            else:
                return self._get_all_users(matchmaker)
        
        except Exception as e:
            return Response({
                'error': f'Internal server error: {str(e)}',
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_single_user(self, matchmaker, user_id):
        """Get a specific user assigned to the matchmaker"""
        try:
            user = User.objects.get(id=user_id, matchmaker=matchmaker)
            serializer = UserSerializer(user)
            
            return Response({
                'status': 'success',
                'data': serializer.data
            })
        
        except User.DoesNotExist:
            return Response({
                'error': 'User not found or not assigned to you',
                'status': 'error'
            }, status=status.HTTP_404_NOT_FOUND)
    
    def _get_all_users(self, matchmaker):
        """Get all users assigned to the matchmaker"""
        users = matchmaker.assigned_users.all().order_by('created_at')
        serializer = UserSerializer(users, many=True)
        
        return Response({
            'status': 'success',
            'matchmaker': {
                'id': matchmaker.id,
                'username': matchmaker.username
            },
            'total_users': users.count(),
            'data': serializer.data
        })


class MatchesView(APIView):
    """
    APIView to get potential matches for a specific user
    GET /api/v1/matches/?id=123
    """
    permission_classes = [IsMatchMaker]
    
    def get(self, request):
        try:
            matchmaker = request.user
            user_id = request.query_params.get('id')
            
            if not user_id:
                return Response({
                    'error': 'User ID is required',
                    'status': 'error'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            return self._get_matches_for_user(matchmaker, user_id)
        
        except Exception as e:
            return Response({
                'error': f'Internal server error: {str(e)}',
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _get_matches_for_user(self, matchmaker, user_id):
        """Get potential matches for a specific user"""
        try:
            # Get the target user (must be assigned to this matchmaker)
            target_user = User.objects.get(id=user_id, matchmaker=matchmaker)
        except User.DoesNotExist:
            return Response({
                'error': 'User not found or not assigned to you',
                'status': 'error'
            }, status=status.HTTP_404_NOT_FOUND)
        except ValueError:
            return Response({
                'error': 'Invalid user ID',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Find potential matches
        potential_matches = self._find_potential_matches(target_user)
        
        # Calculate match scores and sort
        scored_matches = self._calculate_match_scores(target_user, potential_matches)
        
        # Get top 101 matches
        top_matches = scored_matches[:101]
        
        # Serialize the results
        serializer = MatchSerializer(top_matches, many=True)
        
        return Response({
            'status': 'success',
            'target_user': {
                'id': target_user.id,
                'name': target_user.name,
                'age': target_user.age,
                'gender': target_user.gender,
                'interested_in': target_user.interested_in
            },
            'total_potential_matches': len(potential_matches),
            'returned_matches': len(top_matches),
            'matches': serializer.data
        })
    
    def _find_potential_matches(self, target_user):
        """Find users that could be potential matches based on basic criteria"""
        # Base queryset - exclude the target user
        queryset = User.objects.exclude(id=target_user.id)
        
        # Gender compatibility filter
        gender_filter = self._get_gender_compatibility_filter(target_user)
        queryset = queryset.filter(gender_filter)
        
        # Age preference filter
        queryset = queryset.filter(
            age__gte=target_user.min_age_preference,
            age__lte=target_user.max_age_preference,
            min_age_preference__lte=target_user.age,
            max_age_preference__gte=target_user.age
        )
        
        # Optionally filter by same matchmaker's users only
        # queryset = queryset.filter(matchmaker=target_user.matchmaker)
        
        # Or filter by all users (for broader matching)
        queryset = queryset.filter(matchmaker__isnull=False)
        
        return list(queryset.select_related('matchmaker'))
    
    
    def _get_gender_compatibility_filter(self, target_user):
        """Return Q filter for users of the opposite gender only"""
        if target_user.gender == 'M':
            return Q(gender='F')
        elif target_user.gender == 'F':
            return Q(gender='M')
        else:
            return Q() 
        """Create gender compatibility filter based on user's interests"""
        filters = []
        
        if target_user.interested_in == 'M':
            filters.append(Q(gender='M', interested_in__in=['F', 'B']) | 
                          Q(gender='M', interested_in='B'))
        elif target_user.interested_in == 'F':
            filters.append(Q(gender='F', interested_in__in=['M', 'B']) | 
                          Q(gender='F', interested_in='B'))
        elif target_user.interested_in == 'B':
            filters.append(Q(gender__in=['M', 'F'], interested_in__in=['B']) |
                          Q(gender='M', interested_in='F') |
                          Q(gender='F', interested_in='M'))
        
        # Handle the case where target user's gender should match the other's interest
        if target_user.gender == 'M':
            filters.append(Q(interested_in__in=['M', 'B']))
        elif target_user.gender == 'F':
            filters.append(Q(interested_in__in=['F', 'B']))
        
        return reduce(operator.or_, filters) if filters else Q()
    
    def _calculate_match_scores(self, target_user, potential_matches):
        """Calculate match scores for all potential matches"""
        scored_matches = []
        
        for match in potential_matches:
            score, reasons = self._calculate_individual_match_score(target_user, match)
            
            # Add calculated fields to the match object
            match.match_score = score
            match.compatibility_reasons = reasons
            match.distance_km = self._calculate_distance(target_user, match)
            match.profile_completeness = match.profile_completeness
            
            scored_matches.append(match)
        
        # Sort by match score (descending)
        scored_matches.sort(key=lambda x: x.match_score, reverse=True)
        
        return scored_matches
    
    def _calculate_individual_match_score(self, user1, user2):
        """Calculate match score between two users"""
        score = 0.0
        reasons = []
        
        # 1. Age compatibility (0-20 points)
        age_score = self._calculate_age_compatibility(user1, user2)
        score += age_score
        if age_score > 15:
            reasons.append("Great age compatibility")
        elif age_score > 10:
            reasons.append("Good age match")
        
        # 2. Location proximity (0-15 points)
        location_score = self._calculate_location_score(user1, user2)
        score += location_score
        if location_score > 10:
            reasons.append("Lives nearby")
        elif location_score > 5:
            reasons.append("Reasonable distance")
        
        # 3. Interest similarity (0-20 points)
        interest_score = self._calculate_interest_similarity(user1, user2)
        score += interest_score
        if interest_score > 15:
            reasons.append("Many shared interests")
        elif interest_score > 10:
            reasons.append("Some common interests")
        
        # 4. Profile completeness (0-10 points)
        completeness_score = min(user2.profile_completeness / 10, 10)
        score += completeness_score
        if completeness_score > 8:
            reasons.append("Detailed profile")
        
        # 5. Activity level (0-10 points)
        activity_score = self._calculate_activity_score(user2)
        score += activity_score
        if activity_score > 7:
            reasons.append("Active user")
        
        # 6. Education/Career compatibility (0-10 points)
        career_score = self._calculate_career_compatibility(user1, user2)
        score += career_score
        if career_score > 7:
            reasons.append("Similar background")
        
        # 7. Popularity factor (0-15 points)
        popularity_score = self._calculate_popularity_score(user2)
        score += popularity_score
        if popularity_score > 10:
            reasons.append("Popular profile")
        
        return round(score, 2), reasons
    
    def _calculate_age_compatibility(self, user1, user2):
        """Calculate age compatibility score"""
        age_diff = abs(user1.age - user2.age)
        if age_diff <= 2:
            return 20
        elif age_diff <= 5:
            return 15
        elif age_diff <= 10:
            return 10
        elif age_diff <= 15:
            return 5
        else:
            return 0
    
    def _calculate_location_score(self, user1, user2):
        """Calculate location-based score"""
        distance = self._calculate_distance(user1, user2)
        if distance is None:
            return 5  # Default score if no location data
        
        if distance <= 5:
            return 15
        elif distance <= 15:
            return 12
        elif distance <= 30:
            return 8
        elif distance <= 50:
            return 4
        else:
            return 0
    
    def _calculate_distance(self, user1, user2):
        """Calculate distance between two users using Haversine formula"""
        if not all([user1.latitude, user1.longitude, user2.latitude, user2.longitude]):
            return None
        
        # Haversine formula
        lat1, lon1 = radians(user1.latitude), radians(user1.longitude)
        lat2, lon2 = radians(user2.latitude), radians(user2.longitude)
        
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        r = 6371  # Earth's radius in kilometers
        
        return round(c * r, 2)
    
    def _calculate_interest_similarity(self, user1, user2):
        """Calculate interest similarity score"""
        if not user1.interests or not user2.interests:
            return 5  # Default score if no interests listed
        
        interests1 = set(interest.strip().lower() for interest in user1.interests.split(','))
        interests2 = set(interest.strip().lower() for interest in user2.interests.split(','))
        
        if not interests1 or not interests2:
            return 5
        
        common_interests = interests1.intersection(interests2)
        total_interests = interests1.union(interests2)
        
        if total_interests:
            similarity_ratio = len(common_interests) / len(total_interests)
            return round(similarity_ratio * 20, 2)
        
        return 5
    
    def _calculate_activity_score(self, user):
        """Calculate activity score based on last active time"""
        if not user.last_active:
            return 0
        
        time_diff = timezone.now() - user.last_active
        
        if time_diff <= timedelta(hours=24):
            return 10
        elif time_diff <= timedelta(days=3):
            return 7
        elif time_diff <= timedelta(weeks=1):
            return 4
        elif time_diff <= timedelta(weeks=2):
            return 2
        else:
            return 0
    
    def _calculate_career_compatibility(self, user1, user2):
        """Calculate career/education compatibility"""
        score = 0
        
        # Education similarity
        if user1.education and user2.education:
            if user1.education.lower() == user2.education.lower():
                score += 5
            elif any(word in user2.education.lower() for word in user1.education.lower().split()):
                score += 3
        
        # Occupation similarity  
        if user1.occupation and user2.occupation:
            if user1.occupation.lower() == user2.occupation.lower():
                score += 5
            elif any(word in user2.occupation.lower() for word in user1.occupation.lower().split()):
                score += 2
        
        return min(score, 10)
    
    def _calculate_popularity_score(self, user):
        """Calculate popularity score based on profile metrics"""
        score = 0
        
        # Likes received factor
        if user.likes_received > 100:
            score += 10
        elif user.likes_received > 50:
            score += 7
        elif user.likes_received > 20:
            score += 5
        elif user.likes_received > 5:
            score += 3
        
        # Profile views factor
        if user.profile_views > 500:
            score += 5
        elif user.profile_views > 100:
            score += 3
        elif user.profile_views > 50:
            score += 1
        
        return min(score, 15)
