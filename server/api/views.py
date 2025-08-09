from .models import *
from .serializers import *
from .utils import generate_jwt_tokens
from rest_framework.permissions import AllowAny
from rest_framework import status, generics
from rest_framework.response import Response
from .authentication import *



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
