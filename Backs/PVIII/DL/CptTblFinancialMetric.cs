using System;
using System.Collections.Generic;

namespace DL;

public partial class CptTblFinancialMetric
{
    public int PkCptFinMet { get; set; }

    public string IdForm { get; set; } = null!;

    public int AuditFee { get; set; }

    public int AuditNumDeliverables { get; set; }

    public int? AuditAvgxDeliverables { get; set; }

    public int AuditHours { get; set; }

    public int? AuditAvgxHours { get; set; }

    public bool IsFiscalMandatory { get; set; }

    public int? FiscalFee { get; set; }

    public int? FiscalNumDeliverables { get; set; }

    public int? FiscalOpNumDeliverables { get; set; }

    public int? FiscalAvgxDeliverables { get; set; }

    public int? FiscalHours { get; set; }

    public int? FiscalAvgxHours { get; set; }

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
