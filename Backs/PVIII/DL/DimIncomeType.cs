using System;
using System.Collections.Generic;

namespace DL;

public partial class DimIncomeType
{
    public int Id { get; set; }

    public string? Description { get; set; }

    public bool? Active { get; set; }

    public int? IsPfy { get; set; }

    public int? IsCfy { get; set; }

    public int? IsFfy { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }
}
