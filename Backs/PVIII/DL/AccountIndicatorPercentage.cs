using System;
using System.Collections.Generic;

namespace DL;

public partial class AccountIndicatorPercentage
{
    public string EntityGroupNumber { get; set; } = null!;

    public int IndicatorId { get; set; }

    public short IndicatorTypeId { get; set; }

    public int FiscalYear { get; set; }

    public double Result { get; set; }
}
