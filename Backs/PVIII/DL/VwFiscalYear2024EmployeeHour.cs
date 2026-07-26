using System;
using System.Collections.Generic;

namespace DL;

public partial class VwFiscalYear2024EmployeeHour
{
    public string? EmployeeId { get; set; }

    public string? EmployeeName { get; set; }

    public string Role { get; set; } = null!;

    public double? TotalHours { get; set; }
}
