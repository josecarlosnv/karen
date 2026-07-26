using System;
using System.Collections.Generic;

namespace DL;

public partial class VwScorefyEmployee
{
    public string FullName { get; set; } = null!;

    public string? LocalJobLevelName { get; set; }

    public string? CostCenter { get; set; }

    public int? EmployeeId { get; set; }

    public string? LocationName { get; set; }

    public string? EmailAddressBusiness { get; set; }

    public string? Bu { get; set; }

    public int? EmployeeType { get; set; }

    public int IsActive { get; set; }

    public string? PerformanceManager { get; set; }

    public string? Pmemail { get; set; }

    public string? EnglishLevel { get; set; }

    public string IsGraduated { get; set; } = null!;

    public string? AllEvaluationsCompleted { get; set; }

    public int? CompletedEvaluations { get; set; }

    public int? PendingEvaluations { get; set; }

    public int? TotalEvaluations { get; set; }

    public string? Segmento { get; set; }

    public string ManagerPerformanceConclusionStatus { get; set; } = null!;
}
