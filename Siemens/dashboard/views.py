import json

from django.contrib.auth import logout
from django.shortcuts import render, redirect
from django.db import connection
from openpyxl import load_workbook
from django.http import JsonResponse
from .models import Quality
from .models import Srs
from .models import Can24
from users.models import Account, Account
from django.db.models import Count
from datetime import datetime
from datetime import date
from django.core.paginator import Paginator



def home(request):
    user = request.user
    if not request.user.is_authenticated:
        return redirect('login')

    user_type = user.user_type
    if user_type == 3:
        username = user.partenariat
    else:
        username = {1: "manager", 2: "assistant"}.get(user_type, "unknown")

    return render(request, "dashboard/home.html", {"username": username})


def get_user_partenariat(user):
    user_type = user.user_type
    if user_type == 1 or user_type == 2:
        username = "all"
    elif user_type == 3:
        username = user.partenariat
    else:
        username = "unknown"
    return username


def quality_interface(request):
    if not request.user.is_authenticated:
        return redirect('login')

    return render(request, "dashboard/data_quality.html")


def SRS_Connectivity(request):
    return render(request, 'dashboard/SRS.html')


def africaIb_interface(request):
    return render(request, "dashboard/africa_IB.html")


def get_missing_fl_countries(request):
    user = request.user
    partner = get_user_partenariat(user)

    if request.method == "POST":
        filters_data = request.POST.get('filters')
        filters_dict = json.loads(filters_data)
        status_filter = filters_dict['status']
        substatus_filter = filters_dict['substatus']
        week_filter = filters_dict['week']

    if partner == "all":
        missing_fl_countries = Quality.objects.filter(flcountry='').values(
            'servicepartner', 'materialnumber', 'serialnumber',
            'modality', 'ivkname', 'status', 'substatus', 'flcountry'
        )
    else:
        missing_fl_countries = Quality.objects.filter(
            flcountry='', servicepartnername=partner
        ).values(
            'servicepartner', 'materialnumber', 'serialnumber',
            'modality', 'ivkname', 'status', 'substatus', 'flcountry'
        )

    if status_filter != ['all']:
        missing_fl_countries = missing_fl_countries.filter(status__in=status_filter)
    if substatus_filter != ['all']:
        missing_fl_countries = missing_fl_countries.filter(substatus__in=substatus_filter)
    if week_filter != ['all']:
        missing_fl_countries = missing_fl_countries.filter(week__in=week_filter)

    return JsonResponse(list(missing_fl_countries), safe=False)


# def get_missing_customer_name(request):
#     missing_fl_countries = Quality.objects.filter(customername='').values(
#         'servicepartner', 'materialnumber', 'serialnumber',
#         'modality', 'ivkname', 'status', 'substatus', 'customername'
#     )
#     return JsonResponse(list(missing_fl_countries), safe=False)

def get_missing_customer_name(request):
    user = request.user
    partner = get_user_partenariat(user)

    if request.method == "POST":
        filters_data = request.POST.get('filters')
        filters_dict = json.loads(filters_data)
        status_filter = filters_dict['status']
        substatus_filter = filters_dict['substatus']
        week_filter = filters_dict['week']

    if partner == "all":
        missing_customer_names = Quality.objects.filter(customername='').values(
            'servicepartner', 'materialnumber', 'serialnumber',
            'modality', 'ivkname', 'status', 'substatus', 'customername'
        )
    else:
        missing_customer_names = Quality.objects.filter(
            customername='', servicepartnername=partner
        ).values(
            'servicepartner', 'materialnumber', 'serialnumber',
            'modality', 'ivkname', 'status', 'substatus', 'customername'
        )

    # Apply your filtering logic using the status, substatus, and week filters
    if status_filter != ['all']:
        missing_customer_names = missing_customer_names.filter(status__in=status_filter)
    if substatus_filter != ['all']:
        missing_customer_names = missing_customer_names.filter(substatus__in=substatus_filter)
    if week_filter != ['all']:
        missing_customer_names = missing_customer_names.filter(week__in=week_filter)

    return JsonResponse(list(missing_customer_names), safe=False)


def registerPartenariat(request):
    if not request.user.is_authenticated:
        return redirect('login')

    partners_list = Quality.objects.values('servicepartnername').distinct().order_by('servicepartnername')

    return render(request, "dashboard/register_user.html", {"partenariats": partners_list})


