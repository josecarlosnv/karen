namespace ML;

public class LqmMetricsDto
{
    public string EmployeeId { get; set; } = "";
    public int FiscalYearLabel { get; set; }
    public string? OpenPD { get; set; }
    public string? ClientsGainedText { get; set; }
    public string? ClientsLostText { get; set; }
    public string? KeyActivitiesAssignments { get; set; }
    public string? AcademicTeachingInstitution { get; set; }
    public string? AdvancedDegreesCertifications { get; set; }
    public bool IsAdvanceCapabilitiesUsed { get; set; }
    public bool IsMapJeUsed { get; set; }
    public bool IsDatasnipperFssUsed { get; set; }
    public bool IsKcwRolloverUsed { get; set; }
}
