from django.contrib.auth import logout
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.db import connection
from openpyxl import load_workbook
from django.http import JsonResponse
from .models import Quality
from .models import Srs
from django.db.models import Count
from datetime import datetime
from datetime import date





from users.models import AccountManager, Account
from django.db.models import Q


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


def get_missing_fl_countries(request):

    
    user = request.user
    partner = get_user_partenariat(user)





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
    return JsonResponse(list(missing_fl_countries), safe=False)


def get_missing_customer_name(request):
    missing_fl_countries = Quality.objects.filter(customername='').values(
        'servicepartner', 'materialnumber', 'serialnumber',
        'modality', 'ivkname', 'status', 'substatus', 'customername'
    )
    return JsonResponse(list(missing_fl_countries), safe=False)


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

        #AccountManager.create_user(self, email, password, partenariat, 3)

        user = Account.objects.create_user(email, password, partenariat, 3)

        response_data = {'message': 'User registered successfully'}

        return JsonResponse(response_data)

    #response_data = {'status': -1, 'message': message}


    #response_data = {'status': -1, 'message': message}




# calculating the pourcentage of the cards
def data_quality(request):
    # Query the database to retrieve the required data
    excel_data = Quality.objects.all()

    total_records = excel_data.count()
    print(total_records)

    # Define functions to calculate the percentages
    def calculate_percentage(status, substatus, column_name):
        print("status:", status)
        print("substatus:", substatus)
        # fl_country =Quality.flcountry

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

    context = {
        'active_active_flcountry_percentage': active_active_flcountry_percentage,
        'active_active_cstname_percentage': active_active_cstname_percentage,
        'active_shipped_flcountry_percentage': active_shipped_flcountry_percentage,
        'active_shipped_cstname_percentage': active_shipped_cstname_percentage,
        'inactive_on_stock_flcountry_percentage': inactive_on_stock_flcountry_percentage,
        'inactive_on_stock_cstname_percentage': inactive_on_stock_cstname_percentage,
    }

    return render(request, 'dashboard/data_quality.html', context)


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



def SRS_Connectivity(request):
       # chart_data = get_srs_chart_data()

        
        return render(request, 'dashboard/SRS.html')

def get_srs_connectivity_chart_data(request):
    dates = [date(2023, 5, 15), date(2023, 5, 30), date(2023, 6, 15), date(2023, 7, 1), date(2023, 7, 15), date(2023, 8, 1), date(2023, 8, 15)]
    
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
    dates = [date(2023, 5, 15), date(2023, 5, 30), date(2023, 6, 15), date(2023, 7, 1), date(2023, 7, 15), date(2023, 8, 1), date(2023, 8, 15)]
    
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
    dates = [date(2023, 5, 15), date(2023, 5, 30), date(2023, 6, 15), date(2023, 7, 1), date(2023, 7, 15), date(2023, 8, 1), date(2023, 8, 15)]
    
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
    dates = [date(2023, 5, 15), date(2023, 5, 30), date(2023, 6, 15), date(2023, 7, 1), date(2023, 7, 15), date(2023, 8, 1), date(2023, 8, 15)]
    
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







