using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAipCbText
{
    public int PkCalendarbooksId { get; set; }

    public int FkUserId { get; set; }

    public string AssignmentType { get; set; } = null!;

    public int StartDate { get; set; }

    public int EndDate { get; set; }

    public DateTime WorkDate { get; set; }

    public decimal HoursForDay { get; set; }

    public int UpdateStatus { get; set; }

    public int? Workday { get; set; }

    public int? DayOfWeek { get; set; }
}
