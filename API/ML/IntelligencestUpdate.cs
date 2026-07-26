namespace API;

public class IntelligencestUpdate
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Area { get; set; } = "all";
    public string? Title { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Icon { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class IntelligencestUpdateDto
{
    public string Type { get; set; } = string.Empty;
    public string Area { get; set; } = "all";
    public string? Title { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Subtitle { get; set; }
    public string? Icon { get; set; }
    public bool IsActive { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
}
