namespace ML;

public sealed class LqmQualScopeDto
{
    public string? DefaultEmployeeId { get; set; }
    public bool CanSelectUsers { get; set; }
    public List<LqmPersonDto> People { get; set; } = new();
}
