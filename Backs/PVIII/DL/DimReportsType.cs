using System;
using System.Collections.Generic;

namespace DL;

public partial class DimReportsType
{
    public int DimrtId { get; set; }

    public int? TypeId { get; set; }

    public string? TypeDescription { get; set; }

    public bool? Srrequired { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }
}
