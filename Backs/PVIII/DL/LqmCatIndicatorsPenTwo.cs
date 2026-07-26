using System;
using System.Collections.Generic;

namespace DL;

public partial class LqmCatIndicatorsPenTwo
{
    public int CatIndicatorsKey { get; set; }

    public int IndicatorsUniqueId { get; set; }

    public string? Fy { get; set; }

    public string? Sourcelabel { get; set; }

    public string? ApplicableTo { get; set; }

    public string IndicatorLabel { get; set; } = null!;

    public string IndicatorDescription { get; set; } = null!;

    public string MeasureDescription { get; set; } = null!;

    public string? Irmmeasure { get; set; }

    public string? IrmmaxMeasure { get; set; }

    public string? MaxMeasure { get; set; }

    public bool IsIrmapplied { get; set; }

    public string? DoesNotMeetQualityExpectations { get; set; }

    public string? PartiallyMeetQualityExpectations { get; set; }

    public string? ConsistentlyMeetsQualityExpectations { get; set; }

    public string? ExceedsQualityExpectations { get; set; }

    public string? IndicatorsUniqueKey { get; set; }
}
