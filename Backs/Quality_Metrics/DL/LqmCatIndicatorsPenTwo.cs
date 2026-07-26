namespace DL;

public partial class LqmCatIndicatorsPenTwo
{
    public int CatIndicatorsKey { get; set; }
    public string IndicatorLabel { get; set; } = null!;
    public string MeasureDescription { get; set; } = null!;
    public string IndicatorDescription { get; set; } = null!;
    public string? DoesNotMeetQualityExpectations { get; set; }
    public string? PartiallyMeetQualityExpectations { get; set; }
    public string? ConsistentlyMeetsQualityExpectations { get; set; }
    public string? ExceedsQualityExpectations { get; set; }
    public int IndicatorsUniqueId { get; set; }
    public bool IsIrmApplied { get; set; }
    public string? SourceLabel { get; set; }
    public string? Fy { get; set; }                     // "2026"
    public string? IrmMeasure { get; set; }             // IRMMeasure
    public string? IrmMaxMeasure { get; set; }          // IRMMaxMeasure
    public string? IndicatorsUniqueKey { get; set; }    // computed, "101-2026"
    public string? ApplicableTo { get; set; }           // "PyD" | "HOFA"
    public string? MaxMeasure { get; set; }             // MaxMeasure (ej. "-10%", "1.50%")
}
