namespace ML;

public sealed class LqmQualificationsDto
{
    public string EmployeeId { get; set; } = "";
    public string LeaderDataUniqueKey { get; set; } = "";
    public string Fy { get; set; } = "";
    public bool CanEdit { get; set; }
    public decimal TotalScore { get; set; }
    public bool CanEditWaiver { get; set; }

    public List<LqmIndicatorDto> Indicators { get; set; } = new();
}
