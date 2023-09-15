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


id,Date,Equipment_material_number,	Equipment_serial_number	,Equipment_type,	Material_IVK_name,	Material_division_ID,	Material_division_text,	Func_Location_Name 	Equipment_service_partner_ID, Equipment_service_partner_text, Country_Region, Connection_Status,	Capability,	SRS_Connectivity,	RUH_Readiness,	Data_Sent,	Connection_score



date,equipment_material_number,serial_number,equipment_serial_number,equipment_type,material_ivk_name,material_division_id,material_division_text,func_location_name,equipment_service_partner_id,equipment_service_partner_text,srs_equipment_configurational_state_text,country_region,connection_status,capability,srs_connectivity,ruh_readiness,data_sent,can24,can24_connectable_per_system_type,can24_connection_per_system_type,can24_data_sent_1,can24_data_sent,can24_data_sent_formatiert,connected_can24_modul,connection_score



