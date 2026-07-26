using System;
using System.Collections.Generic;

namespace DL;

public partial class CptDimRecurring
{
    public int IdRecurring { get; set; }

    public string DescriptionRecurring { get; set; } = null!;

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public virtual ICollection<CptTblProjectSpec> CptTblProjectSpecs { get; set; } = new List<CptTblProjectSpec>();
}
