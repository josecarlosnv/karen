namespace ML;

public sealed class LqmHofaReportRowDto
{
    public string EmployeeId { get; set; } = "";
    public string? Name { get; set; }
    public string? Title { get; set; }
    public string? BusinessUnit { get; set; }
    public string? Office { get; set; }
    public bool CanEdit { get; set; }

    public decimal BuScore { get; set; }              // normalizado 0-10
    public List<LqmIndicatorDto> Indicators { get; set; } = new();
}
