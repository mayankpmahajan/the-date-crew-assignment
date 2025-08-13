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
from datetime import date
from django.shortcuts import get_object_or_404

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
    def calculate_comprehensive_score(self, target_user, candidate):
        """
        Comprehensive scoring based on research data with gender-specific weights
        """
        target_age = self._calculate_age(target_user.date_of_birth)
        candidate_age = self._calculate_age(candidate.date_of_birth)
        
        # Choose weights based on target user's gender (they're the one being matched)
        weights = self.MALE_WEIGHTS if target_user.gender == 'male' else self.FEMALE_WEIGHTS
        
        parameter_scores = {}
        insights = []
        risk_factors = []
        
        # 1. AGE COMPATIBILITY
        age_score = self._score_age_compatibility(target_user.gender, target_age, candidate_age)
        parameter_scores['age'] = age_score
        
        if age_score['score'] >= 0.8:
            insights.append(f"Excellent age match ({candidate_age} years)")
        elif age_score['score'] >= 0.4:
            insights.append(f"Acceptable age gap ({abs(target_age - candidate_age)} years)")
        else:
            risk_factors.append(f"Significant age gap ({abs(target_age - candidate_age)} years)")
        
        # 2. INCOME COMPATIBILITY
        income_score = self._score_income_compatibility(target_user, candidate)
        parameter_scores['income'] = income_score
        
        # 3. CASTE & RELIGION COMPATIBILITY
        cultural_score = self._score_cultural_compatibility(target_user, candidate)
        parameter_scores['caste_religion'] = cultural_score
        
        if cultural_score['score'] >= 0.8:
            insights.append("Strong cultural compatibility")
        elif cultural_score['score'] <= 0.3:
            risk_factors.append("Potential cultural differences")
        
        # 4. LOCATION & RELOCATION
        location_score = self._score_location_compatibility(target_user, candidate)
        parameter_scores['location_relocate'] = location_score
        
        # 5. CHILDREN PREFERENCES
        kids_score = self._score_kids_compatibility(target_user, candidate)
        parameter_scores['want_kids'] = kids_score
        
        if kids_score['score'] == 0:
            risk_factors.append("Incompatible views on having children")
        elif kids_score['score'] >= 0.8:
            insights.append("Aligned on family planning")
        
        # 6. EDUCATION COMPATIBILITY
        education_score = self._score_education_compatibility(target_user, candidate)
        parameter_scores['education'] = education_score
        
        # 7. CAREER COMPATIBILITY
        career_score = self._score_career_compatibility(target_user, candidate)
        parameter_scores['company_designation'] = career_score
        
        # 8. MARITAL STATUS
        marital_score = self._score_marital_status(target_user, candidate)
        parameter_scores['marital_status'] = marital_score
        
        # 9. FAMILY SIZE (SIBLINGS)
        family_score = self._score_family_compatibility(target_user, candidate)
        parameter_scores['siblings'] = family_score
        
        # 10. LANGUAGE COMPATIBILITY
        language_score = self._score_language_compatibility(target_user, candidate)
        parameter_scores['languages'] = language_score
        
        # 11. HEIGHT COMPATIBILITY
        height_score = self._score_height_compatibility(target_user, candidate)
        parameter_scores['height'] = height_score
        
        # 12. PETS COMPATIBILITY
        pets_score = self._score_pets_compatibility(target_user, candidate)
        parameter_scores['open_to_pets'] = pets_score
        
        # Calculate weighted total score using the research formula
        total_weighted_score = 0
        total_weights = sum(weights.values())
        
        for param, weight in weights.items():
            param_score = parameter_scores.get(param, {'score': 0})['score']
            weighted_contribution = (weight * param_score) / total_weights * 100
            total_weighted_score += weighted_contribution
        
        return {
            'total_score': total_weighted_score,
            'parameter_scores': parameter_scores,
            'insights': insights[:8],  # Top insights
            'risk_factors': risk_factors[:5]  # Top concerns
        }

    def _calculate_age(self, birth_date):
        """Calculate current age"""
        today = date.today()
        return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))

    def _score_age_compatibility(self, target_gender, target_age, candidate_age):
        """Research-based age compatibility scoring"""
        age_diff = candidate_age - target_age
        
        if target_gender == 'male':
            # Men prefer younger women (research: ~2 years younger preferred)
            if -5 <= age_diff <= 0:  # Woman 0-5 years younger
                score = 1.0
                reason = "Ideal age preference for men"
            elif -7 <= age_diff <= 2:  # Slightly outside range
                score = 0.7
                reason = "Acceptable age range"
            elif -10 <= age_diff <= 5:  # Outside but acceptable
                score = 0.4
                reason = "Outside preferred but acceptable"
            else:
                score = 0.0
                reason = "Far outside preferred age range"
        else:
            # Women prefer same age or slightly older men (research: ~2 years older)
            if 0 <= age_diff <= 5:  # Man 0-5 years older
                score = 1.0
                reason = "Ideal age preference for women"
            elif -2 <= age_diff <= 7:  # Slightly outside range
                score = 0.8
                reason = "Good age compatibility"
            elif -3 <= age_diff <= 10:  # Outside but acceptable
                score = 0.5
                reason = "Acceptable age difference"
            else:
                score = 0.0
                reason = "Significant age gap"
        
        return {'score': score, 'reason': reason, 'age_difference': age_diff}

    def _score_income_compatibility(self, target_user, candidate):
        """Income compatibility based on research insights"""
        if not target_user.income or not candidate.income:
            return {'score': 0.5, 'reason': 'Incomplete income information'}
        
        target_income = float(target_user.income)
        candidate_income = float(candidate.income)
        
        if target_user.gender == 'male':
            # Men less sensitive to partner's income, but stability matters
            if candidate_income >= target_income * 0.75:  # Within 25%
                score = 1.0
                reason = "Well-matched income levels"
            elif candidate_income >= target_income * 0.5:  # Within 50%
                score = 0.8
                reason = "Good financial compatibility"
            else:
                score = 0.5
                reason = "Income gap exists but manageable"
        else:
            # Women more sensitive to partner's income (hypergamy trend)
            if candidate_income >= target_income:  # Equal or higher
                score = 1.0
                reason = "Meets income expectations"
            elif candidate_income >= target_income * 0.9:  # Within 10%
                score = 0.8
                reason = "Close income match"
            elif candidate_income >= target_income * 0.75:  # Within 25%
                score = 0.5
                reason = "Acceptable income difference"
            else:
                score = 0.0
                reason = "Significant income gap"
        
        return {
            'score': score, 
            'reason': reason,
            'income_ratio': min(target_income, candidate_income) / max(target_income, candidate_income)
        }

    def _score_cultural_compatibility(self, target_user, candidate):
        """Caste and religion scoring based on research (90-95% within-caste marriages)"""
        religion_match = target_user.religion == candidate.religion if target_user.religion and candidate.religion else False
        caste_match = target_user.caste == candidate.caste if target_user.caste and candidate.caste else False
        
        if religion_match and caste_match:
            score = 1.0
            reason = "Perfect cultural match"
        elif religion_match and not caste_match:
            score = 0.5
            reason = "Same religion, different caste"
        elif not religion_match and caste_match:
            score = 0.3
            reason = "Same caste, different religion"
        elif target_user.religion == 'no_preference' or candidate.religion == 'no_preference':
            score = 0.4
            reason = "Flexible religious preferences"
        else:
            score = 0.0
            reason = "Different cultural background"
        
        # Adjust for modern flexibility
        if target_user.religion in ['atheist', 'agnostic', 'spiritual'] and candidate.religion in ['atheist', 'agnostic', 'spiritual']:
            score = max(score, 0.6)
            reason = "Compatible modern outlook"
        
        return {'score': score, 'reason': reason}

    def _score_location_compatibility(self, target_user, candidate):
        """Location and relocation scoring"""
        same_city = (target_user.city and candidate.city and 
                    target_user.city.lower() == candidate.city.lower())
        same_country = (target_user.country and candidate.country and 
                    target_user.country.lower() == candidate.country.lower())
        
        target_relocate = target_user.open_to_relocate == 'yes'
        candidate_relocate = candidate.open_to_relocate == 'yes'
        
        if same_city and same_country:
            score = 1.0
            reason = "Same location - no relocation needed"
        elif same_country and (target_relocate or candidate_relocate):
            score = 0.8 if target_user.gender == 'male' else 0.7
            reason = "Same country, willing to relocate"
        elif same_country:
            score = 0.6
            reason = "Same country, location discussion needed"
        elif target_relocate or candidate_relocate:
            score = 0.4
            reason = "International relocation possible"
        else:
            score = 0.0
            reason = "Location incompatibility"
        
        return {'score': score, 'reason': reason}

    def _score_kids_compatibility(self, target_user, candidate):
        """Children preference scoring - critical factor"""
        target_kids = target_user.want_kids
        candidate_kids = candidate.want_kids
        
        if not target_kids or not candidate_kids:
            return {'score': 0.5, 'reason': 'Incomplete children preference data'}
        
        if target_kids == candidate_kids:
            score = 1.0
            reason = f"Both {target_kids.lower()} about children"
        elif target_kids == 'maybe' or candidate_kids == 'maybe':
            score = 0.5
            reason = "One flexible about children"
        else:
            score = 0.0
            reason = "Conflicting views on children"
        
        return {'score': score, 'reason': reason}

    def _score_education_compatibility(self, target_user, candidate):
        """Education scoring with hierarchy"""
        if not target_user.degree or not candidate.degree:
            return {'score': 0.4, 'reason': 'Incomplete education data'}
        
        target_level = self.EDUCATION_HIERARCHY.get(target_user.degree, 3)
        candidate_level = self.EDUCATION_HIERARCHY.get(candidate.degree, 3)
        
        level_diff = abs(target_level - candidate_level)
        
        if target_user.gender == 'female':
            # Women prefer equal or higher education in men
            if candidate_level >= target_level:
                score = 1.0
                reason = "Educational expectations met"
            elif candidate_level == target_level - 1:
                score = 0.5
                reason = "Slight education difference"
            else:
                score = 0.0
                reason = "Education gap concerns"
        else:
            # Men less concerned about women's education level
            if level_diff == 0:
                score = 1.0
                reason = "Same educational level"
            elif level_diff == 1:
                score = 0.8
                reason = "Compatible education"
            elif level_diff <= 2:
                score = 0.5
                reason = "Some education difference"
            else:
                score = 0.2
                reason = "Significant education gap"
        
        return {'score': score, 'reason': reason}

    def _score_career_compatibility(self, target_user, candidate):
        """Company and designation scoring"""
        target_prestige = self._calculate_career_prestige(target_user)
        candidate_prestige = self._calculate_career_prestige(candidate)
        
        if target_user.gender == 'female':
            # Women value men's career more heavily
            if candidate_prestige >= target_prestige:
                score = 1.0
                reason = "Strong career match"
            elif candidate_prestige >= target_prestige * 0.8:
                score = 0.7
                reason = "Good career compatibility"
            else:
                score = 0.3
                reason = "Career expectations gap"
        else:
            # Men less concerned about women's career prestige
            if abs(candidate_prestige - target_prestige) <= 0.3:
                score = 1.0
                reason = "Balanced career levels"
            else:
                score = 0.6
                reason = "Different career trajectories"
        
        return {'score': score, 'reason': reason}

    def _calculate_career_prestige(self, user):
        """Calculate career prestige score"""
        prestige = 0.5  # Base score
        
        # Company prestige
        if user.current_company:
            company_lower = user.current_company.lower()
            if any(prestige_co in company_lower for prestige_co in self.PRESTIGE_COMPANIES):
                prestige += 0.3
        
        # Designation seniority
        if user.designation:
            designation_lower = user.designation.lower()
            if any(senior_des in designation_lower for senior_des in self.SENIOR_DESIGNATIONS):
                prestige += 0.2
        
        return min(prestige, 1.0)

    def _score_marital_status(self, target_user, candidate):
        """Marital status compatibility"""
        target_status = target_user.marital_status or 'single'
        candidate_status = candidate.marital_status or 'single'
        
        if target_status == candidate_status:
            score = 1.0
            reason = "Same marital background"
        else:
            score = 0.5
            reason = "Different marital history"
        
        return {'score': score, 'reason': reason}

    def _score_family_compatibility(self, target_user, candidate):
        """Siblings/family size scoring"""
        if target_user.siblings is None or candidate.siblings is None:
            return {'score': 0.5, 'reason': 'Family size data incomplete'}
        
        sibling_diff = abs(target_user.siblings - candidate.siblings)
        
        if sibling_diff == 0:
            score = 1.0
            reason = "Identical family size"
        elif sibling_diff <= 1:
            score = 0.8
            reason = "Similar family background"
        elif sibling_diff <= 2:
            score = 0.5
            reason = "Some family size difference"
        else:
            score = 0.2
            reason = "Very different family sizes"
        
        return {'score': score, 'reason': reason}

    def _score_language_compatibility(self, target_user, candidate):
        """Language compatibility scoring"""
        target_languages = set(lang.name for lang in target_user.languages_known.all())
        candidate_languages = set(lang.name for lang in candidate.languages_known.all())
        
        if not target_languages or not candidate_languages:
            return {'score': 0.4, 'reason': 'Language data incomplete'}
        
        common_languages = target_languages.intersection(candidate_languages)
        
        if len(common_languages) >= 2:
            score = 1.0
            reason = f"Share {len(common_languages)} languages"
        elif len(common_languages) >= 1:
            # Check if it's a major language
            major_common = common_languages.intersection({'english', 'hindi'})
            if major_common:
                score = 0.8
                reason = "Share major common language"
            else:
                score = 0.5
                reason = "Share one common language"
        else:
            score = 0.0
            reason = "No common languages"
        
        return {'score': score, 'reason': reason}

    def _score_height_compatibility(self, target_user, candidate):
        """Height compatibility with gender preferences"""
        if not target_user.height or not candidate.height:
            return {'score': 0.6, 'reason': 'Height data incomplete'}
        
        if target_user.gender == 'male':
            # Men prefer women ~8cm shorter
            height_diff = target_user.height - candidate.height
            ideal_diff = 0.08  # 8cm in meters
            
            if abs(height_diff - ideal_diff) <= 0.05:  # Within 5cm of ideal
                score = 1.0
                reason = "Ideal height compatibility"
            elif abs(height_diff - ideal_diff) <= 0.10:  # Within 10cm
                score = 0.5
                reason = "Acceptable height difference"
            else:
                score = 0.0
                reason = "Height compatibility issues"
        else:
            # Women prefer men ~21cm taller
            height_diff = candidate.height - target_user.height
            ideal_diff = 0.21  # 21cm in meters
            
            if abs(height_diff - ideal_diff) <= 0.05:  # Within 5cm of ideal
                score = 1.0
                reason = "Perfect height match"
            elif abs(height_diff - ideal_diff) <= 0.10:  # Within 10cm
                score = 0.5
                reason = "Good height compatibility"
            else:
                score = 0.0
                reason = "Height preferences not met"
        
        return {'score': score, 'reason': reason}

    def _score_pets_compatibility(self, target_user, candidate):
        """Pet compatibility scoring"""
        target_pets = target_user.open_to_pets
        candidate_pets = candidate.open_to_pets
        
        if not target_pets or not candidate_pets:
            return {'score': 0.6, 'reason': 'Pet preferences incomplete'}
        
        if target_pets == candidate_pets:
            score = 1.0
            reason = f"Both {target_pets.lower()} about pets"
        elif target_pets == 'maybe' or candidate_pets == 'maybe':
            score = 0.5
            reason = "Flexible about pets"
        else:
            score = 0.0
            reason = "Different pet preferences"
        
        return {'score': score, 'reason': reason}


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

        try:
            # Get target user
            target_user = get_object_or_404(User, id=user_id, matchmaker=matchmaker)
            
            if not target_user.date_of_birth:
                return Response({
                    'error': 'User must have date of birth to find matches',
                    'status': 'error'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Initialize matching engine
            engine = AdvancedMatchmakingEngine()
            
            # Get potential matches
            opposite_gender = 'female' if target_user.gender == 'male' else 'male'
            potential_matches = User.objects.filter(
                gender=opposite_gender,
            ).exclude(id=target_user.id)
            print("potential_matches:", len(potential_matches))
            
            # Score all matches
            scored_matches = []
            for candidate in potential_matches:
                if not candidate.date_of_birth:
                    continue
                    
                compatibility_data = engine.calculate_comprehensive_score(target_user, candidate)
                print("compatibiltiy_data:", compatibility_data)
                
                if compatibility_data['total_score'] > 30:  # Minimum threshold
                    scored_matches.append({
                        'user': candidate,
                        'compatibility_score': compatibility_data['total_score'],
                        'parameter_scores': compatibility_data['parameter_scores'],
                        'insights': compatibility_data['insights'],
                        'risk_factors': compatibility_data['risk_factors']
                    })
            
            # Sort by score
            scored_matches.sort(key=lambda x: x['compatibility_score'], reverse=True)
            
            # Format response
            matches_data = []
            for match in scored_matches[:25]:  # Top 25 matches
                user = match['user']
                matches_data.append({
                    'id': user.id,
                    'full_name': user.full_name,
                    'age': engine._calculate_age(user.date_of_birth),
                    'city': user.city,
                    'country': user.country,
                    'height': user.height_display if user.height else None,
                    'degree': user.get_degree_display() if user.degree else None,
                    'current_company': user.current_company,
                    'designation': user.designation,
                    'income': float(user.income) if user.income else None,
                    'religion': user.get_religion_display() if user.religion else None,
                    'caste': user.get_caste_display() if user.caste else None,
                    'languages_known': [lang.get_name_display() for lang in user.languages_known.all()],
                    'want_kids': user.get_want_kids_display() if user.want_kids else None,
                    'open_to_relocate': user.get_open_to_relocate_display() if user.open_to_relocate else None,
                    'compatibility_score': round(match['compatibility_score'], 1),
                    'parameter_scores': match['parameter_scores'],
                    'match_insights': match['insights'],
                    'potential_concerns': match['risk_factors']
                })
            
            return Response({
                'status': 'success',
                'user_id': target_user.id,
                'user_name': target_user.full_name,
                'user_gender': target_user.get_gender_display(),
                'total_matches_found': len(scored_matches),
                'algorithm_version': 'Research-Based v2.0',
                'matches': matches_data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Error in advanced matching: {str(e)}")
            return Response({
                'error': f'Error finding matches: {str(e)}',
                'status': 'error'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    