def registerNewUser(request):
    if request.method == 'POST':
        email = request.POST["email"]
        partenariat = request.POST["partner"]
        username, domain = email.split('@')
        password = username + "?"

        Account.objects.create_user(email, password, partenariat, 3)

        response_data = {'message': 'User registered successfully'}

        return JsonResponse(response_data)


def data_quality(request):
    excel_data = Quality.objects.all()
    total_records = excel_data.count()

    def calculate_percentage(status, substatus, column_name):
        print("status:", status)
        print("substatus:", substatus)

        filter_kwargs = {
            f"{column_name}__regex": r'.+',
        }
        # cstname = Quality.cstname
        count = excel_data.filter(status=status, substatus=substatus, **filter_kwargs).count()
        print("count: ", count)
        return (count / total_records) * 100

    active_active_flcountry_percentage = calculate_percentage('active', 'active', 'flcountry')
    active_active_cstname_percentage = calculate_percentage('active', 'active', 'cstname')
    active_shipped_flcountry_percentage = calculate_percentage('active', 'shipped', 'flcountry')
    active_shipped_cstname_percentage = calculate_percentage('active', 'shipped', 'cstname')
    inactive_on_stock_flcountry_percentage = calculate_percentage('inactive', 'on stock', 'flcountry')
    inactive_on_stock_cstname_percentage = calculate_percentage('inactive', 'on stock', 'cstname')

    weeks = Quality.objects.values('week').distinct().order_by('week')

    context = {
        'active_active_flcountry_percentage': active_active_flcountry_percentage,
        'active_active_cstname_percentage': active_active_cstname_percentage,
        'active_shipped_flcountry_percentage': active_shipped_flcountry_percentage,
        'active_shipped_cstname_percentage': active_shipped_cstname_percentage,
        'inactive_on_stock_flcountry_percentage': inactive_on_stock_flcountry_percentage,
        'inactive_on_stock_cstname_percentage': inactive_on_stock_cstname_percentage,
        'weeks_filter': weeks,
    }

    return render(request, 'dashboard/data_quality.html', context)


# def update_dataAjax(request):
#     excel_data = Quality.objects.all()
#     total_records = excel_data.count()
#
#     partner = get_user_partenariat(request.user)
#
#     def calculate_percentage(status, substatus, column_name):
#         filter_kwargs = {
#             f"{column_name}__regex": r'.+',
#         }
#         if partner == "all":
#             count = excel_data.filter(status=status, substatus=substatus, **filter_kwargs).count()
#         else:
#             count = excel_data.filter(servicepartnername=partner, status=status, substatus=substatus, **filter_kwargs).count()
#         return (count / total_records) * 100
#
#     active_active_flcountry_percentage = calculate_percentage('active', 'active', 'flcountry')
#     active_active_cstname_percentage = calculate_percentage('active', 'active', 'cstname')
#     active_shipped_flcountry_percentage = calculate_percentage('active', 'shipped', 'flcountry')
#     active_shipped_cstname_percentage = calculate_percentage('active', 'shipped', 'cstname')
#     inactive_on_stock_flcountry_percentage = calculate_percentage('inactive', 'on stock', 'flcountry')
#     inactive_on_stock_cstname_percentage = calculate_percentage('inactive', 'on stock', 'cstname')
#
#     updated_data = {
#         'active_active_flcountry_percentage': active_active_flcountry_percentage,
#         'active_active_cstname_percentage': active_active_cstname_percentage,
#         'active_shipped_flcountry_percentage': active_shipped_flcountry_percentage,
#         'active_shipped_cstname_percentage': active_shipped_cstname_percentage,
#         'inactive_on_stock_flcountry_percentage': inactive_on_stock_flcountry_percentage,
#         'inactive_on_stock_cstname_percentage': inactive_on_stock_cstname_percentage,
#     }
#
#     return JsonResponse(updated_data)

