using System;
using System.Collections.Generic;

namespace DL;

public partial class RiesgoProyecto
{
    public string RiesgosProyectosId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string IdP8 { get; set; } = null!;

    public int? CeacId { get; set; }

    public int? GisId { get; set; }

    public int? EngagementId { get; set; }

    public string? CreatedBy { get; set; }

    public DateOnly? CreatedOn { get; set; }

    public string? ModifiedBy { get; set; }

    public DateOnly? ModifiedOn { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }
}
