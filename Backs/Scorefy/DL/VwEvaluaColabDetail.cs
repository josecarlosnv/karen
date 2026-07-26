using System;
using System.Collections.Generic;

namespace DL;

public partial class VwEvaluaColabDetail
{
    public int EvaluatedResp { get; set; }

    public int EvaluatorResp { get; set; }

    public string? EvaluatedComent { get; set; }

    public string? EvaluatorComent { get; set; }

    public string IdColabEmpProy { get; set; } = null!;

    public int EcdId { get; set; }

    public int Competence { get; set; }

    public decimal? SubCompetence { get; set; }

    public string? CompetenciaDescrip { get; set; }

    public string? SubCompetenciaDescrip { get; set; }

    public string? ReactivoDescrip { get; set; }

    public string ReactiveNum { get; set; } = null!;



}