def update_dataAjax(request):
    excel_data = Quality.objects.all()
    total_records = excel_data.count()
    partner = get_user_partenariat(request.user)

    def calculate_percentage(status, substatus, column_name):
        filter_kwargs = {
            f"{column_name}__regex": r'.+',
        }
        if week_filter != ['all']:
            filter_kwargs['week__in'] = week_filter

        if partner == "all":
            count = excel_data.filter(status=status, substatus=substatus, **filter_kwargs).count()
        else:
            count = excel_data.filter(servicepartnername=partner, status=status, substatus=substatus, **filter_kwargs).count()

        # count = excel_data.filter(**filter_kwargs).count()
        return (count / total_records) * 100


    if request.method == "POST":
        filters_data = request.POST.get('filters')
        filters_dict = json.loads(filters_data)
        week_filter = filters_dict['week']


    active_active_flcountry_percentage = calculate_percentage('active', 'active', 'flcountry')
    active_active_cstname_percentage = calculate_percentage('active', 'active', 'cstname')
    active_shipped_flcountry_percentage = calculate_percentage('active', 'shipped', 'flcountry')
    active_shipped_cstname_percentage = calculate_percentage('active', 'shipped', 'cstname')
    inactive_on_stock_flcountry_percentage = calculate_percentage('inactive', 'on stock', 'flcountry')
    inactive_on_stock_cstname_percentage = calculate_percentage('inactive', 'on stock', 'cstname')

    updated_data = {
        'active_active_flcountry_percentage': active_active_flcountry_percentage,
        'active_active_cstname_percentage': active_active_cstname_percentage,
        'active_shipped_flcountry_percentage': active_shipped_flcountry_percentage,
        'active_shipped_cstname_percentage': active_shipped_cstname_percentage,
        'inactive_on_stock_flcountry_percentage': inactive_on_stock_flcountry_percentage,
        'inactive_on_stock_cstname_percentage': inactive_on_stock_cstname_percentage,
    }

    return JsonResponse(updated_data)


def logout_user(request):
    message = "error"
    if request.user.is_authenticated:
        logout(request)
        message = "success"

    response_data = {'message': message}
    return JsonResponse(response_data)


def excelImporter(request, file_index=None):
    if not request.user.is_authenticated:
        return redirect('login')

    if file_index == 1:
        template_name = "dashboard/excel_import1.html"
    elif file_index == 2:
        template_name = "dashboard/excel_import2.html"
    else:
        # Handle invalid file_index value
        return redirect('home')  # Redirect to the appropriate page

    return render(request, template_name, {'file_index': file_index})


BATCH_SIZE = 10000


def upload_excel(request):
    if request.method == 'POST' and request.FILES.get('excel_file'):
        uploaded_file = request.FILES['excel_file']

        if connection is None:
            response_data = {'message': 'Invalid request'}
            JsonResponse(response_data)

        cursor = connection.cursor()

        try:
            workbook = load_workbook(uploaded_file, read_only=True)
            first_sheet = workbook.worksheets[0]
            # Skip the header row
            rows = first_sheet.iter_rows(min_row=2, values_only=True)

            batch = []

            for row in rows:
                batch.append(row)

                if len(batch) >= BATCH_SIZE:
                    insert_query = "INSERT INTO excelTable VALUES (%s" + (", %s" * (len(row) - 1)) + ")"
                    cursor.executemany(insert_query, batch)
                    batch = []

            if batch:
                insert_query = "INSERT INTO excelTable VALUES (%s" + (", %s" * (len(row) - 1)) + ")"
                cursor.executemany(insert_query, batch)

            connection.commit()
            cursor.close()
            connection.close()
            workbook.close()

            response_data = {'status': 1, 'message': 'Base donnee est mise a jour', 'data': None}
        except Exception as e:
            response_data = {'status': -1, 'message': 'Erreur lors l\'execution'}

    else:
        response_data = {'status': -1, 'message': 'Invalid request'}

    return JsonResponse(response_data)


