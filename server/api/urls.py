
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='Login'),
    path('users/', views.UsersView.as_view(), name='get user(s) assigned to the matchmaker'),
    path('matches/', views.MatchesView.as_view(), name = "get matches for a user assigned to the matchmaker"),
    path('sendEmail/', views.EmailView, name="trigger email")
] 