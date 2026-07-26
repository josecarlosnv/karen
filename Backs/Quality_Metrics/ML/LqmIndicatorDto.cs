namespace ML;

public sealed class LqmIndicatorDto
{
    public int CatIndicatorsKey { get; set; }
    public string IndicatorsUniqueKey { get; set; } = "";
    public string IndicatorLabel { get; set; } = "";
    public string MeasureDescription { get; set; } = "";
    public string IndicatorDescription { get; set; } = "";
    public string? SourceLabel { get; set; }
    public string? MaxMeasure { get; set; }
    public string? CurrentPerformance { get; set; }   // qualificationDescription
    public decimal Score { get; set; }
    public decimal Target { get; set; }   // objetivo/semilla del indicador (para el semáforo)
    public string? Message { get; set; }   // qualificationMessage (subtítulo de cada métrica)

    public bool CanEdit { get; set; }


}
