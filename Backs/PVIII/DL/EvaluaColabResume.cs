using System;
using System.Collections.Generic;

namespace DL;

public partial class EvaluaColabResume
{
    public int EcrId { get; set; }

    public string IdColabEmpProy { get; set; } = null!;

    public string? ClientName { get; set; }

    public string? EntityNumber { get; set; }

    public int? EvaluatedId { get; set; }

    public int? EvaluatorId { get; set; }

    public decimal? GradeEvaluated { get; set; }

    public decimal? GradeEvaluator { get; set; }

    public bool? EvaluationType { get; set; }

    public string? Role { get; set; }

    public bool? PreEvaRealiced { get; set; }

    public bool? IsClosed { get; set; }

    public bool? IsCurrent { get; set; }

    public int? ReactivesNum { get; set; }

    public int? Fy { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public int? CutOff { get; set; }

    public DateTime? CreatedTime { get; set; }

    public DateTime? ModifiedTime { get; set; }

    public int? GeneratedType { get; set; }

    public string KeyReport { get; set; } = null!;

    public string? OwnerEmail { get; set; }

    public virtual ScorefyDimCutOff? CutOffNavigation { get; set; }

    public virtual ScorefyDimGeneratedType? GeneratedTypeNavigation { get; set; }
}
