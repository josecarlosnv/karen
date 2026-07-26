using System;
using System.Collections.Generic;

namespace DL;

public partial class VwColaboradoresAudt
{
    public int? EmployeeId { get; set; }

    public string? FullName { get; set; }

    public string? LocalJobLevelName { get; set; }

    public decimal? CostCenter { get; set; }

    public string? CostCenterDescript { get; set; }

    public string? LocationName { get; set; }

    public bool? FullTime { get; set; }
}
