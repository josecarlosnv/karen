using System;
using System.Collections.Generic;

namespace DL;

public partial class ScorefyTblEvaluationsGenerate
{
    public int PkEvalGene { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public long ClientId { get; set; }

    public string ClientName { get; set; } = null!;

    public int EmployeeId { get; set; }

    public string EmployeeName { get; set; } = null!;

    public string LocalJobLevelName { get; set; } = null!;

    public string EmailAddressBusiness { get; set; } = null!;

    public string? Bu { get; set; }

    public string? LocationName { get; set; }

    public decimal? TotalHours { get; set; }

    public decimal? ChargeableHours { get; set; }

    public bool GeneratedEvaluation { get; set; }

    public int? GeneratedType { get; set; }

    public int? CutOff { get; set; }

    public string KeyReport { get; set; } = null!;

    public bool IsCurrent { get; set; }
}
