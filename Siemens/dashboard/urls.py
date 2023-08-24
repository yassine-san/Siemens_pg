from django.urls import path
from . import views

app_name = 'dashboard'

urlpatterns = [
    path('', views.home, name="home"),
    path('excel', views.excelImporter, name="excel_import"),
    path('upload-excel/', views.upload_excel, name='upload_excel'),
    path('logout/', views.logout_user, name="logout_user")
]
