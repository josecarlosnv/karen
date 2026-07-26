using System;
using System.Collections.Generic;

namespace DL;

public partial class ScorefyTblException
{
    public int PkScorExceptions { get; set; }

    public string KeyReport { get; set; } = null!;

    public bool? IsException { get; set; }

    public string? ReasonException { get; set; }

    public int? Fy { get; set; }

    public bool? IsCurrent { get; set; }

    public int? EventNumber { get; set; }

    public DateTime? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }

    public string OwnerEmail { get; set; } = null!;
}