########################################################
# New function for uploading Excel file with two sheets
def upload_another_excel(request):
    if request.method == 'POST' and request.FILES.get('excel_file'):
        uploaded_file = request.FILES['excel_file']

        if connection is None:
            response_data = {'message': 'Invalid request'}
            return JsonResponse(response_data)

        cursor = connection.cursor()

        try:
            workbook = load_workbook(uploaded_file, read_only=True)

            for sheet in workbook:
                # Skip the header row
                rows = sheet.iter_rows(min_row=2, values_only=True)

                batch = []

                for row in rows:
                    batch.append(row)

                    if len(batch) >= BATCH_SIZE:
                        if sheet.title == 'SRS Connectivity':
                            # Adjust the insert query and table name for the SRS_Connectivity sheet
                            insert_query = "INSERT INTO SRS_Connectivity VALUES (%s" + (", %s" * (len(row) - 1)) + ")"
                        elif sheet.title == 'CAN24':
                            # Adjust the insert query and table name for the CAN24 sheet
                            insert_query = "INSERT INTO CAN24 VALUES (%s" + (", %s" * (len(row) - 1)) + ")"
                        else:
                            # Handle other sheets if needed
                            continue

                        cursor.executemany(insert_query, batch)
                        connection.commit()
                        batch = []

                if batch:
                    if sheet.title == 'SRS Connectivity':
                        insert_query = "INSERT INTO SRS_Connectivity VALUES (%s" + (", %s" * (len(row) - 1)) + ")"
                    elif sheet.title == 'CAN24':
                        insert_query = "INSERT INTO CAN24 VALUES (%s" + (", %s" * (len(row) - 1)) + ")"
                    else:
                        # Handle other sheets if needed
                        continue

                    cursor.executemany(insert_query, batch)
                    connection.commit()

            cursor.close()
            connection.close()
            workbook.close()

            response_data = {'status': 1, 'message': 'Another Excel data updated', 'data': None}
        except Exception as e:
            response_data = {'status': -1, 'message': 'Erreur lors l\'execution'}

    else:
        response_data = {'status': -1, 'message': 'Invalid request'}

    return JsonResponse(response_data)


def get_srs_connectivity_chart_data(request):
    dates = [date(2023, 5, 15), date(2023, 5, 30), date(2023, 6, 15), date(2023, 7, 1), date(2023, 7, 15),
             date(2023, 8, 1), date(2023, 8, 15)]

    data = {
        'labels': [d.strftime('%b %d') for d in dates],
        'connected_counts': [],
        'x_connectable_counts': [],
    }

    for d in dates:
        connected_count = Srs.objects.filter(date=d, srs_connectivity='Connected').count()
        x_connectable_count = Srs.objects.filter(date=d, srs_connectivity='X_Connectable').count()
        data['connected_counts'].append(connected_count)
        data['x_connectable_counts'].append(x_connectable_count)

    return JsonResponse(data)


def get_ruh_readiness_chart_data(request):
    dates = [date(2023, 5, 15), date(2023, 5, 30), date(2023, 6, 15), date(2023, 7, 1), date(2023, 7, 15),
             date(2023, 8, 1), date(2023, 8, 15)]

    data = {
        'labels': [d.strftime('%b %d') for d in dates],
        'RUH_Ready_counts': [],
        'X_not_RUH_ready_counts': [],
    }

    for d in dates:
        RUH_Ready_count = Srs.objects.filter(date=d, ruh_readiness='RUH Ready').count()
        X_not_RUH_ready_count = Srs.objects.filter(date=d, ruh_readiness='X_not RUH ready').count()
        data['RUH_Ready_counts'].append(RUH_Ready_count)
        data['X_not_RUH_ready_counts'].append(X_not_RUH_ready_count)

    return JsonResponse(data)


def get_Data_Sent_chart_data(request):
    dates = [date(2023, 5, 15), date(2023, 5, 30), date(2023, 6, 15), date(2023, 7, 1), date(2023, 7, 15),
             date(2023, 8, 1), date(2023, 8, 15)]

    data = {
        'labels': [d.strftime('%b %d') for d in dates],
        'Data_Sent_counts': [],
        'X_Data_not_sent_counts': [],
    }

    for d in dates:
        Data_Sent_count = Srs.objects.filter(date=d, data_sent='Data Sent').count()
        X_Data_not_sent_count = Srs.objects.filter(date=d, data_sent='X_Data not sent').count()
        data['Data_Sent_counts'].append(Data_Sent_count)
        data['X_Data_not_sent_counts'].append(X_Data_not_sent_count)

    return JsonResponse(data)


def get_Connection_score_chart_data(request):
    dates = [date(2023, 5, 15), date(2023, 5, 30), date(2023, 6, 15), date(2023, 7, 1), date(2023, 7, 15),
             date(2023, 8, 1), date(2023, 8, 15)]

    data = {
        'labels': [d.strftime('%b %d') for d in dates],
        'Connection_active_counts': [],
        'Connection_not_active_counts': [],
    }

    for d in dates:
        Connection_active_count = Srs.objects.filter(date=d, connection_score='Connection active').count()
        Connection_not_active_count = Srs.objects.filter(date=d, connection_score='Connection not active').count()
        data['Connection_active_counts'].append(Connection_active_count)
        data['Connection_not_active_counts'].append(Connection_not_active_count)

    return JsonResponse(data)


