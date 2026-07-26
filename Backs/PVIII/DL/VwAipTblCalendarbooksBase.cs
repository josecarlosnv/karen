using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAipTblCalendarbooksBase
{
    public string FkUserId { get; set; } = null!;

    public int? FkAssignmentTypeId { get; set; }

    public int? WeekOfYear { get; set; }

    public int? Year { get; set; }

    public DateTime? StartOfWeek { get; set; }

    public DateTime? EndOfWeek { get; set; }

    public string? ClienteName { get; set; }

    public string? Proyecto { get; set; }

    public string? Un { get; set; }

    public long? RnSemana { get; set; }

    public int? Duration { get; set; }
}
