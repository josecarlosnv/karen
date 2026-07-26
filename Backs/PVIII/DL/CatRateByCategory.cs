using System;
using System.Collections.Generic;

namespace DL;

public partial class CatRateByCategory
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

    public string? CurrencyCode { get; set; }

    public string? LevelId { get; set; }

    public int? HoursByLevel { get; set; }
}
