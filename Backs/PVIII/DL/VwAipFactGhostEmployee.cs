using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAipFactGhostEmployee
{
    public int GhostEmployeeId { get; set; }

    public decimal? CostCenter { get; set; }

    public string FullName { get; set; } = null!;

    public string? LocalJobLevelName { get; set; }

    public int? FiscalYear { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime? Created { get; set; }

    public string? Oficina { get; set; }

    public string? Bu { get; set; }

    public string? CostCenterDescrip { get; set; }
}
