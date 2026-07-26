using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEvaluaColabResume
{
    public int EcrId { get; set; }

    public int PkEvalGene { get; set; }

    public string IdColabEmpProy { get; set; } = null!;

    public string? ClientName { get; set; }

    public string? EntityNumber { get; set; }

    public decimal? TotalHours { get; set; }

    public int? EvaluatedId { get; set; }

    public string EvaluatedName { get; set; } = null!;

    public string EvaluatedEmail { get; set; } = null!;

    public string? Bu { get; set; }

    public string? Role { get; set; }

    public string? Office { get; set; }

    public decimal? GradeEvaluated { get; set; }

    public decimal? GradeEvaluator { get; set; }

    public int? EvaluatorId { get; set; }

    public string EvaluatorName { get; set; } = null!;

    public string? EvaluatorEmail { get; set; }

    public bool? IsClosed { get; set; }

    public int? CutOff { get; set; }

    public DateTime? CreatedTime { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? ModifiedTime { get; set; }

    public string? ModifiedBy { get; set; }

    public int? GeneratedType { get; set; }

    public string KeyReport { get; set; } = null!;

    public int? ColumnC { get; set; }
}
