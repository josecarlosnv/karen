using System;
using System.Collections.Generic;

namespace DL;

public partial class VwScorefySecondCutOff
{
    public string? ClientId { get; set; }

    public string? ClientName { get; set; }

    public int? EmployeeId { get; set; }

    public string? EmployeeName { get; set; }

    public string? Nivel { get; set; }

    public string? EmployeeEmail { get; set; }

    public string? Bu { get; set; }

    public string? Office { get; set; }

    public double? TotalHours { get; set; }

    public double? ChargeableHours { get; set; }

    public string CutOff { get; set; } = null!;
}
