using System;
using System.Collections.Generic;

namespace DL;

public partial class CptDimFyaudit
{
    public int IdFyaudit { get; set; }

    public int DescriptionFyaudit { get; set; }

    public bool? IsCfy { get; set; }

    public bool? IsPfy { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public virtual ICollection<CptTblProjectSpec> CptTblProjectSpecs { get; set; } = new List<CptTblProjectSpec>();
}
