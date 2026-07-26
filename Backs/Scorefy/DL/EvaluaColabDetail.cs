using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace DL;

public partial class EvaluaColabDetail
{
    public int EcdId { get; set; }

    public string IdColabEmpProy { get; set; } = null!;

    public int Competence { get; set; }

    public decimal? SubCompetence { get; set; }

    public string ReactiveNum { get; set; } = null!;

    public string? Role { get; set; }

    public int EvaluatedResp { get; set; }

    public int EvaluatorResp { get; set; }

    public string? EvaluatedComent { get; set; }

    public string? EvaluatorComent { get; set; }

    public bool? IsCurrent { get; set; }

    public DateOnly? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public DateTime? CreatedTime { get; set; }

    public DateTime? ModifiedTime { get; set; }


    [NotMapped] public int? CutOff { get; set; }
    [NotMapped] public bool? EvaluationType { get; set; }



}
