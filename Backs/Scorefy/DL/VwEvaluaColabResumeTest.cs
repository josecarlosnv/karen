using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEvaluaColabResumeTest
{
    public int EcrId { get; set; }

    public int? PkEvalGene { get; set; }

    public string IdColabEmpProy { get; set; } = null!;

    public string? ClientName { get; set; }

    public string? EntityNumber { get; set; }

    public decimal? TotalHours { get; set; }

    public int? EvaluatedId { get; set; }

    public string? EvaluatedName { get; set; }

    public string? EvaluatedEmail { get; set; }

    public string? Bu { get; set; }

    public string? Role { get; set; }

    public string? Office { get; set; }

    public decimal? GradeEvaluated { get; set; }

    public decimal? GradeEvaluator { get; set; }

    public int? EvaluatorId { get; set; }

    public string? EvaluatorName { get; set; }

    public string? EvaluatorEmail { get; set; }

    public bool? IsClosed { get; set; }

    public int? CutOff { get; set; }

    public DateTime? CreatedTime { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? ModifiedTime { get; set; }

    public string? ModifiedBy { get; set; }

    public int? TotalReactivos { get; set; }

    public int? TotalReactivosRes { get; set; }

    public int? GeneratedType { get; set; }

    public string KeyReport { get; set; } = null!;

    public string? ResumeColA { get; set; }

    public string? ResumeColB { get; set; }

    public int? ResumeColC { get; set; }

    public int? ResumeColD { get; set; }

    public string? DetailColA { get; set; }

    public string? DetailColB { get; set; }

    public int? DetailColC { get; set; }

    public int? DetailColD { get; set; }
}
