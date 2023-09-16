from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate
from .models import Account


def index(request):
    if request.user.is_authenticated:
        return redirect('dashboard:home')
    return render(request, "users/login.html")


def logUser(request):
    if request.method == 'POST':
        email = request.POST["email"]
        password = request.POST["password"]

        user = authenticate(email=email, password=password)
        if user:
            if user.is_active:
                login(request, user)
                return redirect('dashboard:home')
            else:
                response_data = {'message': "-32"}
                return JsonResponse(response_data)

        message = "hello"
        response_data = {'message': message}
        return JsonResponse(response_data)


def activating_account(request):
    if request.method == "POST":
        message = "nice"

        email = request.POST["email"]
        pwd = request.POST["password"]

        user = Account.objects.filter(email=email).first()
        if user:
            user.is_active = True
            user.set_password(pwd)
            user.save()
            user = authenticate(email=email, password=pwd)
            if user:
                login(request, user)
                return redirect('dashboard:home')
        else:
            message = "not nice"

        response_data = {'message': message}
        return JsonResponse(response_data)

def logoutView(request):
    logout(request)
    return render(request, "users/login.html")
