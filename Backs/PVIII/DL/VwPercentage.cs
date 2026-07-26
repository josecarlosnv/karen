using System;
using System.Collections.Generic;

namespace DL;

public partial class VwPercentage
{
    public string? Bu { get; set; }

    public string? Office { get; set; }

    public string? FiscalYear { get; set; }

    public string Bupercentage { get; set; } = null!;

    public string OfficePercentage { get; set; } = null!;

    public string Percentage { get; set; } = null!;

    public int Quarter { get; set; }

    public decimal? Revenue { get; set; }
}
