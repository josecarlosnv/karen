using System;
using System.Collections.Generic;

namespace DL;

public partial class Presupuesto
{
    public int PId { get; set; }

    public int FiscalYear { get; set; }

    public string Bu { get; set; } = null!;

    public string? Office { get; set; }

    public int Revenue { get; set; }

    public int? Hours { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }
}
