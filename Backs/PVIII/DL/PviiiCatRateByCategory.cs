using System;
using System.Collections.Generic;

namespace DL;

public partial class PviiiCatRateByCategory
{
    public int RateByCategoryId { get; set; }

    public int CostCenterId { get; set; }

    public string LevelLabel { get; set; } = null!;

    public int FiscalYearLabel { get; set; }

    public decimal CategoryRate { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public int? SegmentId { get; set; }

    public string? SegmentLabel { get; set; }
}
