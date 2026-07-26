using System;
using System.Collections.Generic;

namespace DL;

public partial class CptTblHubreport
{
    public int PkCptHubre { get; set; }

    public string IdForm { get; set; } = null!;

    public DateOnly? CloseDate { get; set; }

    public decimal? IdOportunity { get; set; }

    public int? IdWorkStatus { get; set; }

    public string? Comments { get; set; }

    public int? Fy { get; set; }

    public bool? IsLost { get; set; }

    public bool? IsCurrent { get; set; }

    public DateTime? Created { get; set; }

    public string? CreatedBy { get; set; }

    public string? CreatedName { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }
}
