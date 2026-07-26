using System;
using System.Collections.Generic;

namespace DL;

public partial class VwScorefyEmployee
{
    public string FullName { get; set; } = null!;

    public string? LocalJobLevelName { get; set; }

    public string? CostCenter { get; set; }

    public int EmployeeId { get; set; }

    public string? LocationName { get; set; }

    public string? EmailAddressBusiness { get; set; }

    public string? Bu { get; set; }

    public int? EmployeeType { get; set; }

    public int IsActive { get; set; }


    public string? PerformanceManager { get; set; }             // varchar(250)
    public string? PMEmail { get; set; }                        // varchar(100)
    public string? English_Level { get; set; }                  // varchar(13)
    public string? Is_Graduated { get; set; }                   // varchar(7)
    public string? AllEvaluationsCompleted { get; set; }        // varchar(3)

    public int? CompletedEvaluations { get; set; }               // int
    public int? PendingEvaluations { get; set; }                 // int
    public int? TotalEvaluations { get; set; }
    public string? Segmento { get; set; }
    public string? ManagerPerformanceConclusionStatus { get; set; }

}
