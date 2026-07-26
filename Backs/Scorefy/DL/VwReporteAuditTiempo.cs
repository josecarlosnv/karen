using System;
using System.Collections.Generic;

namespace DL;

public partial class VwReporteAuditTiempo
{
    public string? Client { get; set; }

    public string? ClientName { get; set; }

    public int? EmployeeNumber { get; set; }

    public string? EmployeeName { get; set; }

    public string? Engagement { get; set; }

    public string? EngagementDesc { get; set; }

    public string? CurrentEngagementProfitCenterServiceLine { get; set; }

    public string? CurrentEngagementProfitCenterFunction { get; set; }

    public string? CurrentEngagementProfitCenter { get; set; }

    public int? CurrentEngagementPartner { get; set; }

    public string? CurrentEngagementPartnerName { get; set; }

    public double? TotalHours { get; set; }

    public double? ChargeableHours { get; set; }

    public string? Bu { get; set; }
}
