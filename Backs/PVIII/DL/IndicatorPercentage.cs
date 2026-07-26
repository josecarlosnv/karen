using System;
using System.Collections.Generic;

namespace DL;

public partial class IndicatorPercentage
{
    public int IndicatorId { get; set; }

    public short IdIndicatorType { get; set; }

    public string? EntityGroupNumber { get; set; }

    public int Value { get; set; }

    public double Percentage { get; set; }

    public short FiscalYear { get; set; }
}
