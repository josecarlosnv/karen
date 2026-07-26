using System;
using System.Collections.Generic;

namespace DL;

public partial class CptTblComment
{
    public int PkCptComment { get; set; }

    public string IdForm { get; set; } = null!;

    public string EmployeeName { get; set; } = null!;

    public string? Comment { get; set; }

    public int? Fy { get; set; }

    public bool? IsCurrent { get; set; }

    public bool? IsFilter { get; set; }

    public DateTime? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }
}
