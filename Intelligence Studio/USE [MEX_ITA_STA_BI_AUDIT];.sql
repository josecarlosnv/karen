USE [MEX_ITA_STA_BI_AUDIT];
GO

SET ANSI_NULLS ON;
GO

SET QUOTED_IDENTIFIER ON;
GO

CREATE OR ALTER VIEW [dbo].[vw_scorefy_Employees] AS

WITH Ex_Last AS (
    SELECT *
    FROM (
        SELECT
            E.*,
            ROW_NUMBER() OVER (
                PARTITION BY E.Key_Report
                ORDER BY E.Event_Number DESC
            ) AS Mayor
        FROM scorefy_tbl_Exceptions AS E
    ) t
    WHERE t.Mayor = 1
),

TotalEvaluations AS (
    SELECT
        sfy.Employee_ID,
        COUNT(*) AS TotalEvaluations
    FROM dbo.scorefy_tbl_EvaluationsGenerate AS sfy
    WHERE sfy.Is_Current = 1
      AND NOT EXISTS (
            SELECT 1
            FROM Ex_Last AS ex
            WHERE ex.Key_Report = sfy.Key_Report
              AND ex.Is_Exception = 1
      )
    GROUP BY sfy.Employee_ID
),

CompletedEvaluations AS (
    SELECT
        gen.Employee_ID,
        COUNT(*) AS CompletedEvaluations
    FROM dbo.scorefy_tbl_EvaluationsGenerate AS gen
    WHERE gen.Is_Current = 1
      AND NOT EXISTS (                       -- MISMO filtro de excepciones que Total
            SELECT 1
            FROM Ex_Last AS ex
            WHERE ex.Key_Report = gen.Key_Report
              AND ex.Is_Exception = 1
      )
      AND EXISTS (                           -- ...que además tenga resumen completado
            SELECT 1
            FROM dbo.EvaluaColabResume AS sfy
            WHERE sfy.Key_Report = gen.Key_Report
              AND sfy.FY = 2026
              AND sfy.Cut_Off IN (2, 3)
              AND (sfy.IsCurrent = 1 OR sfy.IsCurrent IS NULL)
              AND sfy.IsClosed = 0
      )
    GROUP BY gen.Employee_ID
),

EmployeeUniverse AS (
    SELECT DISTINCT
        CAST(E.Employee_Id AS INT) AS Employee_ID
    FROM dbo.Employee_Data E
    WHERE
        E.Local_Job_Level_Name IN (
            'Senior Manager','Manager','Senior','Staff',
            'Staff in Charge','Supervising Senior','Director','Partner'
        )
        AND E.Employee_Sub_Class_Name IN (
            'Salaried Part Time','Salaried Full Time','Equity Partner'
        )

    UNION

    SELECT DISTINCT
        CAST(E.Employee_Id AS INT) AS Employee_ID
    FROM dbo.Employee_Data_Inactive E
    WHERE
        E.Local_Job_Level_Name IN (
            'Senior Manager','Manager','Senior','Staff',
            'Staff in Charge','Supervising Senior','Director','Partner'
        )
        AND E.Employee_Sub_Class_Name IN (
            'Salaried Part Time','Salaried Full Time','Equity Partner'
        )
        AND (
            E.Estatus_Employee <> 'INACTIVE'
            OR (
                E.Estatus_Employee = 'INACTIVE'
                AND E.End_date IS NOT NULL
                AND DATEDIFF(MONTH, E.End_date, GETDATE()) <= 12
            )
        )
),

Diferencias AS (
    SELECT
        eu.Employee_ID,
        COALESCE(t.TotalEvaluations, 0) AS TotalEvaluations,
        COALESCE(c.CompletedEvaluations, 0) AS CompletedEvaluations,
        COALESCE(t.TotalEvaluations, 0) - COALESCE(c.CompletedEvaluations, 0) AS PendingEvaluations,
        CASE
            WHEN COALESCE(c.CompletedEvaluations, 0) = COALESCE(t.TotalEvaluations, 0) THEN 'Yes'
            ELSE 'No'
        END AS AllEvaluationsCompleted
    FROM EmployeeUniverse eu
    LEFT JOIN TotalEvaluations t
        ON eu.Employee_ID = t.Employee_ID
    LEFT JOIN CompletedEvaluations c
        ON eu.Employee_ID = c.Employee_ID
),

E_Last AS (
    SELECT *
    FROM (
        SELECT
            E.*,
            RANK() OVER (
                PARTITION BY E.Employee_ID
                ORDER BY E.Event_Number DESC, E.Created DESC
            ) AS Mayor
        FROM dbo.scorefy_tbl_PersonalProfile E
    ) t
    WHERE Mayor = 1
),

