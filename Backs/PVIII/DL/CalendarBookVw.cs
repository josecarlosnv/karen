using System;
using System.Collections.Generic;

namespace DL;

public partial class CalendarBookVw
{
    public int CalendarbooksId { get; set; }

    public int FkUserId { get; set; }

    public int FkCalendarId { get; set; }

    public int? FkTimeOffId { get; set; }

    public int? FkRequestId { get; set; }

    public int? FkProjectId { get; set; }

    public int? FkAssignmentTypeId { get; set; }

    public int? FkTraining { get; set; }

    public int? UpdateStatus { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? CreatedAt { get; set; }

    public int CalendarId { get; set; }

    public DateOnly Date { get; set; }

    public int? Year { get; set; }

    public string? MonthName { get; set; }

    public int? Day { get; set; }

    public int? DayOfWeek { get; set; }

    public int? WeekOfYear { get; set; }

    public DateOnly? StartOfWeek { get; set; }

    public DateOnly? EndOfWeek { get; set; }

    public string MonthYear { get; set; } = null!;

    public int? DateValue { get; set; }

    public int? Workday { get; set; }
}
