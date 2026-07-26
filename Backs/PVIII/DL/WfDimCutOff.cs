using System;
using System.Collections.Generic;

namespace DL;

public partial class WfDimCutOff
{
    public DateOnly FechaDeCorte { get; set; }

    public bool? Cutoff01 { get; set; }

    public byte[]? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public string? ColumnC { get; set; }
}
