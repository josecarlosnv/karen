using System;
using System.Collections.Generic;

namespace DL;

public partial class AipFactGhostEmployee
{
    public int GhostEmployeeId { get; set; }

    public decimal? CostCenter { get; set; }

    public string FullName { get; set; } = null!;

    public string? LocalJobLevelName { get; set; }

    public int? FiscalYear { get; set; }

    public bool? Status { get; set; }

    public string? Accion { get; set; }

    public string? EmployeeAssignment { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? ModifiedAt { get; set; }
}
