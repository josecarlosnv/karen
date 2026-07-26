using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAipTblCalendarbook
{
    public string FkUserId { get; set; } = null!;

    public int? FkAssignmentTypeId { get; set; }

    public int IdCalendar { get; set; }

    public DateTime WorkDate { get; set; }

    public int? FkTimeoffId { get; set; }

    public string? FkProjectId { get; set; }

    public string? ClienteName { get; set; }

    public string? Proyecto { get; set; }

    public string? Un { get; set; }

    public int? Duration { get; set; }

    public int UpdateStatus { get; set; }

    public int? Workday { get; set; }

    public int? DayOfWeek { get; set; }

    public int? WeekOfYear { get; set; }

    public string? MonthName { get; set; }

    public int? FkTraining { get; set; }

    public int? Year { get; set; }

    public DateTime? StartOfWeek { get; set; }

    public DateTime? EndOfWeek { get; set; }

    public int? DateValue { get; set; }

    public int? Organizacion { get; set; }
}
