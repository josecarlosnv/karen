using System;
using System.Collections.Generic;

namespace DL;

public partial class WlTblBuDetailsPst
{
    public string? EmployeeId { get; set; }

    public string? FullName { get; set; }

    public string? EmailAddress { get; set; }

    public int? FiscalYear { get; set; }

    public string? Bu { get; set; }

    public string? LocationName { get; set; }

    public string? LocalJobTitle { get; set; }

    public int? TypeInfId { get; set; }

    public string? Comments { get; set; }

    public bool Waiver { get; set; }

    public int NonClientFacingHours { get; set; }

    public string? Activities { get; set; }

    public decimal? TotalAuditHours { get; set; }

    public decimal? TotalAuditRevenue { get; set; }

    public decimal? Amount { get; set; }

    public decimal? ContingentPercentage { get; set; }

    public int? ReportsEdosFin { get; set; }

    public int? ReportsFiscal { get; set; }

    public int? ReportsLsqcr { get; set; }

    public int? ReportsEqcr { get; set; }

    public decimal? HoursLsqcr { get; set; }

    public decimal? HoursEqcr { get; set; }

    public string? ApprovalInd { get; set; }

    public string? CommentInd { get; set; }

    public bool? Validity { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string Role { get; set; } = null!;

    public string IdP8 { get; set; } = null!;

    public int IdDb { get; set; }

    public string? PreviewReviewComments { get; set; }

    public int? ColumnE { get; set; }

    public int? ColumnF { get; set; }

    public string? ColumnG { get; set; }

    public string? ColumnH { get; set; }
}
