using System;
using System.Collections.Generic;

namespace DL;

public partial class CptDimOpinionTypePy
{
    public int IdOpinionTypePy { get; set; }

    public string DescriptionOpinionTypePy { get; set; } = null!;

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public virtual ICollection<CptTblProjectSpec> CptTblProjectSpecs { get; set; } = new List<CptTblProjectSpec>();
}
