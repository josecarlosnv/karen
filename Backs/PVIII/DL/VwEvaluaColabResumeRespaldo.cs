using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEvaluaColabResumeRespaldo
{
    public int EcrId { get; set; }

    public string? ClientName { get; set; }

    public string? EntityNumber { get; set; }

    public double? TotalHours { get; set; }

    public int? EvaluatedId { get; set; }

    public string? EvaluatedName { get; set; }

    public string? EvaluatedEmail { get; set; }

    public string? Bu { get; set; }

    public string? Office { get; set; }

    public string? Role { get; set; }

    public string? LocationName { get; set; }

    public decimal? GradeEvaluated { get; set; }

    public decimal? GradeEvaluator { get; set; }

    public int? EvaluatorId { get; set; }

    public string? EvaluatorName { get; set; }

    public string? EvaluatorEmail { get; set; }

    public bool? PreEvaRealiced { get; set; }

    public string EstatusAprob { get; set; } = null!;

    public string TipoEvDescrip { get; set; } = null!;

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? Fy { get; set; }

    public string IdColabEmpProy { get; set; } = null!;

    public int? TotalReactivos { get; set; }

    public int? TotalReactivosRes { get; set; }

    public string ProyectoColab { get; set; } = null!;

    public string? ResumeColA { get; set; }

    public string? ResumeColB { get; set; }

    public int? ResumeColC { get; set; }

    public int? ResumeColD { get; set; }

    public string? DetailColA { get; set; }

    public string? DetailColB { get; set; }

    public int? DetailColC { get; set; }

    public int? DetailColD { get; set; }
}
