namespace ML;

public sealed class LqmWorkloadPersonDto
{
    public string EmployeeId { get; set; } = "";
    public string? Name { get; set; }
    public string? Title { get; set; }
    public string Category { get; set; } = "";
    public decimal? TotalHours { get; set; }
    public int? HoursTarget { get; set; }
    public string? Waiver { get; set; }
    public decimal? NonClientFacingHours { get; set; }
    public decimal? HoursLsqcr { get; set; }
    public decimal? HoursEqcr { get; set; }
    public string? Activities { get; set; }
    public int? ComplianceValidation { get; set; }   // 1/3 cumple · 2 no · null sin dato
}

public sealed class LqmWorkloadDto
{
    public List<LqmWorkloadPersonDto> PartnersDirectors { get; set; } = new();
    public List<LqmWorkloadPersonDto> Managers { get; set; } = new();
}

public sealed class LqmWaiverSaveDto
{
    public string Waiver { get; set; } = "";
}