active AS (
    SELECT
        CONCAT(E.Last_Name, ', ', E.First_Name) AS Full_name,
        E.Local_Job_Level_Name,
        E.Cost_Center,
        CAST(E.Employee_Id AS INT) AS Employee_Id,
        E.Location_Name,
        E.Email_Address_Business,
        C.BU,
        EmployeeType =
            CASE
                WHEN E.Local_Job_Level_Name IN ('Director', 'Partner') THEN 1
                WHEN E.Local_Job_Level_Name IN (
                    'Senior Manager','Manager','Senior','Staff',
                    'Staff in Charge','Supervising Senior'
                ) THEN 2
            END,
        1 AS IsActive,
        CASE
            WHEN RR.PMName IS NOT NULL THEN RR.PMName
            WHEN eq.Last_Name IS NOT NULL THEN CONCAT(eq.Last_Name, ', ', eq.First_Name)
            ELSE NULL
        END AS PerformanceManager,
        COALESCE(RR.PMEmail, eq.Email_Address_Business) AS PMEmail,
        CASE
            WHEN sp.English_Level IS NULL OR LTRIM(RTRIM(sp.English_Level)) = '' THEN 'Unknown'
            ELSE sp.English_Level
        END AS English_Level,
        CASE
            WHEN COALESCE(RR.Proffesional_Degree, N.[is_graduated]) = 0 THEN 'Yes'
            WHEN COALESCE(RR.Proffesional_Degree, N.[is_graduated]) = 1 THEN 'No'
            ELSE 'Unknown'
        END AS Is_Graduated,
        D.AllEvaluationsCompleted,
        D.CompletedEvaluations,
        D.PendingEvaluations,
        D.TotalEvaluations,
        C.Segmento,
        CASE
            WHEN mpc.EmployeeId IS NULL THEN 'Not Started'
            ELSE 'Completed'
        END AS ManagerPerformanceConclusionStatus
    FROM dbo.Employee_Data E
    LEFT JOIN dbo.CatalogoBU C
        ON E.Cost_Center = C.CostCenter
    LEFT JOIN E_Last RR
        ON E.Employee_Id = RR.Employee_ID
    LEFT JOIN dbo.Employee_Data eq
        ON eq.Employee_Id = E.Manager
    LEFT JOIN dbo.vw_aip_dim_staff sp
        ON E.Employee_Id = sp.id
    LEFT JOIN dbo.aip_tbl_audit_notes N
        ON N.employee_id = E.Employee_Id
    LEFT JOIN Diferencias d
        ON d.Employee_ID = CAST(E.Employee_Id AS INT)
    LEFT JOIN dbo.scorefy_tbl_ManagerPerformanceConclusion mpc
        ON mpc.EmployeeId = E.Employee_Id
       AND mpc.FY = 2026
    WHERE
        E.Local_Job_Level_Name IN (
            'Senior Manager','Manager','Senior','Staff',
            'Staff in Charge','Supervising Senior','Director','Partner'
        )
        AND E.Employee_Sub_Class_Name IN (
            'Salaried Part Time','Salaried Full Time','Equity Partner'
        )
),

inactive AS (
    SELECT
        CONCAT(E.Last_Name, ', ', E.First_Name) AS Full_name,
        E.Local_Job_Level_Name,
        E.Cost_Center,
        CAST(E.Employee_Id AS INT) AS Employee_Id,
        E.Location_Name,
        E.Email_Address_Business,
        C.BU,
        EmployeeType =
            CASE
                WHEN E.Local_Job_Level_Name IN ('Director', 'Partner') THEN 1
                WHEN E.Local_Job_Level_Name IN (
                    'Senior Manager','Manager','Senior','Staff',
                    'Staff in Charge','Supervising Senior'
                ) THEN 2
            END,
        0 AS IsActive,
        CASE
            WHEN RR.PMName IS NOT NULL THEN RR.PMName
            WHEN eq.Last_Name IS NOT NULL THEN CONCAT(eq.Last_Name, ', ', eq.First_Name)
            ELSE NULL
        END AS PerformanceManager,
        COALESCE(RR.PMEmail, eq.Email_Address_Business) AS PMEmail,
        CASE
            WHEN sp.English_Level IS NULL OR LTRIM(RTRIM(sp.English_Level)) = '' THEN 'Unknown'
            ELSE sp.English_Level
        END AS English_Level,
        CASE
            WHEN COALESCE(RR.Proffesional_Degree, N.[is_graduated]) = 0 THEN 'Yes'
            WHEN COALESCE(RR.Proffesional_Degree, N.[is_graduated]) = 1 THEN 'No'
            ELSE 'Unknown'
        END AS Is_Graduated,
        D.AllEvaluationsCompleted,
        D.CompletedEvaluations,
        D.PendingEvaluations,
        D.TotalEvaluations,
        C.Segmento,
        CASE
            WHEN mpc.EmployeeId IS NULL THEN 'Not Started'
            ELSE 'Completed'
        END AS ManagerPerformanceConclusionStatus
    FROM dbo.Employee_Data_Inactive E
    LEFT JOIN dbo.CatalogoBU C
        ON E.Cost_Center = C.CostCenter
    LEFT JOIN E_Last RR
        ON E.Employee_Id = RR.Employee_ID
    LEFT JOIN dbo.Employee_Data eq
        ON eq.Employee_Id = E.Manager
    LEFT JOIN dbo.vw_aip_dim_staff sp
        ON E.Employee_Id = sp.id
    LEFT JOIN dbo.aip_tbl_audit_notes N
        ON N.employee_id = E.Employee_Id
    LEFT JOIN Diferencias d
        ON d.Employee_ID = CAST(E.Employee_Id AS INT)
    LEFT JOIN dbo.scorefy_tbl_ManagerPerformanceConclusion mpc
        ON mpc.EmployeeId = E.Employee_Id
       AND mpc.FY = 2026
    WHERE
        E.Local_Job_Level_Name IN (
            'Senior Manager','Manager','Senior','Staff',
            'Staff in Charge','Supervising Senior','Director','Partner'
        )
        AND E.Employee_Sub_Class_Name IN (
            'Salaried Part Time','Salaried Full Time','Equity Partner'
        )
        AND (
            E.Estatus_Employee <> 'INACTIVE'
            OR (
                E.Estatus_Employee = 'INACTIVE'
                AND E.End_date IS NOT NULL
                AND DATEDIFF(MONTH, E.End_date, GETDATE()) <= 12
            )
        )
)

SELECT * FROM active
UNION ALL
SELECT * FROM inactive;
GO
