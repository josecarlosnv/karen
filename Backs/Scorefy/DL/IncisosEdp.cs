using System;
using System.Collections.Generic;

namespace DL;

public partial class IncisosEdp
{
    public int IdtRedp { get; set; }

    public string? Nivel { get; set; }

    public int? Competencia { get; set; }

    public string? CompetenciaDescrip { get; set; }

    public decimal? SubCompetencia { get; set; }

    public string? SubCompetenciaDescrip { get; set; }

    public string NumReactivo { get; set; } = null!;

    public string? ReactivoDescrip { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public bool? Vigencia { get; set; }

    public int? Fy { get; set; }
}
