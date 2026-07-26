using System;
using System.Collections.Generic;

namespace DL;

public partial class VwPviiiValuationBreakdown
{
    public string P8Id { get; set; } = null!;

    public string LevelLabel { get; set; } = null!;

    public int P8FiscalYear { get; set; }

    public decimal? Hours { get; set; }

    public decimal? Fees { get; set; }

    public int LevelSortOrder { get; set; }
}
