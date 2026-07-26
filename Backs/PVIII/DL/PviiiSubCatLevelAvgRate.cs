using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiSubCatLevelAvgRate
{
    public int LevelAvgRateId { get; set; }

    public string BreakdownLevel { get; set; } = null!;

    public string ServiceLineLabel { get; set; } = null!;

    public string OfficeLabel { get; set; } = null!;

    public int CostCenter { get; set; }

    public string CostCenterLabel { get; set; } = null!;

    public string FunctionLabel { get; set; } = null!;

    public decimal AverageRate { get; set; }

    public string CreatedByUserEmail { get; set; } = null!;

    public DateTime CreatedDateTime { get; set; }
}