def CAN24(request):
    # chart_data = get_srs_chart_data()

    return render(request, 'dashboard/MR_CAN24.html')


def get_srs_connectivity_chart_data2(request):
    dates = [date(2023, 6, 1), date(2023, 6, 15), date(2023, 7, 1), date(2023, 7, 15), date(2023, 8, 1),
             date(2023, 8, 15)]

    data = {
        'labels': [d.strftime('%b %d') for d in dates],
        'connected_counts': [],
        'x_connectable_counts': [],
    }

    for d in dates:
        connected_count = Can24.objects.filter(date=d, srs_connectivity='Connected').count()
        x_connectable_count = Can24.objects.filter(date=d, srs_connectivity='X_Connectable').count()
        data['connected_counts'].append(connected_count)
        data['x_connectable_counts'].append(x_connectable_count)

    return JsonResponse(data)


def get_ruh_readiness_chart_data2(request):
    dates = [date(2023, 6, 1), date(2023, 6, 15), date(2023, 7, 1), date(2023, 7, 15), date(2023, 8, 1),
             date(2023, 8, 15)]

    data = {
        'labels': [d.strftime('%b %d') for d in dates],
        'RUH_Ready_counts': [],
        'X_not_RUH_ready_counts': [],
    }

    for d in dates:
        RUH_Ready_count = Can24.objects.filter(date=d, ruh_readiness='RUH Ready').count()
        X_not_RUH_ready_count = Can24.objects.filter(date=d, ruh_readiness='X_not RUH ready').count()
        data['RUH_Ready_counts'].append(RUH_Ready_count)
        data['X_not_RUH_ready_counts'].append(X_not_RUH_ready_count)

    return JsonResponse(data)


def get_Data_Sent_chart_data2(request):
    dates = [date(2023, 6, 1), date(2023, 6, 15), date(2023, 7, 1), date(2023, 7, 15), date(2023, 8, 1),
             date(2023, 8, 15)]

    data = {
        'labels': [d.strftime('%b %d') for d in dates],
        'Data_Sent_counts': [],
        'X_Data_not_sent_counts': [],
    }

    for d in dates:
        Data_Sent_count = Can24.objects.filter(date=d, data_sent='Data Sent').count()
        X_Data_not_sent_count = Can24.objects.filter(date=d, data_sent='X_Data not sent').count()
        data['Data_Sent_counts'].append(Data_Sent_count)
        data['X_Data_not_sent_counts'].append(X_Data_not_sent_count)

    return JsonResponse(data)


def get_Connection_score_chart_data2(request):
    dates = [date(2023, 6, 1), date(2023, 6, 15), date(2023, 7, 1), date(2023, 7, 15), date(2023, 8, 1),
             date(2023, 8, 15)]

    data = {
        'labels': [d.strftime('%b %d') for d in dates],
        'Connection_active_counts': [],
        'Connection_not_active_counts': [],
    }

    for d in dates:
        Connection_active_count = Can24.objects.filter(date=d, connection_score='Connection active').count()
        Connection_not_active_count = Can24.objects.filter(date=d, connection_score='Connection not active').count()
        data['Connection_active_counts'].append(Connection_active_count)
        data['Connection_not_active_counts'].append(Connection_not_active_count)

    return JsonResponse(data)
def get_equipment_data(request):
    equipment_data = Srs.objects.all().values(
        'equipment_service_partner_id', 'equipment_service_partner_text', 'country_region', 
        'func_location_name', 'equipment_material_number', 'equipment_serial_number', 
        'material_division_text', 'material_ivk_name', 'srs_connectivity', 
        'ruh_readiness', 'data_sent'
    )
    
    itemsPerPage = 500  # Adjust this according to your needs
    paginator = Paginator(equipment_data, itemsPerPage)
        
    page = request.GET.get('page')
    equipment_page = paginator.get_page(page)
        
    return JsonResponse(list(equipment_page), safe=False)
