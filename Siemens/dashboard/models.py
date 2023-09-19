from django.db import models


class Can24(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
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
        db_table = 'can24'

    def __str__(self):
        return self.serial_number


class Quality(models.Model):
    id = models.AutoField(primary_key=True)
    week = models.CharField(max_length=255)
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

    def to_dict(self):
        return {
            'serialnumber': self.serialnumber,
            'materialnumber': self.materialnumber,
            'servicepartnername': self.servicepartnername,
            'servicepartner': self.servicepartner,
            'cstcountry': self.cstcountry,
            'status': self.status,
            'substatus': self.substatus,
            'onstockdetails': self.onstockdetails,
            # Add other fields as needed
        }

    class Meta:
        db_table = 'exceltable'

    def __str__(self):
        return self.serialnumber


class Srs(models.Model):
    id = models.AutoField(primary_key=True)
    date = models.DateField()
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
        db_table = 'srs_connectivity'

    def __str__(self):
        return self.equipment_serial_number


class Ccr(models.Model):
    id = models.AutoField(primary_key=True)
    system_serial_number = models.CharField(max_length=255, null=True, blank=True)
    system_material_number = models.CharField(max_length=255, null=True, blank=True)
    product_name = models.CharField(max_length=255, null=True, blank=True)
    delivery_date = models.CharField(max_length=255, null=True, blank=True)
    handover_date = models.CharField(max_length=255, null=True, blank=True)
    contract_start_date = models.CharField(max_length=255, null=True, blank=True)
    contract_end_date = models.CharField(max_length=255, null=True, blank=True)
    contract_number = models.CharField(max_length=255, null=True, blank=True)
    eos = models.CharField(max_length=255, null=True, blank=True)
    eod = models.CharField(max_length=255, null=True, blank=True)
    end_customer = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)
    modality = models.CharField(max_length=255, null=True, blank=True)
    service_partner = models.CharField(max_length=255, null=True, blank=True)
    service_partner_id = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        db_table = 'ccr'

    def _str_(self):
        return f"ccr {self.system_serial_number}"


class Partner(models.Model):
    partnerid = models.IntegerField(primary_key=True)
    partnername = models.CharField(blank=True, null=True)
    email = models.CharField(blank=True, null=True)

    class Meta:
        db_table = 'partner'
        managed = False
