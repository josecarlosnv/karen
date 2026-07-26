using System;
using System.Collections.Generic;

namespace DL;

public partial class VwReactivosEdpinciso
{
    public string? Nivel { get; set; }

    public int? Competencia { get; set; }

    public string? CompetenciaDescrip { get; set; }

    public decimal? SubCompetencia { get; set; }

    public string? SubCompetenciaDescrip { get; set; }

    public string NumReactivo { get; set; } = null!;

    public string? ReactivoDescrip { get; set; }
}
