namespace DL;

public partial class LqmTblPenOneMetric
{
    public int LeaderMetricsKey { get; set; }
    public string EmployeeId { get; set; } = null!;                 // char(8)
    public int FiscalYearLabel { get; set; }                        // int
    public string OpenPD { get; set; } = null!;                     // nvarchar(60) -> texto
    public string ClientsGainedText { get; set; } = null!;
    public string ClientsLostText { get; set; } = null!;
    public string KeyActivitiesAssignments { get; set; } = null!;
    public string AcademicTeachingInstitution { get; set; } = null!;
    public string AdvancedDegreesCertifications { get; set; } = null!;
    public bool IsAdvanceCapabilitiesUsed { get; set; }
    public bool IsMapJeUsed { get; set; }
    public bool IsDatasnipperFssUsed { get; set; }
    public bool IsKcwRolloverUsed { get; set; }
    public string CreatedByUserEmail { get; set; } = null!;         // NOT NULL
    public DateTime CreatedDateTime { get; set; }                   // NOT NULL
    public string? UpdatedByUserEmail { get; set; }                 // NULL
    public DateTime? UpdatedDateTime { get; set; }                  // NULL
}
