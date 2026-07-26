using System;
using System.Collections.Generic;

namespace DL;

public partial class BackupWorkload
{
    public int BwId { get; set; }

    public string FullName { get; set; } = null!;

    public int EmployeeId { get; set; }

    public string? EmailAddressBusiness { get; set; }

    public string? LocationName { get; set; }

    public string? LocalJobTitle { get; set; }

    public int? NonClientFacingHours { get; set; }

    public string? Activities { get; set; }

    public int? TotalThAudit { get; set; }

    public int? TotalTinAudit { get; set; }

    public int? ReportsFiscal { get; set; }

    public int? ReportsEqcr { get; set; }

    public int? ReportsLsqcr { get; set; }

    public int? ReportsLeap { get; set; }

    public int? ReportsFs { get; set; }

    public int? HoursEqcr { get; set; }

    public int? HoursLsqcr { get; set; }

    public int? Monto { get; set; }

    public decimal? PorcentajeContingente { get; set; }

    public string? Comments { get; set; }

    public bool? Waiver { get; set; }

    public string? EstatusEmployee { get; set; }

    public int FiscalYear { get; set; }

    public string? Bu { get; set; }

    public string? Category { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public string? ReportsEdosFin { get; set; }
}
