using System;
using System.Collections.Generic;

namespace DL;

public partial class VwTiempoAudit
{
    public string? Client { get; set; }

    public string? ClientName { get; set; }

    public string? EmployeeNumber { get; set; }

    public string? EmployeeName { get; set; }

    public string? Engagement { get; set; }

    public string? EngagementDesc { get; set; }

    public string? CurrentEngagementPartner { get; set; }

    public string? CurrentEngagementPartnerName { get; set; }

    public string? CurrentEngagementProfitCenterServiceLine { get; set; }

    public string? CurrentEngagementProfitCenterFunction { get; set; }

    public string? CurrentEngagementProfitCenter { get; set; }

    public int? ChargeableHours { get; set; }

    public int? TotalHours { get; set; }
}
