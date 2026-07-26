namespace ML;

public class LqmPerformanceScopeDto
{
    public string? MyEmployeeId { get; set; }
    public bool CanSelectUsers { get; set; }
    public string Scope { get; set; } = "Self";
    public List<LqmPersonDto> People { get; set; } = new();
}
