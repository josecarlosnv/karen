using System;
using System.Collections.Generic;

namespace DL;

public partial class ReporteAuditTiempo
{
    public DateOnly? LoadDate { get; set; }

    public string? Client { get; set; }

    public string? ClientName { get; set; }

    public string? EmployeeNumber { get; set; }

    public string? EmployeeCompanyCode { get; set; }

    public string? CurrentEmployeeStaffLevel { get; set; }

    public string? Engagement { get; set; }

    public string? EngagementDesc { get; set; }

    public string? InternalCode { get; set; }

    public string? BaseHours { get; set; }

    public string? ChargeableHours { get; set; }

    public string? NapHours { get; set; }

    public string? LeaveTotalHours { get; set; }

    public string? TrainingHours { get; set; }

    public string? TotalHours { get; set; }

    public string? EmployeeName { get; set; }

    public string? InternalProject { get; set; }

    public string? InternalCodeDesc { get; set; }

    public string? CurrentEmployeeStaffLevelDesc { get; set; }

    public string? CurrentEngagementProfitCenter { get; set; }

    public string? CurrentEngagementProfitCenterDesc { get; set; }

    public string? CurrentEngagementProfitCenterServiceLine { get; set; }

    public string? CurrentEngagementProfitCenterServiceLineDesc { get; set; }

    public string? CurrentEngagementProfitCenterFunction { get; set; }

    public string? CurrentEngagementProfitCenterFunctionDesc { get; set; }

    public string? FiscalYearPeriodFromPostingDate { get; set; }

    public string? CurrentEngagementPartner { get; set; }

    public string? CurrentEngagementPartnerName { get; set; }

    public string? Administrative { get; set; }

    public string? OtherHours { get; set; }

    public string? EngagementDevelopment { get; set; }

    public string? CurrentEmployeeStatus { get; set; }

    public string? CurrentEmployeeStatusDesc { get; set; }
}
