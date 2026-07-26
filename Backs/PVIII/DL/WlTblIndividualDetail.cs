using System;
using System.Collections.Generic;

namespace DL;

public partial class WlTblIndividualDetail
{
    public string? EmployeeId { get; set; }

    public string? FullName { get; set; }

    public string? EmailAddress { get; set; }

    public string? LocationName { get; set; }

    public string? LocalName { get; set; }

    public long? EntityId { get; set; }

    public string? EntityName { get; set; }

    public bool? AffiliateSec { get; set; }

    public int? LocalReferredId { get; set; }

    public bool? EntityProfile { get; set; }

    public bool? SecComponent { get; set; }

    public decimal? TotalAuditHours { get; set; }

    public decimal? TotalAuditRevenue { get; set; }

    public int? CeacRisk { get; set; }

    public string? FinancialRules { get; set; }

    public string? AuditRules { get; set; }

    public int? StatutoryFs { get; set; }

    public int? Interoffice { get; set; }

    public int? Interfirm { get; set; }

    public int? ReportsToBeIssued { get; set; }

    public string? Bu { get; set; }

    public int? FiscalYear { get; set; }

    public bool? Validity { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public string? ClientNumber { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string Role { get; set; } = null!;

    public string IdP8 { get; set; } = null!;

    public int IdDb { get; set; }
}
