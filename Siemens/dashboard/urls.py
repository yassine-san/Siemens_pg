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

    path('SRS_Connectivity/', views.active_system_count, name='SRS_Connectivity'),
    path('get_srs_connectivity_chart_data/', views.get_srs_connectivity_chart_data, name='get_srs_connectivity_chart_data'),
    path('get_ruh_readiness_chart_data/', views.get_ruh_readiness_chart_data, name='get_ruh_readiness_chart_data'),
    path('get_Data_Sent_chart_data/', views.get_Data_Sent_chart_data, name='get_Data_Sent_chart_data'),
    path('get_Connection_score_chart_data/', views.get_Connection_score_chart_data, name='get_Connection_score_chart_data'),
    path('CAN24/', views.CAN24, name='CAN24'),

    path('get_srs_connectivity_chart_data2/', views.get_srs_connectivity_chart_data2, name='get_srs_connectivity_chart_data2'),
    path('get_ruh_readiness_chart_data2/', views.get_ruh_readiness_chart_data2, name='get_ruh_readiness_chart_data2'),
    path('get_Data_Sent_chart_data2/', views.get_Data_Sent_chart_data2, name='get_Data_Sent_chart_data2'),
    path('get_Connection_score_chart_data2/', views.get_Connection_score_chart_data2, name='get_Connection_score_chart_data2'),
    path('get_equipment_data/', views.get_equipment_data, name='get_equipment_data'),
    path('get_Can24_Connectable_Systems_chart_data/', views.get_Can24_Connectable_Systems_chart_data, name='get_Can24_Connectable_Systems_chart_data'),
    path('get_CAN24_Data_Sent_chart_data/', views.get_CAN24_Data_Sent_chart_data, name='get_CAN24_Data_Sent_chart_data'),
    path('get_Connected_CAN24_Modul_chart_data/', views.get_Connected_CAN24_Modul_chart_data, name='get_Connected_CAN24_Modul_chart_data'),


    path('fill_missing_countries', views.fillin_missing_country, name='fillMissCountry'),
    path('fill_missing_cst', views.fillin_missing_cst, name='fillMissCst'),

    path('get_equipements_dataAjax/', views.get_equipment_dataAjax, name='get_equipment_dataAjax'),
    path('get_equipment_data_CAN24_Ajax/', views.get_equipment_data_CAN24_Ajax, name='get_equipment_data_CAN24_Ajax'),







    # home redirections paths
   
    path('data_quality', views.data_quality, name="data_quality"),
    path('get_percents/', views.update_dataAjax, name="get_percents"),

    path('africaIB', views.africaIb_interface, name="get_africaIB"),

    # user conf paths
    path('register_pt/', views.registerPartenariat),
    path('registerNewUser/', views.registerNewUser, name="registerNewUser"),
    path('logout/', views.logout_user, name="logout_user"),


    # ajax requests
    path('missing_fl_countries/', views.get_missing_fl_countries, name='missing_fl_countries'),
    path('missing_customer_name/', views.get_missing_customer_name, name='missing_customer_name'),
    path('active_system_count/', views.active_system_count, name='active_system_count'),
    path('get_all_ivknames/', views.get_all_ivknames, name='get_all_ivknames'),
    path('get_equipment_dataAjax2/', views.get_equipment_dataAjax2, name='get_equipment_dataAjax2'),
    # path('get_serialnumber_count/', views.get_serialnumber_count, name='get_serialnumber_count'),
    # path('count_on_stock_substatus/', views.count_on_stock_substatus, name='count_on_stock_substatus'),
    # path('count_active_status/', views.count_active_status, name='count_active_status'),
    # path('count_shipped_substatus/', views.count_shipped_substatus, name='count_shipped_substatus'),

    path('get_serial_data_by_search/', views.get_serial_data_by_search, name='get_serial_data_by_search'),
    path('get_row_data/', views.get_row_data, name='get_row_data'),
    path('filter_data/', views.filter_data, name='filter_data'),
    path('get_filtered_counts/', views.get_filtered_counts, name='get_filtered_counts'),





]
