using System;
using System.Collections.Generic;

namespace DL;

public partial class LqmTblPenOneMetric
{
    public int LeaderMetricsKey { get; set; }

    public string EmployeeId { get; set; } = null!;

    public int FiscalYearLabel { get; set; }

    public string OpenPd { get; set; } = null!;

    public string ClientsGainedText { get; set; } = null!;

    public string ClientsLostText { get; set; } = null!;

    public string KeyActivitiesAssignments { get; set; } = null!;

    public string AcademicTeachingInstitution { get; set; } = null!;

    public string AdvancedDegreesCertifications { get; set; } = null!;

    public bool IsAdvanceCapabilitiesUsed { get; set; }

    public bool IsMapJeUsed { get; set; }

    public bool IsDatasnipperFssUsed { get; set; }

    public bool IsKcwRolloverUsed { get; set; }

    public string CreatedByUserEmail { get; set; } = null!;

    public DateTime CreatedDateTime { get; set; }

    public string? UpdatedByUserEmail { get; set; }

    public DateTime? UpdatedDateTime { get; set; }

    public string? LeaderKey { get; set; }
}
