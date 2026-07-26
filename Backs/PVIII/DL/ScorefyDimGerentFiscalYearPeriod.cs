using System;
using System.Collections.Generic;

namespace DL;

public partial class ScorefyDimGerentFiscalYearPeriod
{
    public int Id { get; set; }

    public int? FiscalYearPeriod { get; set; }

    public string? ColumnA { get; set; }

    public int? IsCutOff { get; set; }

    public int? IsFirstCutOff { get; set; }

    public int? IsSecondCutOff { get; set; }
}
