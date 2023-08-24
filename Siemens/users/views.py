from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate


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
            login(request, user)
            return redirect('dashboard:home')

        message = "hello"
        response_data = {'message': message}
        return JsonResponse(response_data)


def logoutView(request):
    logout(request)
    return render(request, "users/login.html")
