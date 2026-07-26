using System;
using System.Collections.Generic;

namespace DL;

public partial class CatalogoCurso
{
    public int CcId { get; set; }

    public DateOnly Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public DateOnly? Modified { get; set; }

    public string? ModifiedBy { get; set; }

    public string Program { get; set; } = null!;

    public string Itemcourse { get; set; } = null!;

    public bool Validity { get; set; }

    public int FiscalYear { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }
}
