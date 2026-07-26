using System;
using System.Collections.Generic;

namespace DL;

public partial class SelfStudyCompliance
{
    public string EmployeeId { get; set; } = null!;

    public string? EmployeeName { get; set; }

    public string PositionName { get; set; } = null!;

    public string? CostCenter { get; set; }

    public string? CostCenterName { get; set; }

    public string PracticeName { get; set; } = null!;

    public string? ItemCourse { get; set; }

    public string CourseName { get; set; } = null!;

    public string CourseType { get; set; } = null!;

    public decimal? HoursToConsider { get; set; }

    public string? Status { get; set; }

    public int FiscalYearName { get; set; }
}
