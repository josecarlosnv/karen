using System;
using System.Collections.Generic;

namespace DL;

public partial class VwReacTabDpe
{
    public int RespAutoeval { get; set; }

    public int RespEvaluador { get; set; }

    public string? ComenAutoeval { get; set; }

    public string? ComenEvaluador { get; set; }

    public string? IdColabEmpProy { get; set; }

    public int DpeId { get; set; }

    public string Competencia { get; set; } = null!;

    public decimal? SubCompetenciaNum { get; set; }

    public string? CompetenciaDescrip { get; set; }

    public string? SubCompetenciaDescrip { get; set; }

    public string? ReactivoDescrip { get; set; }

    public string NumReactivo { get; set; } = null!;
}
