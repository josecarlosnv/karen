using System;
using System.Collections.Generic;

namespace DL;

public partial class WorkloadPercentage
{
    public int WpId { get; set; }

    public DateOnly Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int FiscalYear { get; set; }

    public string Bu { get; set; } = null!;

    public string Office { get; set; } = null!;

    public string Category { get; set; } = null!;

    public int Percentage { get; set; }

    public int Cuarter { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }
}
