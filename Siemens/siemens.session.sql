drop table auth_group cascade;
drop table auth_group_permissions cascade;
drop TABLE auth_permission cascade;
drop table auth_user_groups cascade;
drop table users_account cascade;
drop table exceltable cascade;
drop table ccr cascade;
drop table srs_connectivity cascade;
drop table can24 cascade;
drop table django_admin_log cascade;
drop table django_content_type cascade;
drop table django_migrations cascade;
drop table django_session cascade;




select * from srs_connectivity;

delete from srs_connectivity;

select * from can24;


select * from ccr;



#### srs_connectivity

id,Date,Equipment_material_number,	Equipment_serial_number	,Equipment_type,	Material_IVK_name,	Material_division_ID,	Material_division_text,	Func_Location_Name 	Equipment_service_partner_ID, Equipment_service_partner_text, Country_Region, Connection_Status,	Capability,	SRS_Connectivity,	RUH_Readiness,	Data_Sent,	Connection_score



#### can24

date,equipment_material_number,serial_number,equipment_serial_number,equipment_type,material_ivk_name,material_division_id,material_division_text,func_location_name,equipment_service_partner_id,equipment_service_partner_text,srs_equipment_configurational_state_text,country_region,connection_status,capability,srs_connectivity,ruh_readiness,data_sent,can24,can24_connectable_per_system_type,can24_connection_per_system_type,can24_data_sent_1,can24_data_sent,can24_data_sent_formatiert,connected_can24_modul,connection_score




#### ccr

id,system_serial_number,system_material_number,product_name,delivery_date,handover_date,contract_start_date,contract_end_date,contract_number,eos,eod,end_customer,city,country,modality,service_partner,service_partner_id



select count(distinct system_serial_number) from ccr join exceltable on ccr.system_serial_number = exceltable.serialnumber and ccr.system_material_number = exceltable.materialnumber and ccr.service_partner_id = exceltable.servicepartner and exceltable.status= 'active' and exceltable.substatus= 'active';


select count(distinct serialnumber) from exceltable where status = 'active' and substatus = 'active'

select * from srs_connectivity;

select distinct country from ccr;

select * from exceltable;

select distinct country from ccr where modality = 'MR' 


select *
from ccr;


SELECT COUNT(*) AS CountResult
FROM Ccr
WHERE system_serial_number IS NOT NULL
    AND system_material_number <> '';

 count_result = Ccr.objects.filter(system_serial_number__isnull=False, system_material_number__gt='').count()

select count(*) from exceltable ex, ccr join on  where status = 'active' and substatus = 'active' and ;


select * from exceltable;

select * from ccr;


select count(*) from ccr join exceltable on ccr.system_serial_number = exceltable.serialnumber
 and ccr.system_material_number = exceltable.materialnumber and ccr.service_partner_id = exceltable.servicepartner 
where exceltable.status= 'active' and exceltable.substatus= 'active' ;


count_result = Ccr.objects.filter(
    system_serial_number__isnull=False,
    system_material_number__gt='',
    service_partner_id__isnull=False,
    exceltable__serialnumber=F('system_serial_number'),
    exceltable__materialnumber=F('system_material_number'),
    exceltable__servicepartner=F('service_partner_id'),
    exceltable__status='active',
    exceltable__substatus='active'
).count()


SELECT CONCAT(FORMAT( COUNT(CASE WHEN contract_end_date IS NOT NULL THEN 1 END) * 100.0 / COUNT(*),'0' ), '%') AS Result FROM CCR;


SELECT 
    CONCAT(
            COUNT(CASE WHEN contract_end_date IS NOT NULL THEN 1 END) * 100.0 / COUNT(*),
            '%'
    ) AS Result
FROM ccr;


select count(case when contract_end_date is not null then 1 end)/ as Result from ccr; 


select count(*) from ccr where system_serial_number is not null and system_material_number <> '';




create table partner(
    partnerid integer primary key ,
    partnername varchar,
    email varchar
);

insert into partner values (910163, 'IGE-Tn', '@ige.com.tn');
insert into partner values (910167, 'IGE-Int', '@ige_int.com');
insert into partner values (910165, 'medimage', '@medimage.fr');
insert into partner values (910191, 'Tecnimed', '@tecnimedangola.com');
insert into partner values (910192, 'Elsmed', '@elsmed.com');
insert into partner values (910183, 'naroge', '@naroge.com');
insert into partner values (910187, 'EMS', '@emscongo.com');


select * from users_account;


select * from exceltable;

select * from partner

"partnerid","partnername",
910163,"IGE-Tn",
910167,"IGE-Int",
910165,"medimage",
910191,"Tecnimed",
910192,"Elsmed",
910183,"naroge",
910187,"EMS",


select * from ccr where country = 'LR'

delete from ccr where end_customer = 'hopital chihaja'