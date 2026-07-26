using System;
using System.Collections.Generic;

namespace DL;

public partial class VwRealWorkload
{
    public string? EmployeeId { get; set; }

    public string? EmployeeName { get; set; }

    public string Role { get; set; } = null!;

    public int? Quarter { get; set; }

    public double? TotalHours { get; set; }

    public double? TotalRevenue { get; set; }

    public string? EmailAddressBusiness { get; set; }

    public string? LocationName { get; set; }

    public string? LocalJobTitle { get; set; }

    public string? Bu { get; set; }

    public int? NonClientFacingHours { get; set; }

    public string? Activities { get; set; }

    public int? FiscalYear { get; set; }

    public int? TotalThAudit { get; set; }

    public int? TotalTinAudit { get; set; }

    public string? ReportsEdosFin { get; set; }

    public int? ReportsFiscal { get; set; }

    public int? HoursEqcr { get; set; }

    public int? ReportsEqcr { get; set; }

    public int? HoursLsqcr { get; set; }

    public int? ReportsLsqcr { get; set; }

    public int? ReportsLeap { get; set; }

    public int? Monto { get; set; }

    public decimal? PorcentajeContingente { get; set; }

    public string? Comments { get; set; }

    public bool? Waiver { get; set; }

    public string? EstimationComments { get; set; }

    public string? Estimation { get; set; }

    public string? Percentage { get; set; }

    public string? Aprobacion { get; set; }
}
