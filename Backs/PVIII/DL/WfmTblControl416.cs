using System;
using System.Collections.Generic;

namespace DL;

public partial class WfmTblControl416
{
    public int Id { get; set; }

    public string? EntityNumber { get; set; }

    public string? Bufy2026 { get; set; }

    public string? Picfy2026 { get; set; }

    public string? Picfy2025 { get; set; }

    public string? Email { get; set; }

    public string? Office { get; set; }

    public string? IsNewResponsible { get; set; }

    public string? Category { get; set; }

    public string? BupicConfirmationRequired { get; set; }

    public string? EntityProfile { get; set; }

    public string? EntityName { get; set; }

    public string? AuditRules { get; set; }

    public string? FinancialRules { get; set; }

    public string? EntitySector { get; set; }

    public string? IsFrdocReq { get; set; }

    public string? IsArdocReq { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? ModifiedAt { get; set; }

    public string? ModifiedBy { get; set; }

    public DateOnly? CutOffDate { get; set; }

    public string? FrdocDescrip { get; set; }

    public string? ArdocDescrip { get; set; }

    public string? RiskAssessmentComments { get; set; }

    public bool? Vigencia { get; set; }

    public int? RiskAssessmentId { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public bool BuPicConfirmation { get; set; }

    public virtual WfmDimRiskAssessment? RiskAssessment { get; set; }
}
