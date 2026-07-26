using System;
using System.Collections.Generic;

namespace DL;

public partial class CptTblEvalDdicertification
{
    public int PkCptEvalCert { get; set; }

    public string IdForm { get; set; } = null!;

    public bool IsNoteworthyDerogative { get; set; }

    public string? IsNoteworthyDerogativeDesc { get; set; }

    public bool Certification { get; set; }

    public int? Fy { get; set; }

    public bool? IsLost { get; set; }

    public bool? IsCurrent { get; set; }

    public DateTime? Created { get; set; }

    public string? CreatedBy { get; set; }

    public DateTime? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public int? ColumnA { get; set; }

    public int? ColumnB { get; set; }

    public string? ColumnC { get; set; }

    public string? ColumnD { get; set; }
}
