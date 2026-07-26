using System;
using System.Collections.Generic;

namespace DL;

public partial class TblAoTe
{
    public long? EmployeeId { get; set; }

    public int? Fy { get; set; }

    public string? Course { get; set; }

    public int? CompleteCourses { get; set; }

    public int? TotalCourses { get; set; }

    public double? ProgressPercentage { get; set; }

    public int AoTePk { get; set; }
}
