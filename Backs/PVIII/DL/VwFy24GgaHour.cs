using System;
using System.Collections.Generic;

namespace DL;

public partial class VwFy24GgaHour
{
    public string? EmployeeId { get; set; }

    public string? EmployeeName { get; set; }

    public string Role { get; set; } = null!;

    public double? TotalHours { get; set; }

    public string? Bu { get; set; }

    public string? Category { get; set; }

    public decimal? Waiver { get; set; }

    public string? OtrasActividades { get; set; }

    public string? HorasCargablesPropias { get; set; }

    public decimal? ConditionalColumn { get; set; }
}
