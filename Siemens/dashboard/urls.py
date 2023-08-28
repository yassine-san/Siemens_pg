from django.urls import path
from . import views
from .views import excelImporter

app_name = 'dashboard'

urlpatterns = [
    path('', views.home, name="home"),
    path('excel/<int:file_index>/', views.excelImporter, name="excel_import"),
    path('upload-excel/', views.upload_excel, name='upload_excel'),
    #path('data_quality', views.quality_interface, name="data_quality"),
    path('upload-another-excel/', views.upload_another_excel, name='upload_another_excel'),
    path('SRS_Connectivity/', views.SRS_Connectivity, name='SRS_Connectivity'),
    path('get_srs_connectivity_chart_data/', views.get_srs_connectivity_chart_data, name='get_srs_connectivity_chart_data'),
    path('get_ruh_readiness_chart_data/', views.get_ruh_readiness_chart_data, name='get_ruh_readiness_chart_data'),
    path('get_Data_Sent_chart_data/', views.get_Data_Sent_chart_data, name='get_Data_Sent_chart_data'),
    path('get_Connection_score_chart_data/', views.get_Connection_score_chart_data, name='get_Connection_score_chart_data'),
    path('CAN24/', views.CAN24, name='CAN24'),
    path('get_srs_connectivity_chart_data2/', views.get_srs_connectivity_chart_data2, name='get_srs_connectivity_chart_data2'),
    path('get_ruh_readiness_chart_data2/', views.get_ruh_readiness_chart_data2, name='get_ruh_readiness_chart_data2'),
    path('get_Data_Sent_chart_data2/', views.get_Data_Sent_chart_data2, name='get_Data_Sent_chart_data2'),
    path('get_Connection_score_chart_data2/', views.get_Connection_score_chart_data2, name='get_Connection_score_chart_data2'),




    #path('SRS_chart/', views.get_srs_connectivity_chart_data, name='SRS_Connectivity'),



    # home redirections paths
   
    path('data_quality', views.data_quality, name="data_quality"),




    # user conf paths
    path('register_pt/', views.registerPartenariat),
    path('registerNewUser/', views.registerNewUser, name="registerNewUser"),
    path('logout/', views.logout_user, name="logout_user"),


    # ajax requests
   path('missing_fl_countries/', views.get_missing_fl_countries, name='missing_fl_countries'),
    path('missing_customer_name/', views.get_missing_customer_name, name='missing_customer_name'),
]
