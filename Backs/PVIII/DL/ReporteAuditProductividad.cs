using System;
using System.Collections.Generic;

namespace DL;

public partial class ReporteAuditProductividad
{
    public DateOnly? LoadDate { get; set; }

    public string? EmployeeNumber { get; set; }

    public string? EmployeeCompanyCode { get; set; }

    public string? EmployeeProfitCenter { get; set; }

    public string? EmployeeProfitCenterFunction { get; set; }

    public string? EmployeeProfitCenterFunctionDesc { get; set; }

    public string? CurrentEmployeeBusinessArea { get; set; }

    public string? CurrentEmployeeStaffLevel { get; set; }

    public string? BaseHours { get; set; }

    public string? ChargeableHours { get; set; }

    public string? NapHours { get; set; }

    public string? LeaveTotalHours { get; set; }

    public string? TrainingHours { get; set; }

    public string? TotalHours { get; set; }

    public string? EmployeeName { get; set; }

    public string? InternalProject { get; set; }

    public string? EmployeeProfitCenterDesc { get; set; }

    public string? CurrentEmployeeBusinessAreaDesc { get; set; }

    public string? CurrentEmployeeStaffLevelDesc { get; set; }

    public string? FiscalYearPeriodFromPostingDate { get; set; }

    public string? Administrative { get; set; }

    public string? OtherHours { get; set; }

    public string? EngagementDevelopment { get; set; }

    public string? CurrentEmployeeStatus { get; set; }

    public string? CurrentEmployeeStatusDesc { get; set; }
}
