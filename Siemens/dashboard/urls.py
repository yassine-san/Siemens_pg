from django.urls import path
from . import views
from .views import excelImporter

app_name = 'dashboard'

urlpatterns = [
    path('', views.home, name="home"),
    path('excel/<int:file_index>/', views.excelImporter, name="excel_import"),
    path('upload-excel/', views.upload_excel, name='upload_excel'),


    path('data_quality', views.data_quality, name="quality_interface"),



    path('upload-another-excel/', views.upload_another_excel, name='upload_another_excel'),

    # home redirections paths
   
    path('data_quality', views.data_quality, name="data_quality"),
    path('get_percents/', views.update_dataAjax, name="get_percents"),

    path('srs/', views.srs_interface, name="srs_interface"),
    path('africaIB', views.africaIb_interface, name="get_africaIB"),
    path('can24', views.can_interface, name="get_can24"),


    # user conf paths
    path('register_pt/', views.registerPartenariat),
    path('registerNewUser/', views.registerNewUser, name="registerNewUser"),
    path('logout/', views.logout_user, name="logout_user"),


    # ajax requests
   path('missing_fl_countries/', views.get_missing_fl_countries, name='missing_fl_countries'),
    path('missing_customer_name/', views.get_missing_customer_name, name='missing_customer_name'),
]
