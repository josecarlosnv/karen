using System;
using System.Collections.Generic;

namespace DL;

public partial class AipDimCalendar
{
    public int CalendarId { get; set; }

    public DateOnly Date { get; set; }

    public int DateValueNum { get; set; }

    public int Year { get; set; }

    public string MonthName { get; set; } = null!;

    public int Day { get; set; }

    public int DayOfWeek { get; set; }

    public int WeekOfYear { get; set; }

    public DateOnly? StartOfWeek { get; set; }

    public DateOnly? EndOfWeek { get; set; }

    public string MonthYear { get; set; } = null!;

    public int DateValue { get; set; }

    public bool Workday { get; set; }

    public DateOnly? StartOfMonth { get; set; }

    public DateOnly EndOfMonth { get; set; }
}
