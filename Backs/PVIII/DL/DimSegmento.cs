using System;
using System.Collections.Generic;

namespace DL;

public partial class DimSegmento
{
    public int DSId { get; set; }

    public int? CostCenter { get; set; }

    public string Bu { get; set; } = null!;

    public string Office { get; set; } = null!;

    public int ProfitCenter { get; set; }

    public string ProfitCenterDesc { get; set; } = null!;

    public string CostCenterDesc { get; set; } = null!;

    public string NombreProducto { get; set; } = null!;

    public int BusinessArea { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }
}
