SELECT * FROM [gesiltech_digital].[dbo].[User_Master];

select * from [dbo].[User_Master];
select * from [dbo].[User_Personal_Details];
select * from [dbo].[User_BankDetails];
select * from [dbo].[User_KYC_Details];


select * from [dbo].[User_Master] where 1 != 1;

select * from [dbo].[User_KYC_Details] where Pancard_Number = '';

select * from [dbo].[User_KYC_Details] where Pancard_Number is not null;

--delete from [dbo].[User_KYC_Details] where KYC_ID = 2;

---------------------------------------------
---------------------------------------------
------------- TRUNCATE 
---------------------------------------------
---------------------------------------------
-- TRUNCATE table [dbo].[User_Master];
-- TRUNCATE table [dbo].[User_Personal_Details];
-- TRUNCATE table [dbo].[User_BankDetails];
-- TRUNCATE table [dbo].[User_KYC_Details];
---------------------------------------------
---------------------------------------------
---------------------------------------------