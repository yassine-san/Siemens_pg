from django.contrib.auth import logout
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.db import connection
from openpyxl import load_workbook
from .models import Quality


def home(request):
    if not request.user.is_authenticated:
        return redirect('login')

    username = Quality.objects.values('division').first()
    return render(request,"dashboard/home.html", {"username": username})


def quality_interface(request):
    if not request.user.is_authenticated:
        return redirect('login')
    return render(request, "dashboard/data_quality.html")


def logout_user(request):
    message = "error"
    if request.user.is_authenticated:
        logout(request)
        message = "success"

    response_data = {'message': message}
    return JsonResponse(response_data)


def excelImporter(request):
    if not request.user.is_authenticated:
        return redirect('login')
    return render(request,"dashboard/excel_import.html")


BATCH_SIZE = 1000


def upload_excel(request):
    if request.method == 'POST' and request.FILES.get('excel_file'):
        uploaded_file = request.FILES['excel_file']

        # connection = connect_sql()
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
                    connection.commit()
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


