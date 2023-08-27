from django.db import models


class Can24(models.Model):
    date = models.DateField(primary_key=True)
    equipment_material_number = models.CharField(max_length=255, blank=True, null=True)
    serial_number = models.CharField(max_length=255, blank=True, null=True)
    equipment_serial_number = models.CharField(max_length=255, blank=True, null=True)
    equipment_type = models.CharField(max_length=255, blank=True, null=True)
    material_ivk_name = models.CharField(max_length=255, blank=True, null=True)
    material_division_id = models.CharField(max_length=255, blank=True, null=True)
    material_division_text = models.CharField(max_length=255, blank=True, null=True)
    func_location_name = models.CharField(max_length=255, blank=True, null=True)
    equipment_service_partner_id = models.CharField(max_length=255, blank=True, null=True)
    equipment_service_partner_text = models.CharField(max_length=255, blank=True, null=True)
    srs_equipment_configurational_state_text = models.CharField(max_length=255, blank=True, null=True)
    country_region = models.CharField(max_length=255, blank=True, null=True)
    connection_status = models.CharField(max_length=255, blank=True, null=True)
    capability = models.CharField(max_length=255, blank=True, null=True)
    srs_connectivity = models.CharField(max_length=255, blank=True, null=True)
    ruh_readiness = models.CharField(max_length=255, blank=True, null=True)
    data_sent = models.CharField(max_length=255, blank=True, null=True)
    can24 = models.CharField(max_length=255, blank=True, null=True)
    can24_connectable_per_system_type = models.CharField(max_length=255, blank=True, null=True)
    can24_connection_per_system_type = models.CharField(max_length=255, blank=True, null=True)
    can24_data_sent_1 = models.CharField(max_length=255, blank=True, null=True)
    can24_data_sent = models.CharField(max_length=255, blank=True, null=True)
    can24_data_sent_formatiert = models.CharField(max_length=255, blank=True, null=True)
    connected_can24_modul = models.CharField(max_length=255, blank=True, null=True)
    connection_score = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'can24'


class Quality(models.Model):
    week = models.CharField(primary_key=True,max_length=255)
    servicepartnername = models.CharField(max_length=255, blank=True, null=True)
    division = models.CharField(max_length=255, blank=True, null=True)
    modality = models.CharField(max_length=255, blank=True, null=True)
    materialnumber = models.CharField(max_length=255, blank=True, null=True)
    serialnumber = models.CharField(max_length=255, blank=True, null=True)
    ivkname = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    customername = models.CharField(max_length=255, blank=True, null=True)
    cinumber = models.CharField(max_length=255, blank=True, null=True)
    customerid = models.CharField(max_length=255, blank=True, null=True)
    ponumber = models.CharField(max_length=255, blank=True, null=True)
    ordernumber = models.CharField(max_length=255, blank=True, null=True)
    funclocationcode = models.CharField(max_length=255, blank=True, null=True)
    eod = models.CharField(max_length=255, blank=True, null=True)
    eos = models.CharField(max_length=255, blank=True, null=True)
    citycustomer = models.CharField(max_length=255, blank=True, null=True)
    cstcity = models.CharField(max_length=255, blank=True, null=True)
    cstcountry = models.CharField(max_length=255, blank=True, null=True)
    cstname = models.CharField(max_length=255, blank=True, null=True)
    cststreet = models.CharField(max_length=255, blank=True, null=True)
    customerenddate = models.CharField(max_length=255, blank=True, null=True)
    customernumber = models.CharField(max_length=255, blank=True, null=True)
    customerstartdate = models.CharField(max_length=255, blank=True, null=True)
    deliverydate = models.CharField(max_length=255, blank=True, null=True)
    ddate = models.CharField(max_length=255, blank=True, null=True)
    flcity = models.CharField(max_length=255, blank=True, null=True)
    flcomments = models.CharField(max_length=255, blank=True, null=True)
    flcountry = models.CharField(max_length=255, blank=True, null=True)
    flstreet = models.CharField(max_length=255, blank=True, null=True)
    flzip = models.CharField(max_length=255, blank=True, null=True)
    funclocationname1 = models.CharField(max_length=255, blank=True, null=True)
    funclocationname2 = models.CharField(max_length=255, blank=True, null=True)
    handoverdate = models.CharField(max_length=255, blank=True, null=True)
    servicepartner = models.CharField(max_length=255, blank=True, null=True)
    substatus = models.CharField(max_length=255, blank=True, null=True)
    onstockdetails = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'exceltable'


class Srs(models.Model):
    date = models.DateField(primary_key=True)
    equipment_material_number = models.CharField(max_length=255, blank=True, null=True)
    equipment_serial_number = models.CharField(max_length=255, blank=True, null=True)
    equipment_type = models.CharField(max_length=255, blank=True, null=True)
    material_ivk_name = models.CharField(max_length=255, blank=True, null=True)
    material_division_id = models.CharField(max_length=255, blank=True, null=True)
    material_division_text = models.CharField(max_length=255, blank=True, null=True)
    func_location_name = models.CharField(max_length=255, blank=True, null=True)
    equipment_service_partner_id = models.CharField(max_length=255, blank=True, null=True)
    equipment_service_partner_text = models.CharField(max_length=255, blank=True, null=True)
    country_region = models.CharField(max_length=255, blank=True, null=True)
    connection_status = models.CharField(max_length=255, blank=True, null=True)
    capability = models.CharField(max_length=255, blank=True, null=True)
    srs_connectivity = models.CharField(max_length=255, blank=True, null=True)
    ruh_readiness = models.CharField(max_length=255, blank=True, null=True)
    data_sent = models.CharField(max_length=255, blank=True, null=True)
    connection_score = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'srs_connectivity'
