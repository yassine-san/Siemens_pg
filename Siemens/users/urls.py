from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('login/', views.index, name="login"),
    path('logUser/', views.logUser, name="logUser"),
    path('activating_account', views.activating_account, name="activating_user")
]
