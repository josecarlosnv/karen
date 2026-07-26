using System;
using System.Collections.Generic;

namespace DL;

public partial class LqmCatLeaderHour
{
    public int LeaderHoursKey { get; set; }

    public string LeaderEmployeeId { get; set; } = null!;

    public string Fy { get; set; } = null!;

    public string? LeaderDataUniqueKey { get; set; }

    public decimal? TotalHours { get; set; }

    public string? Waiver { get; set; }

    public int? HoursTarget { get; set; }

    public DateOnly? JobEntryDate { get; set; }

    public int? ComplianceValidation { get; set; }

    public bool? ActiveWaiver { get; set; }
}
