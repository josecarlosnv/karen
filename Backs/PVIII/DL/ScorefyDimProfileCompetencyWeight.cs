using System;
using System.Collections.Generic;

namespace DL;

public partial class ScorefyDimProfileCompetencyWeight
{
    public int CompetencyWeightId { get; set; }

    public int Fy { get; set; }

    public int CompetenciaId { get; set; }

    public string LocalJobLevelName { get; set; } = null!;

    public decimal Weight { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public bool? Vigencia { get; set; }
}
