using System;
using System.Collections.Generic;

namespace DL;

public partial class EmtTblAssignApprobal
{
    public int PkEmtassiAppr { get; set; }

    public decimal KeyEmt { get; set; }

    public bool? Pic { get; set; }

    public string? PicEmailAddressBusiness { get; set; }

    public string? PicComment { get; set; }

    public DateTime? PicDate { get; set; }

    public bool? Deputy { get; set; }

    public string? DeputyEmailAddressBusiness { get; set; }

    public string? DeputyComment { get; set; }

    public DateTime? DeputyDate { get; set; }

    public bool? Cppp { get; set; }

    public string? CpppEmailAddressBusiness { get; set; }

    public string? CpppComment { get; set; }

    public DateTime? CpppDate { get; set; }

    public bool? IsCurrent { get; set; }

    public int? EventNumber { get; set; }

    public DateTime? Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public decimal? ColumnA { get; set; }

    public decimal? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }
}
