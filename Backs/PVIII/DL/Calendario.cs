using System;
using System.Collections.Generic;

namespace DL;

public partial class Calendario
{
    public DateTime? Date { get; set; }

    public string? Year { get; set; }

    public string? Month { get; set; }

    public int? Day { get; set; }

    public int? WeekNum { get; set; }

    public int? Weekday { get; set; }

    public string? Holiday { get; set; }

    public int? HorasLab { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Created { get; set; }

    public string? ModifiedBy { get; set; }

    public DateTime? Modified { get; set; }

    public int? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int Id { get; set; }
}
