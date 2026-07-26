using System;
using System.Collections.Generic;

namespace DL;

public partial class VwAipTblCalendarbooksAgrupado
{
    public string? FkUserId { get; set; }

    public int? FkAssignmentTypeId { get; set; }

    public int? WeekOfYear { get; set; }

    public int? Year { get; set; }

    public DateTime? StartOfWeek { get; set; }

    public DateTime? EndOfWeek { get; set; }

    public string? ClienteName { get; set; }

    public string? Proyecto { get; set; }

    public string? Un { get; set; }

    public int? TotalRegistros { get; set; }
}
