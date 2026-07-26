using System;
using System.Collections.Generic;

namespace DL;

public partial class WlTblBupicApproval
{
    public int WeId { get; set; }

    public DateTime Created { get; set; }

    public string CreatedBy { get; set; } = null!;

    public int FiscalYear { get; set; }

    public bool Validity { get; set; }

    public string Bu { get; set; } = null!;

    public string? Comments { get; set; }

    public int ReviewTypeId { get; set; }

    public int RoleType { get; set; }

    public int ApprovalType { get; set; }

    public string? Key { get; set; }

    public string? ColumnA { get; set; }

    public string? ColumnB { get; set; }

    public int? ColumnC { get; set; }

    public int? ColumnD { get; set; }

    public bool? ColumnE { get; set; }

    public bool? ColumnF { get; set; }

    public virtual DimBu BuNavigation { get; set; } = null!;

    public virtual DimFiscalYear FiscalYearNavigation { get; set; } = null!;

    public virtual DimQuarter ReviewType { get; set; } = null!;
}
